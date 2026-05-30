const { body } = require("express-validator");

const careerRecommendationValidation = [
  body("interests")
    .isArray({ min: 1 })
    .withMessage("At least one interest is required"),
  body("interests.*")
    .trim()
    .notEmpty()
    .withMessage("Interest cannot be empty"),
  body("skills")
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),
  body("skills.*")
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty"),
  body("education")
    .trim()
    .notEmpty()
    .withMessage("Education level is required"),
  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object"),
];

const streamRecommendationValidation = [
  body("academicPerformance")
    .isObject()
    .withMessage("Academic performance is required"),
  body("academicPerformance.subjects")
    .isArray({ min: 1 })
    .withMessage("At least one subject is required"),
  body("academicPerformance.subjects.*.name")
    .trim()
    .notEmpty()
    .withMessage("Subject name is required"),
  body("academicPerformance.subjects.*.score")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Subject score must be between 0 and 100"),
  body("interests")
    .isArray({ min: 1 })
    .withMessage("At least one interest is required"),
  body("interests.*")
    .trim()
    .notEmpty()
    .withMessage("Interest cannot be empty"),
  body("aptitudeScores")
    .optional()
    .isObject()
    .withMessage("Aptitude scores must be an object"),
];

const skillGapValidation = [
  body("targetRole")
    .trim()
    .notEmpty()
    .withMessage("Target role is required")
    .isLength({ max: 200 })
    .withMessage("Target role must be at most 200 characters"),
  body("currentSkills")
    .isArray()
    .withMessage("Current skills must be an array"),
  body("currentSkills.*.name")
    .trim()
    .notEmpty()
    .withMessage("Skill name is required"),
  body("currentSkills.*.level")
    .isIn(["beginner", "intermediate", "advanced", "expert"])
    .withMessage("Skill level must be beginner, intermediate, advanced, or expert"),
  body("experience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Experience must be a non-negative integer"),
];

const roadmapValidation = [
  body("goal")
    .trim()
    .notEmpty()
    .withMessage("Goal is required")
    .isLength({ max: 500 })
    .withMessage("Goal must be at most 500 characters"),
  body("currentLevel")
    .trim()
    .notEmpty()
    .withMessage("Current level is required")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Current level must be beginner, intermediate, or advanced"),
  body("timeframe")
    .trim()
    .notEmpty()
    .withMessage("Timeframe is required")
    .isIn(["1month", "3months", "6months", "1year", "2years"])
    .withMessage("Timeframe must be 1month, 3months, 6months, 1year, or 2years"),
  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object"),
];

const chatValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 5000 })
    .withMessage("Message must be at most 5000 characters"),
  body("sessionId")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Session ID must be a string"),
  body("context")
    .optional()
    .isObject()
    .withMessage("Context must be an object"),
];

const resumeAnalysisValidation = [
  body("resumeContent")
    .trim()
    .notEmpty()
    .withMessage("Resume content is required")
    .isLength({ max: 50000 })
    .withMessage("Resume content must be at most 50000 characters"),
  body("targetRole")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Target role must be at most 200 characters"),
  body("jobDescription")
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage("Job description must be at most 10000 characters"),
];

const futureSimulationValidation = [
  body("currentPath")
    .trim()
    .notEmpty()
    .withMessage("Current path is required")
    .isLength({ max: 500 })
    .withMessage("Current path must be at most 500 characters"),
  body("choices")
    .isArray({ min: 1 })
    .withMessage("At least one choice is required"),
  body("choices.*")
    .trim()
    .notEmpty()
    .withMessage("Choice cannot be empty"),
  body("timeframe")
    .trim()
    .notEmpty()
    .withMessage("Timeframe is required")
    .isIn(["1year", "3years", "5years", "10years"])
    .withMessage("Timeframe must be 1year, 3years, 5years, or 10years"),
];

const quizAnalysisValidation = [
  body("quizId")
    .trim()
    .notEmpty()
    .withMessage("Quiz ID is required"),
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
  body("quizType")
    .trim()
    .notEmpty()
    .withMessage("Quiz type is required")
    .isIn(["CAREER_INTEREST", "PERSONALITY", "SKILL_ASSESSMENT", "APTITUDE", "LEARNING_STYLE"])
    .withMessage(
      "Quiz type must be one of: CAREER_INTEREST, PERSONALITY, SKILL_ASSESSMENT, APTITUDE, LEARNING_STYLE"
    ),
];

const courseRecommendationValidation = [
  body("skills")
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),
  body("skills.*")
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty"),
  body("interests")
    .isArray({ min: 1 })
    .withMessage("At least one interest is required"),
  body("interests.*")
    .trim()
    .notEmpty()
    .withMessage("Interest cannot be empty"),
  body("level")
    .trim()
    .notEmpty()
    .withMessage("Level is required")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Level must be beginner, intermediate, or advanced"),
  body("budget")
    .optional()
    .isObject()
    .withMessage("Budget must be an object"),
  body("budget.min")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum budget must be non-negative"),
  body("budget.max")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum budget must be non-negative"),
];

const jobMatchValidation = [
  body("skills")
    .isArray({ min: 1 })
    .withMessage("At least one skill is required"),
  body("skills.*")
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty"),
  body("experience")
    .isInt({ min: 0 })
    .withMessage("Experience must be a non-negative integer"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location must be at most 200 characters"),
  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object"),
  body("preferences.jobType")
    .optional()
    .isIn(["full-time", "part-time", "contract", "internship", "remote"])
    .withMessage(
      "Job type must be one of: full-time, part-time, contract, internship, remote"
    ),
  body("preferences.salaryMin")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Minimum salary must be non-negative"),
  body("preferences.salaryMax")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Maximum salary must be non-negative"),
];

module.exports = {
  careerRecommendationValidation,
  streamRecommendationValidation,
  skillGapValidation,
  roadmapValidation,
  chatValidation,
  resumeAnalysisValidation,
  futureSimulationValidation,
  quizAnalysisValidation,
  courseRecommendationValidation,
  jobMatchValidation,
};
