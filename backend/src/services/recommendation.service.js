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

module.exports = {
  getRecommendations,
  getRecommendationById,
  createRecommendation,
  acceptRecommendation,
  rejectRecommendation,
  getRecommendationsByType,
  deleteExpiredRecommendations,
};
