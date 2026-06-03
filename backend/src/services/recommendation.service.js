const recommendationRepository = require("../repositories/recommendation.repository");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getRecommendations = async (userId, type, status, pagination) => {
  return recommendationRepository.findByUserId(userId, type, status, pagination);
};

const getRecommendationById = async (id) => {
  const recommendation = await recommendationRepository.findById(id);
  if (!recommendation) {
    throw new AppError("Recommendation not found", 404);
  }
  return recommendation;
};

const createRecommendation = async (data) => {
  return recommendationRepository.create(data);
};

const acceptRecommendation = async (id, userId) => {
  const recommendation = await recommendationRepository.findById(id);
  if (!recommendation) {
    throw new AppError("Recommendation not found", 404);
  }

  if (recommendation.userId !== userId) {
    throw new AppError("Not authorized to modify this recommendation", 403);
  }

  if (recommendation.status !== "PENDING") {
    throw new AppError("Recommendation is not pending", 400);
  }

  return recommendationRepository.updateStatus(id, "ACCEPTED");
};

const rejectRecommendation = async (id, userId) => {
  const recommendation = await recommendationRepository.findById(id);
  if (!recommendation) {
    throw new AppError("Recommendation not found", 404);
  }

  if (recommendation.userId !== userId) {
    throw new AppError("Not authorized to modify this recommendation", 403);
  }

  if (recommendation.status !== "PENDING") {
    throw new AppError("Recommendation is not pending", 400);
  }

  return recommendationRepository.updateStatus(id, "REJECTED");
};

const getRecommendationsByType = async (userId, type) => {
  return recommendationRepository.findByUserAndType(userId, type);
};

const deleteExpiredRecommendations = async () => {
  await recommendationRepository.deleteExpired();
};

const generateRecommendations = async (userId) => {
  const prisma = require("../config/prisma");
  const { GoogleGenerativeAI } = require("@google/generative-ai");

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key") {
    throw new AppError("AI service not configured on the server. Please check GEMINI_API_KEY.", 503);
  }

  // Fetch student profile with all related data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          academicRecords: true,
          interests: true,
          careerGoals: true,
          strengths: true,
          skills: {
            include: {
              skill: true
            }
          }
        }
      }
    }
  });

  if (!user || !user.profile) {
    throw new AppError("Please complete your profile portfolio (My Profile) before generating AI recommendations!", 400);
  }

  const { profile } = user;
  const interests = profile.interests.map(i => i.name);
  const strengths = profile.strengths.map(s => s.name);
  const goals = profile.careerGoals.map(g => g.title);
  const skills = profile.skills.map(s => `${s.skill.name} (Level ${s.level}/10)`);
  const academics = profile.academicRecords.map(r => `${r.degree} in ${r.fieldOfStudy} at ${r.institution}`);

  if (interests.length === 0 && skills.length === 0 && academics.length === 0) {
    throw new AppError("Your profile details are too empty. Please add some academic records, interests, or skills to My Profile first!", 400);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `As an expert AI career counselor, analyze the student's profile and generate 3 highly tailored career match recommendations.
  
Student Profile:
- Full Name: ${user.firstName} ${user.lastName}
- Academics: ${academics.join("; ") || "Not specified"}
- Verified Skills: ${skills.join(", ") || "None added yet"}
- Personal Interests: ${interests.join(", ") || "None added yet"}
- Career Goals: ${goals.join(", ") || "None specified"}
- Personal Strengths: ${strengths.join(", ") || "None specified"}

Provide a JSON response with this exact schema:
{
  "recommendations": [
    {
      "title": "Career Path / Job Title",
      "description": "2-3 sentences explaining why this career matches their unique combination of skills, academic history, and interests.",
      "confidence": 0.5-0.99,
      "reasoning": {
        "skillsAlignment": "Explain how their skills match.",
        "interestsMatch": "Explain how their interests align.",
        "growthOpportunities": "Mention market growth or industry trends."
      }
    }
  ]
}

Ensure the response contains valid JSON ONLY, without markdown block wrap.`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  let recommendationData;
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      recommendationData = JSON.parse(jsonMatch[0]);
    } else {
      recommendationData = JSON.parse(responseText);
    }
  } catch (err) {
    console.error("Gemini AI Parsing error for recommendations:", responseText);
    throw new AppError("Failed to parse AI-generated recommendations. Please try again.", 500);
  }

  if (!recommendationData || !recommendationData.recommendations) {
    throw new AppError("Invalid response format received from Gemini AI.", 500);
  }

  // Delete older PENDING recommendations to keep the dashboard clean
  await prisma.recommendation.deleteMany({
    where: {
      userId,
      status: "PENDING"
    }
  });

  const createdRecommendations = [];
  for (const rec of recommendationData.recommendations) {
    const created = await prisma.recommendation.create({
      data: {
        userId,
        type: "CAREER",
        title: rec.title,
        description: rec.description,
        confidence: parseFloat(rec.confidence || 0.85),
        reasoning: rec.reasoning || {},
        status: "PENDING",
        metadata: {
          generatedAt: new Date().toISOString()
        }
      }
    });
    createdRecommendations.push(created);
  }

  return createdRecommendations;
};

module.exports = {
  getRecommendations,
  getRecommendationById,
  createRecommendation,
  acceptRecommendation,
  rejectRecommendation,
  getRecommendationsByType,
  deleteExpiredRecommendations,
  generateRecommendations,
};
