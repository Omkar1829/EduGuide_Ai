const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const recommendationController = require("../controllers/recommendation.controller");

const getRecommendationByIdValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid recommendation ID"),
];

const createRecommendationValidation = [
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["CAREER", "STREAM", "COURSE", "SKILL", "JOB"])
    .withMessage("Type must be CAREER, STREAM, COURSE, SKILL, or JOB"),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be less than 255 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 2000 })
    .withMessage("Description must be less than 2000 characters"),
  body("confidence")
    .isFloat({ min: 0, max: 1 })
    .withMessage("Confidence must be between 0 and 1"),
  body("reasoning")
    .isObject()
    .withMessage("Reasoning must be an object"),
  body("metadata")
    .optional()
    .isObject()
    .withMessage("Metadata must be an object"),
  body("expiresAt")
    .optional()
    .isISO8601()
    .withMessage("ExpiresAt must be a valid date"),
];

const acceptRejectValidation = [
  param("id")
    .isUUID()
    .withMessage("Invalid recommendation ID"),
];

router.get(
  "/",
  authenticate,
  recommendationController.getRecommendations
);

router.post(
  "/generate",
  authenticate,
  recommendationController.generateRecommendations
);

router.get(
  "/:id",
  authenticate,
  validate(getRecommendationByIdValidation),
  recommendationController.getRecommendationById
);

router.post(
  "/",
  authenticate,
  validate(createRecommendationValidation),
  recommendationController.createRecommendation
);

router.put(
  "/:id/accept",
  authenticate,
  validate(acceptRejectValidation),
  recommendationController.acceptRecommendation
);

router.put(
  "/:id/reject",
  authenticate,
  validate(acceptRejectValidation),
  recommendationController.rejectRecommendation
);

module.exports = router;
