const { getGeminiClient } = require("./geminiClient");
const { STREAM_RECOMMENDATION_PROMPT } = require("./promptTemplates");
const { sanitizeResponse, fallbackResponse } = require("./responseParser");
const prisma = require("../../config/prisma");

const getStreamRecommendations = async (studentData) => {
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
    },
  });

  if (!profile) {
    const err = new Error("Student profile not found. Please complete your profile first.");
    err.statusCode = 404;
    throw err;
  }

  if (!profile.academicRecords || profile.academicRecords.length === 0) {
    const err = new Error("No academic records found. Please add your academic records for stream recommendations.");
    err.statusCode = 400;
    throw err;
  }

  const promptData = {
    academicRecords: profile.academicRecords,
    interests: profile.interests || [],
    strengths: profile.strengths || [],
    careerGoals: profile.careerGoals || [],
  };

  const prompt = STREAM_RECOMMENDATION_PROMPT(promptData);

  const geminiClient = getGeminiClient();
  let responseText;

  try {
    responseText = await geminiClient.generateStructuredJSON(prompt);
  } catch (error) {
    console.error("[StreamRecommendation] Gemini API error:", error.message);
    return fallbackResponse("stream");
  }

  let parsedData;
  if (typeof responseText === "string") {
    try {
      const { parseJSON } = require("./responseParser");
      parsedData = parseJSON(responseText);
    } catch (parseError) {
      console.error("[StreamRecommendation] JSON parse error:", parseError.message);
      return fallbackResponse("stream");
    }
  } else {
    parsedData = responseText;
  }

  const sanitizedData = sanitizeResponse(parsedData);

  if (!sanitizedData.recommendations || !Array.isArray(sanitizedData.recommendations)) {
    console.error("[StreamRecommendation] Invalid response structure");
    return fallbackResponse("stream");
  }

  const savedRecommendations = [];
  for (const rec of sanitizedData.recommendations) {
    if (!rec.streamName || typeof rec.confidence !== "number") {
      continue;
    }

    try {
      const saved = await prisma.recommendation.create({
        data: {
          userId,
          type: "STREAM",
          title: rec.streamName,
          description: rec.description || "",
          confidence: rec.confidence,
          reasoning: rec.reasoning || "",
          metadata: {
            relatedCareers: rec.relatedCareers || [],
            keySubjects: rec.keySubjects || [],
            difficultyLevel: rec.difficultyLevel || "medium",
            duration: rec.duration || "Not specified",
            institution: rec.institution || "Not specified",
            academicAnalysis: sanitizedData.academicAnalysis || "",
            overallAdvice: sanitizedData.overallAdvice || "",
          },
          status: "PENDING",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      savedRecommendations.push(saved);
    } catch (dbError) {
      console.error("[StreamRecommendation] Database error:", dbError.message);
    }
  }

  return {
    recommendations: sanitizedData.recommendations,
    academicAnalysis: sanitizedData.academicAnalysis || "",
    overallAdvice: sanitizedData.overallAdvice || "",
    savedIds: savedRecommendations.map((r) => r.id),
    generatedAt: new Date().toISOString(),
  };
};

module.exports = { getStreamRecommendations };
