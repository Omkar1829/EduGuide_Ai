const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../../config");
const prisma = require("../../config/prisma");

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const ANALYSIS_PROMPT = `You are an expert resume analyzer and career coach.
Analyze resumes thoroughly and provide actionable feedback.
Always return valid JSON matching the requested schema. Do not include markdown fences or extra text.`;

async function fetchStudentProfile(userId) {
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
    return null;
  }

  const p = user.profile;
  return {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    interests: p.interests.map((i) => ({ name: i.name, category: i.category })),
    careerGoals: p.careerGoals.map((g) => ({ title: g.title, description: g.description })),
    strengths: p.strengths.map((s) => ({ name: s.name, category: s.category })),
    weaknesses: p.weaknesses.map((w) => ({ name: w.name, category: w.category })),
    skills: p.skills.map((s) => ({
      name: s.skill.name,
      category: s.skill.category,
      level: s.level,
      yearsExp: s.yearsExp,
    })),
    certifications: p.certifications.map((c) => ({
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate,
    })),
    academics: p.academicRecords.map((ar) => ({
      institution: ar.institution,
      degree: ar.degree,
      fieldOfStudy: ar.fieldOfStudy,
      gpa: ar.gpa,
      percentage: ar.percentage,
      subjects: ar.subjectMarks.map((s) => ({
        name: s.subjectName,
        marks: s.marks,
        grade: s.grade,
      })),
    })),
  };
}

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: ANALYSIS_PROMPT,
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text().trim();

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

function calculateATSScore(parsedContent, studentProfile) {
  let score = 0;
  const issues = [];
  const improvements = [];

  // Section presence checks
  const requiredSections = ["contact", "experience", "education", "skills"];
  for (const section of requiredSections) {
    if (parsedContent[section] && parsedContent[section].length > 0) {
      score += 15;
    } else {
      issues.push(`Missing or empty section: ${section}`);
    }
  }

  // Contact info
  if (parsedContent.contact) {
    if (parsedContent.contact.email) score += 5;
    else issues.push("No email found in contact section");
    if (parsedContent.contact.phone) score += 5;
    else improvements.push("Add a phone number for better ATS compatibility");
    if (parsedContent.contact.location) score += 3;
  }

  // Skills keyword matching
  if (parsedContent.skills && studentProfile) {
    const resumeSkillLower = parsedContent.skills.map((s) =>
      typeof s === "string" ? s.toLowerCase() : s.name?.toLowerCase() || ""
    );
    const profileSkillLower = studentProfile.skills.map((s) => s.name.toLowerCase());
    const matchedSkills = resumeSkillLower.filter((s) => profileSkillLower.includes(s));
    if (matchedSkills.length > 0) score += 10;
    const missingSkills = profileSkillLower.filter((s) => !resumeSkillLower.includes(s));
    if (missingSkills.length > 0) {
      improvements.push(`Add these profile skills to resume: ${missingSkills.slice(0, 5).join(", ")}`);
    }
  }

  // Experience section
  if (parsedContent.experience && parsedContent.experience.length > 0) {
    score += 10;
    const hasDescriptions = parsedContent.experience.every(
      (e) => e.description && e.description.length > 20
    );
    if (!hasDescriptions) {
      improvements.push("Add detailed descriptions with quantifiable achievements for each role");
    }
  }

  // Education section
  if (parsedContent.education && parsedContent.education.length > 0) {
    score += 10;
  }

  // Length check
  const totalLength = JSON.stringify(parsedContent).length;
  if (totalLength < 200) {
    issues.push("Resume content appears too short");
  } else if (totalLength > 5000) {
    improvements.push("Consider reducing resume length for better ATS parsing");
  }

  return {
    score: Math.min(100, score),
    issues,
    improvements,
  };
}

async function analyzeResume(userId, resumeContent, fileName) {
  if (!resumeContent || typeof resumeContent !== "string") {
    throw new Error("Resume content is required");
  }

  const studentProfile = await fetchStudentProfile(userId);

  const profileSection = studentProfile
    ? `Student Profile for cross-reference:
${JSON.stringify(studentProfile, null, 2)}`
    : "No student profile available for cross-reference.";

  const prompt = `Analyze this resume and return a comprehensive analysis.

Resume Content:
${resumeContent}

${profileSection}

Return a JSON object with this exact structure:
{
  "parsedContent": {
    "contact": {
      "name": "string | null",
      "email": "string | null",
      "phone": "string | null",
      "location": "string | null",
      "linkedin": "string | null",
      "portfolio": "string | null"
    },
    "summary": "string | null - professional summary/objective",
    "experience": [
      {
        "title": "job title",
        "company": "company name",
        "duration": "time period",
        "description": "role description",
        "achievements": ["achievement1", "achievement2"]
      }
    ],
    "education": [
      {
        "institution": "school name",
        "degree": "degree type",
        "fieldOfStudy": "field",
        "year": "graduation year",
        "gpa": "gpa if listed"
      }
    ],
    "skills": ["skill1", "skill2"],
    "certifications": ["cert1"],
    "projects": [
      {
        "name": "project name",
        "description": "project description",
        "technologies": ["tech1", "tech2"]
      }
    ],
    "languages": ["language1"]
  },
  "overallScore": 0-100,
  "atsScore": 0-100,
  "sectionScores": {
    "contact": 0-100,
    "summary": 0-100,
    "experience": 0-100,
    "education": 0-100,
    "skills": 0-100,
    "formatting": 0-100
  },
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "improvements": [
    {
      "section": "section name",
      "suggestion": "detailed improvement suggestion",
      "priority": "high | medium | low"
    }
  ],
  "summary": "Overall assessment paragraph",
  "reasoning": ["reason1", "reason2"]
}

Be thorough and specific. Score based on:
- ATS compatibility (keywords, formatting, sections)
- Content quality (achievements, quantifiable results)
- Completeness (all relevant sections present)
- Relevance to the student's profile and career goals`;

  let analysisResult;
  try {
    analysisResult = await callGemini(prompt);
  } catch (error) {
    console.error("[ResumeAnalyzer] Gemini API error:", error.message);
    throw new Error("Failed to analyze resume. Please try again.");
  }

  // Calculate ATS score from resume content
  const atsAnalysis = calculateATSScore(analysisResult.parsedContent || {}, studentProfile);

  // Blend Gemini's ATS score with our calculation
  const finalAtsScore = Math.round(
    ((analysisResult.atsScore || 0) * 0.6 + atsAnalysis.score * 0.4)
  );

  // Build final analysis
  const finalAnalysis = {
    parsedContent: analysisResult.parsedContent || {},
    overallScore: analysisResult.overallScore || 0,
    atsScore: finalAtsScore,
    sectionScores: analysisResult.sectionScores || {},
    strengths: analysisResult.strengths || [],
    weaknesses: analysisResult.weaknesses || [],
    missingKeywords: analysisResult.missingKeywords || [],
    improvements: [
      ...(analysisResult.improvements || []),
      ...atsAnalysis.improvements.map((imp) => ({
        section: "skills",
        suggestion: imp,
        priority: "medium",
      })),
    ],
    atsIssues: atsAnalysis.issues,
    summary: analysisResult.summary || "",
    reasoning: analysisResult.reasoning || [],
    analyzedAt: new Date().toISOString(),
  };

  // Store in database
  const resumeRecord = await prisma.resumeAnalysis.create({
    data: {
      userId,
      fileName: fileName || "resume.txt",
      status: "ANALYZED",
      parsedContent: finalAnalysis.parsedContent,
      analysis: {
        sectionScores: finalAnalysis.sectionScores,
        strengths: finalAnalysis.strengths,
        weaknesses: finalAnalysis.weaknesses,
        missingKeywords: finalAnalysis.missingKeywords,
        atsIssues: finalAnalysis.atsIssues,
        summary: finalAnalysis.summary,
        reasoning: finalAnalysis.reasoning,
      },
      score: finalAnalysis.overallScore,
      feedback: {
        improvements: finalAnalysis.improvements,
        summary: finalAnalysis.summary,
      },
      recommendations: finalAnalysis.improvements.map((imp) => ({
        section: imp.section,
        suggestion: imp.suggestion,
        priority: imp.priority,
      })),
    },
  });

  return {
    resumeId: resumeRecord.id,
    analysis: finalAnalysis,
  };
}

async function getAnalysisById(analysisId, userId) {
  const analysis = await prisma.resumeAnalysis.findUnique({
    where: { id: analysisId },
  });

  if (!analysis) {
    throw new Error("Resume analysis not found");
  }

  if (analysis.userId !== userId) {
    throw new Error("Not authorized to access this analysis");
  }

  return analysis;
}

async function getUserAnalyses(userId) {
  return prisma.resumeAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function deleteAnalysis(analysisId, userId) {
  const analysis = await getAnalysisById(analysisId, userId);
  await prisma.resumeAnalysis.delete({ where: { id: analysisId } });
  return { deleted: true };
}

module.exports = {
  analyzeResume,
  getAnalysisById,
  getUserAnalyses,
  deleteAnalysis,
};
