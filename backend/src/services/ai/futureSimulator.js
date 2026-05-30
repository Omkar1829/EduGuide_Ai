const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../../config");
const prisma = require("../../config/prisma");

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

const SIMULATION_PROMPT = `You are an expert career path simulator and data analyst.
Simulate realistic future career paths based on student data and provide data-driven predictions.
Always return valid JSON matching the requested schema. Do not include markdown fences or extra text.
Base predictions on realistic industry data. Never fabricate statistics.`;

async function fetchStudentData(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
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
  return {
    name: `${user.firstName} ${user.lastName}`,
    interests: p.interests.map((i) => ({ name: i.name, level: i.level })),
    careerGoals: p.careerGoals.map((g) => ({ title: g.title, targetYear: g.targetYear })),
    strengths: p.strengths.map((s) => s.name),
    weaknesses: p.weaknesses.map((w) => w.name),
    skills: p.skills.map((s) => ({
      name: s.skill.name,
      category: s.skill.category,
      level: s.level,
      yearsExp: s.yearsExp,
    })),
    certifications: p.certifications.map((c) => c.name),
    academics: p.academicRecords.map((ar) => ({
      degree: ar.degree,
      fieldOfStudy: ar.fieldOfStudy,
      gpa: ar.gpa,
      percentage: ar.percentage,
    })),
  };
}

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SIMULATION_PROMPT,
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

async function simulateFuture(userId, paths, timeline = 5) {
  if (!Array.isArray(paths) || paths.length === 0) {
    throw new Error("At least one career path is required");
  }

  if (paths.length > 5) {
    throw new Error("Maximum 5 career paths can be compared");
  }

  if (!timeline || timeline < 1 || timeline > 10) {
    throw new Error("Timeline must be between 1 and 10 years");
  }

  const user = await fetchStudentData(userId);
  const studentSummary = buildStudentSummary(user);

  const prompt = `Simulate future career paths for this student and compare them.

Student Profile:
${JSON.stringify(studentSummary, null, 2)}

Career Paths to Compare:
${paths.map((p, i) => `${i + 1}. ${typeof p === "string" ? p : p.title || p}`).join("\n")}

Timeline: ${timeline} years

Return a JSON object with this exact structure:
{
  "simulationTitle": "Career Path Comparison: [path1] vs [path2]...",
  "timeline": ${timeline},
  "paths": [
    {
      "careerTitle": "career path title",
      "description": "brief description of this career path",
      "probabilityOfSuccess": 0-100,
      "overallRating": 1-10,
      "timeToAchieve": "estimated time to reach entry level",
      "entryBarrier": "low | medium | high",
      "salaryProgression": [
        {
          "year": 1,
          "role": "expected role title",
          "salaryRange": "salary range string",
          "minSalary": 0,
          "maxSalary": 0,
          "avgSalary": 0
        }
      ],
      "requiredSteps": [
        {
          "step": 1,
          "title": "step title",
          "description": "what to do",
          "duration": "estimated time",
          "priority": "high | medium | low"
        }
      ],
      "risks": [
        {
          "risk": "risk description",
          "impact": "high | medium | low",
          "mitigation": "how to mitigate"
        }
      ],
      "opportunities": [
        {
          "opportunity": "opportunity description",
          "potential": "high | medium | low",
          "timeframe": "when this opportunity is most relevant"
        }
      ],
      "marketDemand": "high | medium | low",
      "workLifeBalance": "good | moderate | demanding",
      "growthPotential": "high | medium | low"
    }
  ],
  "comparison": {
    "bestForSalary": "path title",
    "bestForGrowth": "path title",
    "bestForWorkLifeBalance": "path title",
    "easiestEntry": "path title",
    "highestDemand": "path title",
    "recommendation": "Which path is best and why"
  },
  "reasoning": [
    "reason 1 for the simulation",
    "reason 2"
  ]
}

Make salary estimates realistic for the Indian market (in INR) unless the student profile indicates otherwise.
Include year-by-year salary progression for each path.
Base probability of success on the student's current skills, academic background, and the demands of each path.
Consider current market trends for 2024-2029.`;

  let simulationResult;
  try {
    simulationResult = await callGemini(prompt);
  } catch (error) {
    console.error("[FutureSimulator] Gemini API error:", error.message);
    throw new Error("Failed to simulate career paths. Please try again.");
  }

  // Calculate comparative scores for each path
  const pathAnalyses = (simulationResult.paths || []).map((path) => {
    const avgSalary =
      path.salaryProgression && path.salaryProgression.length > 0
        ? path.salaryProgression.reduce((sum, yr) => sum + (yr.avgSalary || 0), 0) /
          path.salaryProgression.length
        : 0;

    const compositeScore = calculateCompositeScore({
      probabilityOfSuccess: path.probabilityOfSuccess || 0,
      overallRating: path.overallRating || 5,
      avgSalary,
      marketDemand: path.marketDemand,
      growthPotential: path.growthPotential,
    });

    return {
      ...path,
      avgSalary,
      compositeScore,
    };
  });

  // Sort by composite score for ranking
  pathAnalyses.sort((a, b) => b.compositeScore - a.compositeScore);

  const finalResult = {
    simulationTitle: simulationResult.simulationTitle || "Career Path Comparison",
    timeline,
    paths: pathAnalyses,
    comparison: simulationResult.comparison || {},
    reasoning: simulationResult.reasoning || [],
    simulatedAt: new Date().toISOString(),
  };

  return finalResult;
}

function calculateCompositeScore({ probabilityOfSuccess, overallRating, avgSalary, marketDemand, growthPotential }) {
  let score = 0;

  // Probability of success (0-30 points)
  score += (probabilityOfSuccess / 100) * 30;

  // Overall rating (0-20 points)
  score += (overallRating / 10) * 20;

  // Salary weight (0-25 points) - normalize against a max of 30 LPA
  const salaryNormalized = Math.min(avgSalary / 3000000, 1);
  score += salaryNormalized * 25;

  // Market demand (0-15 points)
  const demandMap = { high: 15, medium: 10, low: 5 };
  score += demandMap[marketDemand] || 8;

  // Growth potential (0-10 points)
  const growthMap = { high: 10, medium: 7, low: 3 };
  score += growthMap[growthPotential] || 5;

  return Math.round(score * 10) / 10;
}

async function getSimulationHistory(userId) {
  // Simulations are not stored permanently; return empty for now
  // In production, you could store simulation results in a dedicated table
  return [];
}

module.exports = {
  simulateFuture,
  getSimulationHistory,
};
