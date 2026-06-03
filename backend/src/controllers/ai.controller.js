const { success, error } = require("../utils/apiResponse");
const aiService = require("../services/ai/ai.service");

const getCareerRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { interests, skills, education, preferences } = req.body;
    const result = await aiService.getCareerRecommendation(userId, {
      interests,
      skills,
      education,
      preferences,
    });
    return success(res, result, "Career recommendations generated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const getStreamRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { academicPerformance, interests, aptitudeScores } = req.body;
    const result = await aiService.getStreamRecommendation(userId, {
      academicPerformance,
      interests,
      aptitudeScores,
    });
    return success(res, result, "Stream recommendations generated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const analyzeSkillGap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetRole, currentSkills, experience } = req.body;
    const result = await aiService.analyzeSkillGap(userId, {
      targetRole,
      currentSkills,
      experience,
    });
    return success(res, result, "Skill gap analysis completed successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const generateRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goal, currentLevel, timeframe, preferences } = req.body;
    const result = await aiService.generateRoadmap(userId, {
      goal,
      currentLevel,
      timeframe,
      preferences,
    });
    return success(res, result, "Roadmap generated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const chat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, sessionId, context } = req.body;
    const result = await aiService.chat(userId, {
      message,
      sessionId,
      context,
    });

    const prisma = require("../config/prisma");
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { chatLimitRemaining: true },
    });

    result.chatLimitRemaining = updatedUser ? updatedUser.chatLimitRemaining : 0;

    return success(res, result, "Chat response generated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const analyzeResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resumeContent, targetRole, jobDescription } = req.body;
    const result = await aiService.analyzeResume(userId, {
      resumeContent,
      targetRole,
      jobDescription,
    });
    return success(res, result, "Resume analysis completed successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const simulateFuture = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPath, choices, timeframe } = req.body;
    const result = await aiService.simulateFuture(userId, {
      currentPath,
      choices,
      timeframe,
    });
    return success(res, result, "Future simulation generated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const analyzeQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId, answers, quizType } = req.body;
    const result = await aiService.analyzeQuiz(userId, {
      quizId,
      answers,
      quizType,
    });
    return success(res, result, "Quiz analysis completed successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const recommendCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills, interests, level, budget } = req.body;
    const result = await aiService.recommendCourses(userId, {
      skills,
      interests,
      level,
      budget,
    });
    return success(res, result, "Course recommendations generated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const matchJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills, experience, location, preferences } = req.body;
    const result = await aiService.matchJobs(userId, {
      skills,
      experience,
      location,
      preferences,
    });
    return success(res, result, "Job matches generated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const compareAndTailorResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobDescription } = req.body;
    const result = await aiService.compareAndTailorResume(userId, { jobDescription });
    return success(res, result, "Resume comparison completed successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const generatePersonalizedNews = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await aiService.generatePersonalizedNews(userId);
    return success(res, result, "Personalized news articles generated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

module.exports = {
  getCareerRecommendation,
  getStreamRecommendation,
  analyzeSkillGap,
  generateRoadmap,
  chat,
  analyzeResume,
  simulateFuture,
  analyzeQuiz,
  recommendCourses,
  matchJobs,
  compareAndTailorResume,
  generatePersonalizedNews,
};
