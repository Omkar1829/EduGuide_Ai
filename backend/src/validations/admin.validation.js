const { body, param } = require("express-validator");

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

const createJobValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be less than 255 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description must be less than 5000 characters"),
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company is required")
    .isLength({ max: 255 })
    .withMessage("Company must be less than 255 characters"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location must be less than 255 characters"),
  body("url")
    .optional()
    .trim()
    .isURL()
    .withMessage("URL must be a valid URL"),
  body("salaryRange")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Salary range must be less than 100 characters"),
  body("experience")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Experience must be less than 100 characters"),
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),
  body("skills.*")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Each skill must be less than 100 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ max: 100 })
    .withMessage("Category must be less than 100 characters"),
  body("type")
    .optional()
    .trim()
    .isIn(["full-time", "part-time", "contract", "internship", "remote"])
    .withMessage("Type must be full-time, part-time, contract, internship, or remote"),
];

const updateJobValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid job ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Title must be less than 255 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description must be less than 5000 characters"),
  body("company")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Company must be less than 255 characters"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location must be less than 255 characters"),
  body("url")
    .optional()
    .trim()
    .isURL()
    .withMessage("URL must be a valid URL"),
  body("salaryRange")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Salary range must be less than 100 characters"),
  body("experience")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Experience must be less than 100 characters"),
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),
  body("skills.*")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Each skill must be less than 100 characters"),
  body("category")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Category must be less than 100 characters"),
  body("type")
    .optional()
    .trim()
    .isIn(["full-time", "part-time", "contract", "internship", "remote"])
    .withMessage("Type must be full-time, part-time, contract, internship, or remote"),
];

const updateUserValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid user ID"),
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be between 1 and 100 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name must be between 1 and 100 characters"),
  body("role")
    .optional()
    .isIn(["STUDENT", "ADMIN"])
    .withMessage("Role must be STUDENT or ADMIN"),
  body("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  body("avatarUrl")
    .optional()
    .trim()
    .isURL()
    .withMessage("Avatar URL must be a valid URL"),
];

module.exports = {
  createCourseValidation,
  updateCourseValidation,
  createJobValidation,
  updateJobValidation,
  updateUserValidation,
};
