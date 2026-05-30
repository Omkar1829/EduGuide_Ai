const quizService = require("../services/quiz.service");
const { parsePagination } = require("../utils/pagination");
const { success, error } = require("../utils/apiResponse");

const createQuiz = async (req, res) => {
  try {
    const quiz = await quizService.createQuiz(req.user.id, req.body);
    return success(res, quiz, "Quiz created successfully", 201);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const getQuizzes = async (req, res) => {
  try {
    const pagination = parsePagination(req);
    const { category } = req.query;
    const result = await quizService.getQuizzes(req.user.id, category, pagination);
    return success(res, {
      quizzes: result.quizzes,
      pagination: {
        total: result.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(result.total / pagination.limit),
      },
    }, "Quizzes fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await quizService.getQuizById(req.params.id, req.user.id);
    return success(res, quiz, "Quiz fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const result = await quizService.submitQuizAnswers(req.params.id, req.user.id, answers);
    return success(res, result, "Quiz submitted successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const getQuizResults = async (req, res) => {
  try {
    const results = await quizService.getQuizResults(req.params.id, req.user.id);
    return success(res, results, "Quiz results fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const getUserResults = async (req, res) => {
  try {
    const pagination = parsePagination(req);
    const result = await quizService.getUserResults(req.user.id, pagination);
    return success(res, {
      results: result.results,
      pagination: {
        total: result.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(result.total / pagination.limit),
      },
    }, "User results fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const generateAIQuiz = async (req, res) => {
  try {
    const quiz = await quizService.generateAIQuiz(req.user.id);
    return success(res, quiz, "AI Quiz generated successfully", 201);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
  getUserResults,
  generateAIQuiz,
};
