const { getGeminiClient } = require("./geminiClient");
const { SKILL_GAP_PROMPT } = require("./promptTemplates");
const { validateSkillGap, sanitizeResponse, fallbackResponse } = require("./responseParser");
const prisma = require("../../config/prisma");

const analyzeSkillGap = async (studentData, targetCareer) => {
  const { userId } = studentData;

  if (!targetCareer || typeof targetCareer !== "string" || targetCareer.trim().length === 0) {
    const err = new Error("Target career is required for skill gap analysis");
    err.statusCode = 400;
    throw err;
  }

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
      skills: {
        include: { skill: true },
      },
      certifications: true,
      interests: true,
      strengths: true,
      weaknesses: true,
    },
  });

  if (!profile) {
    const err = new Error("Student profile not found. Please complete your profile first.");
    err.statusCode = 404;
    throw err;
  }

  const promptData = {
    skills: profile.skills || [],
    certifications: profile.certifications || [],
    academicRecords: profile.academicRecords || [],
  };

  const prompt = SKILL_GAP_PROMPT(promptData, targetCareer);

  const geminiClient = getGeminiClient();
  let responseText;

  try {
    responseText = await geminiClient.generateStructuredJSON(prompt);
  } catch (error) {
    console.error("[SkillGapAnalyzer] Gemini API error:", error.message);
    return fallbackResponse("skillGap");
  }

  let parsedData;
  if (typeof responseText === "string") {
    try {
      const { parseJSON } = require("./responseParser");
      parsedData = parseJSON(responseText);
    } catch (parseError) {
      console.error("[SkillGapAnalyzer] JSON parse error:", parseError.message);
      return fallbackResponse("skillGap");
    }
  } else {
    parsedData = responseText;
  }

  const sanitizedData = sanitizeResponse(parsedData);

  const validation = validateSkillGap(sanitizedData);
  if (!validation.valid) {
    console.error("[SkillGapAnalyzer] Validation errors:", validation.errors);
    return fallbackResponse("skillGap");
  }

  try {
    const existingAnalysis = await prisma.recommendation.findFirst({
      where: {
        userId,
        type: "SKILL",
        title: `Skill Gap Analysis: ${targetCareer}`,
      },
    });

    if (existingAnalysis) {
      await prisma.recommendation.update({
        where: { id: existingAnalysis.id },
        data: {
          confidence: 1 - sanitizedData.gapScore / 100,
          reasoning: sanitizedData.summary || "",
          metadata: {
            targetCareer,
            gapScore: sanitizedData.gapScore,
            matchedSkills: sanitizedData.matchedSkills,
            missingSkills: sanitizedData.missingSkills,
            immediateActions: sanitizedData.immediateActions,
            longTermPlan: sanitizedData.longTermPlan,
          },
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.recommendation.create({
        data: {
          userId,
          type: "SKILL",
          title: `Skill Gap Analysis: ${targetCareer}`,
          description: sanitizedData.summary || `Skill gap analysis for ${targetCareer}`,
          confidence: 1 - sanitizedData.gapScore / 100,
          reasoning: sanitizedData.summary || "",
          metadata: {
            targetCareer,
            gapScore: sanitizedData.gapScore,
            matchedSkills: sanitizedData.matchedSkills,
            missingSkills: sanitizedData.missingSkills,
            immediateActions: sanitizedData.immediateActions,
            longTermPlan: sanitizedData.longTermPlan,
          },
          status: "PENDING",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }
  } catch (dbError) {
    console.error("[SkillGapAnalyzer] Database error:", dbError.message);
  }

  return {
    targetCareer,
    gapScore: sanitizedData.gapScore,
    matchedSkills: sanitizedData.matchedSkills || [],
    missingSkills: sanitizedData.missingSkills || [],
    summary: sanitizedData.summary || "",
    immediateActions: sanitizedData.immediateActions || [],
    longTermPlan: sanitizedData.longTermPlan || "",
    generatedAt: new Date().toISOString(),
  };
};

module.exports = { analyzeSkillGap };
