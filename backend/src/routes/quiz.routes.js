const express = require("express");
const quizController = require("../controllers/quiz.controller");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");
const {
  createQuizValidation,
  submitQuizValidation,
} = require("../validations/quiz.validation");

const router = express.Router();

router.use(authenticate);

router.post("/", createQuizValidation, validate, quizController.createQuiz);
router.post("/generate", quizController.generateAIQuiz);
router.get("/", quizController.getQuizzes);
router.get("/results", quizController.getUserResults);
router.get("/:id", quizController.getQuizById);
router.post("/:id/submit", submitQuizValidation, validate, quizController.submitQuiz);
router.get("/:id/results", quizController.getQuizResults);

module.exports = router;
