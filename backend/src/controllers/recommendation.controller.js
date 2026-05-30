const { success, error } = require("../utils/apiResponse");
const { parsePagination } = require("../utils/pagination");
const recommendationService = require("../services/recommendation.service");

const getRecommendations = async (req, res, next) => {
  try {
    const pagination = parsePagination(req);
    const { type, status } = req.query;

    const result = await recommendationService.getRecommendations(
      req.user.id,
      type,
      status,
      pagination
    );
    return success(res, result, "Recommendations retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getRecommendationById = async (req, res, next) => {
  try {
    const recommendation = await recommendationService.getRecommendationById(
      req.params.id
    );
    return success(res, recommendation, "Recommendation retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const createRecommendation = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      userId: req.user.id,
    };
    const recommendation = await recommendationService.createRecommendation(data);
    return success(res, recommendation, "Recommendation created successfully", 201);
  } catch (err) {
    next(err);
  }
};

const acceptRecommendation = async (req, res, next) => {
  try {
    const recommendation = await recommendationService.acceptRecommendation(
      req.params.id,
      req.user.id
    );
    return success(res, recommendation, "Recommendation accepted successfully");
  } catch (err) {
    next(err);
  }
};

const rejectRecommendation = async (req, res, next) => {
  try {
    const recommendation = await recommendationService.rejectRecommendation(
      req.params.id,
      req.user.id
    );
    return success(res, recommendation, "Recommendation rejected successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecommendations,
  getRecommendationById,
  createRecommendation,
  acceptRecommendation,
  rejectRecommendation,
};
