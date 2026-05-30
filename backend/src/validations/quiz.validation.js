const { body } = require("express-validator");

const createQuizValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Quiz title is required")
    .isLength({ max: 200 })
    .withMessage("Quiz title must be at most 200 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Quiz category is required")
    .isIn([
      "CAREER_INTEREST",
      "PERSONALITY",
      "SKILL_ASSESSMENT",
      "APTITUDE",
      "LEARNING_STYLE",
    ])
    .withMessage(
      "Category must be one of: CAREER_INTEREST, PERSONALITY, SKILL_ASSESSMENT, APTITUDE, LEARNING_STYLE"
    ),
  body("questions")
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),
  body("questions.*.id")
    .optional()
    .isString()
    .withMessage("Question ID must be a string"),
  body("questions.*.text")
    .trim()
    .notEmpty()
    .withMessage("Question text is required"),
  body("questions.*.options")
    .isArray({ min: 2 })
    .withMessage("Each question must have at least 2 options"),
  body("questions.*.correctOption")
    .optional()
    .isString()
    .withMessage("Correct option must be a string"),
  body("questions.*.points")
    .optional()
    .isNumeric()
    .withMessage("Points must be a number"),
  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer (minutes)"),
];

const submitQuizValidation = [
  body("answers")
    .isArray({ min: 1 })
    .withMessage("At least one answer is required"),
  body("answers.*.questionId")
    .trim()
    .notEmpty()
    .withMessage("Question ID is required for each answer"),
  body("answers.*.selectedOption")
    .trim()
    .notEmpty()
    .withMessage("Selected option is required for each answer"),
];

module.exports = {
  createQuizValidation,
  submitQuizValidation,
};
