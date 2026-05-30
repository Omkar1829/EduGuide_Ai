const { getGeminiClient } = require("./geminiClient");
const { CAREER_RECOMMENDATION_PROMPT } = require("./promptTemplates");
const { validateRecommendation, sanitizeResponse, fallbackResponse } = require("./responseParser");
const prisma = require("../../config/prisma");

const getCareerRecommendations = async (studentData) => {
  const { userId } = studentData;

  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
      academicRecords: {
        include: { subjectMarks: true },
        orderBy: { startYear: "desc" },
      },
      interests: true,
      careerGoals: { orderBy: { priority: "asc" } },
      strengths: true,
      weaknesses: true,
      skills: { include: { skill: true } },
      certifications: true,
    },
  });

  if (!profile) {
    const err = new Error("Student profile not found. Please complete your profile first.");
    err.statusCode = 404;
    throw err;
  }

  const promptData = {
    profile,
    skills: profile.skills || [],
    interests: profile.interests || [],
    academicRecords: profile.academicRecords || [],
    careerGoals: profile.careerGoals || [],
    strengths: profile.strengths || [],
    weaknesses: profile.weaknesses || [],
  };

  const prompt = CAREER_RECOMMENDATION_PROMPT(promptData);

  const geminiClient = getGeminiClient();
  let responseText;

  try {
    responseText = await geminiClient.generateStructuredJSON(prompt);
  } catch (error) {
    console.error("[CareerRecommendation] Gemini API error:", error.message);
    return fallbackResponse("career");
  }

  let parsedData;
  if (typeof responseText === "string") {
    try {
      const { parseJSON } = require("./responseParser");
      parsedData = parseJSON(responseText);
    } catch (parseError) {
      console.error("[CareerRecommendation] JSON parse error:", parseError.message);
      return fallbackResponse("career");
    }
  } else {
    parsedData = responseText;
  }

  const sanitizedData = sanitizeResponse(parsedData);

  const validation = validateRecommendation(sanitizedData);
  if (!validation.valid) {
    console.error("[CareerRecommendation] Validation errors:", validation.errors);
    return fallbackResponse("career");
  }

  const savedRecommendations = [];
  for (const rec of sanitizedData.recommendations) {
    try {
      const saved = await prisma.recommendation.create({
        data: {
          userId,
          type: "CAREER",
          title: rec.title,
          description: rec.description,
          confidence: rec.confidence,
          reasoning: rec.reasoning || "",
          metadata: {
            requiredSkills: rec.requiredSkills || [],
            growthPotential: rec.growthPotential || "medium",
            salaryRange: rec.salaryRange || "Not specified",
            industry: rec.industry || "General",
            entryRequirements: rec.entryRequirements || "",
            summary: sanitizedData.summary || "",
            topAdvice: sanitizedData.topAdvice || "",
          },
          status: "PENDING",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      savedRecommendations.push(saved);
    } catch (dbError) {
      console.error("[CareerRecommendation] Database error saving recommendation:", dbError.message);
    }
  }

  return {
    recommendations: sanitizedData.recommendations,
    summary: sanitizedData.summary || "",
    topAdvice: sanitizedData.topAdvice || "",
    savedIds: savedRecommendations.map((r) => r.id),
    generatedAt: new Date().toISOString(),
  };
};

module.exports = { getCareerRecommendations };
