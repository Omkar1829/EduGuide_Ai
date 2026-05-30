const { body, param, query } = require("express-validator");

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
    .isArray()
    .withMessage("Skills must be an array"),
  body("skills.*")
    .trim()
    .notEmpty()
    .withMessage("Each skill must be a non-empty string"),
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
    .trim()
    .notEmpty()
    .withMessage("Each skill must be a non-empty string"),
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

const getJobByIdValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid job ID"),
];

const getJobsByCategoryValidation = [
  param("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
];

const searchJobsValidation = [
  query("q")
    .trim()
    .notEmpty()
    .withMessage("Search query is required"),
];

const saveJobValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid job ID"),
];

const updateJobStatusValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid job ID"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["saved", "applied", "interviewing", "offered", "rejected", "accepted"])
    .withMessage("Status must be a valid status"),
];

const removeSavedJobValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid job ID"),
];

module.exports = {
  createJobValidation,
  updateJobValidation,
  getJobByIdValidation,
  getJobsByCategoryValidation,
  searchJobsValidation,
  saveJobValidation,
  updateJobStatusValidation,
  removeSavedJobValidation,
};
