const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../../config");
const prisma = require("../../config/prisma");

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const SYSTEM_PROMPT = `You are an expert career roadmap generator for EduGuide AI.
Generate detailed, actionable career roadmaps with phases, tasks, resources, milestones, and skills.
Always return valid JSON matching the requested schema. Never include markdown fences or extra text.`;

const PHASE_SCHEMA = {
  title: "string - Phase name",
  description: "string - Phase overview",
  duration: "string - Estimated duration (e.g. '3 months')",
  tasks: [
    {
      title: "string",
      description: "string",
      priority: "high | medium | low",
      estimatedTime: "string",
      skills: ["string"],
    },
  ],
  resources: [
    {
      title: "string",
      type: "course | book | website | video | tool",
      url: "string | null",
      provider: "string",
      isFree: "boolean",
    },
  ],
  milestones: [
    {
      title: "string",
      description: "string",
      criteria: "string - How to know this milestone is achieved",
    },
  ],
  skillsLearned: ["string"],
};

async function fetchStudentData(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profile: {
        include: {
          academicRecords: { include: { subjectMarks: true } },
          interests: true,
          careerGoals: true,
          strengths: true,
          weaknesses: true,
          skills: { include: { skill: true } },
          certifications: true,
        },
      },
    },
  });

  if (!user || !user.profile) {
    throw new Error("Student profile not found. Please complete your profile first.");
  }

  return user;
}

function buildStudentSummary(user) {
  const p = user.profile;
  const academics = p.academicRecords.map((ar) => ({
    institution: ar.institution,
    degree: ar.degree,
    fieldOfStudy: ar.fieldOfStudy,
    year: ar.year,
    gpa: ar.gpa,
    percentage: ar.percentage,
    subjects: ar.subjectMarks.map((s) => ({
      name: s.subjectName,
      marks: s.marks,
      maxMarks: s.maxMarks,
      grade: s.grade,
    })),
  }));

  const skills = p.skills.map((s) => ({
    name: s.skill.name,
    category: s.skill.category,
    level: s.level,
    yearsExp: s.yearsExp,
  }));

  return {
    name: `${user.firstName} ${user.lastName}`,
    interests: p.interests.map((i) => ({ name: i.name, category: i.category, level: i.level })),
    careerGoals: p.careerGoals.map((g) => ({ title: g.title, description: g.description, targetYear: g.targetYear })),
    strengths: p.strengths.map((s) => ({ name: s.name, category: s.category, evidence: s.evidence })),
    weaknesses: p.weaknesses.map((w) => ({ name: w.name, category: w.category, evidence: w.evidence })),
    skills,
    certifications: p.certifications.map((c) => ({ name: c.name, issuer: c.issuer })),
    academics,
  };
}

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text().trim();

  // Strip markdown code fences if present
  if (text.startsWith("```json")) {
    text = text.slice(7);
  } else if (text.startsWith("```")) {
    text = text.slice(3);
  }
  if (text.endsWith("```")) {
    text = text.slice(0, -3);
  }

  return JSON.parse(text.trim());
}

async function generateRoadmap(userId, targetCareer) {
  if (!targetCareer || typeof targetCareer !== "string") {
    throw new Error("Target career is required");
  }

  const user = await fetchStudentData(userId);
  const studentSummary = buildStudentSummary(user);

  const prompt = `Generate a comprehensive career roadmap for a student aiming to become a "${targetCareer}".

Student Profile:
${JSON.stringify(studentSummary, null, 2)}

Return a JSON object with this exact structure:
{
  "title": "Roadmap: [target career]",
  "description": "A comprehensive roadmap tailored for ${user.firstName} to achieve their goal of becoming a ${targetCareer}",
  "targetCareer": "${targetCareer}",
  "estimatedDuration": "total duration string",
  "phases": [
    {
      "title": "Foundation Phase",
      "description": "Build the fundamental knowledge and skills",
      "duration": "e.g. 3-4 months",
      "tasks": [
        {
          "title": "task title",
          "description": "detailed description",
          "priority": "high | medium | low",
          "estimatedTime": "e.g. 2 weeks",
          "skills": ["skill1", "skill2"]
        }
      ],
      "resources": [
        {
          "title": "resource title",
          "type": "course | book | website | video | tool",
          "url": "url or null",
          "provider": "provider name",
          "isFree": true
        }
      ],
      "milestones": [
        {
          "title": "milestone title",
          "description": "what this milestone means",
          "criteria": "how to verify completion"
        }
      ],
      "skillsLearned": ["skill1", "skill2"]
    },
    { same for Intermediate Phase },
    { same for Advanced Phase },
    { same for Professional Phase (job ready) }
  ],
  "reasoning": [
    "reason 1 why this roadmap was chosen",
    "reason 2"
  ]
}

Create exactly 4 phases:
1. Foundation Phase - basics, prerequisites
2. Intermediate Phase - core skills, projects
3. Advanced Phase - specialization, advanced projects
4. Professional Phase - job readiness, portfolio, interview prep

Tailor tasks and resources to the student's existing skills and academic background.
Prioritize high-impact activities that align with the target career.`;

  const roadmapData = await callGemini(prompt);

  // Store in database
  const roadmap = await prisma.careerRoadmap.create({
    data: {
      userId,
      title: roadmapData.title,
      description: roadmapData.description || null,
      targetCareer,
      phases: roadmapData.phases,
      progress: 0,
      isCompleted: false,
    },
  });

  return {
    roadmap,
    reasoning: roadmapData.reasoning || [],
    estimatedDuration: roadmapData.estimatedDuration || null,
  };
}

async function getRoadmapById(roadmapId, userId) {
  const roadmap = await prisma.careerRoadmap.findUnique({
    where: { id: roadmapId },
  });

  if (!roadmap) {
    throw new Error("Roadmap not found");
  }

  if (roadmap.userId !== userId) {
    throw new Error("Not authorized to access this roadmap");
  }

  return roadmap;
}

async function updateRoadmapProgress(roadmapId, userId, progress) {
  const roadmap = await getRoadmapById(roadmapId, userId);

  if (progress < 0 || progress > 100) {
    throw new Error("Progress must be between 0 and 100");
  }

  const updated = await prisma.careerRoadmap.update({
    where: { id: roadmapId },
    data: {
      progress,
      isCompleted: progress === 100,
    },
  });

  return updated;
}

async function deleteRoadmap(roadmapId, userId) {
  const roadmap = await getRoadmapById(roadmapId, userId);
  await prisma.careerRoadmap.delete({ where: { id: roadmapId } });
  return { deleted: true };
}

async function getUserRoadmaps(userId) {
  return prisma.careerRoadmap.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  generateRoadmap,
  getRoadmapById,
  updateRoadmapProgress,
  deleteRoadmap,
  getUserRoadmaps,
};
