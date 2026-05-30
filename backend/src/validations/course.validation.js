const { body, param, query } = require("express-validator");

const createCourseValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be less than 255 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description must be less than 2000 characters"),
  body("provider")
    .trim()
    .notEmpty()
    .withMessage("Provider is required")
    .isLength({ max: 255 })
    .withMessage("Provider must be less than 255 characters"),
  body("url")
    .optional()
    .trim()
    .isURL()
    .withMessage("URL must be a valid URL"),
  body("duration")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Duration must be less than 100 characters"),
  body("level")
    .optional()
    .trim()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Level must be beginner, intermediate, or advanced"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ max: 100 })
    .withMessage("Category must be less than 100 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("currency")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Currency must be less than 10 characters"),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
];

const updateCourseValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid course ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Title must be less than 255 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description must be less than 2000 characters"),
  body("provider")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Provider must be less than 255 characters"),
  body("url")
    .optional()
    .trim()
    .isURL()
    .withMessage("URL must be a valid URL"),
  body("duration")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Duration must be less than 100 characters"),
  body("level")
    .optional()
    .trim()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Level must be beginner, intermediate, or advanced"),
  body("category")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Category must be less than 100 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("currency")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Currency must be less than 10 characters"),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
];

const getCourseByIdValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid course ID"),
];

const getCoursesByCategoryValidation = [
  param("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
];

const searchCoursesValidation = [
  query("q")
    .trim()
    .notEmpty()
    .withMessage("Search query is required"),
];

const enrollInCourseValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid course ID"),
];

const updateCourseProgressValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid course ID"),
  body("progress")
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be an integer between 0 and 100"),
];

const unenrollFromCourseValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid course ID"),
];

module.exports = {
  createCourseValidation,
  updateCourseValidation,
  getCourseByIdValidation,
  getCoursesByCategoryValidation,
  searchCoursesValidation,
  enrollInCourseValidation,
  updateCourseProgressValidation,
  unenrollFromCourseValidation,
};
