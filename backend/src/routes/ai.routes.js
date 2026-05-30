const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");
const aiController = require("../controllers/ai.controller");
const {
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
} = require("../validations/ai.validation");

const { checkChatLimit, enforceTier } = require("../middlewares/subscriptionLimit");

router.use(authenticate);

router.post(
  "/career-recommendation",
  validate(careerRecommendationValidation),
  aiController.getCareerRecommendation
);

router.post(
  "/stream-recommendation",
  validate(streamRecommendationValidation),
  aiController.getStreamRecommendation
);

router.post(
  "/skill-gap",
  validate(skillGapValidation),
  aiController.analyzeSkillGap
);

router.post(
  "/roadmap-generate",
  validate(roadmapValidation),
  aiController.generateRoadmap
);

router.post(
  "/chat",
  checkChatLimit,
  validate(chatValidation),
  aiController.chat
);

router.post(
  "/resume-analyze",
  validate(resumeAnalysisValidation),
  aiController.analyzeResume
);

router.post(
  "/future-simulate",
  validate(futureSimulationValidation),
  aiController.simulateFuture
);

router.post(
  "/quiz-analyze",
  validate(quizAnalysisValidation),
  aiController.analyzeQuiz
);

router.post(
  "/course-recommend",
  validate(courseRecommendationValidation),
  aiController.recommendCourses
);

router.post(
  "/job-match",
  validate(jobMatchValidation),
  aiController.matchJobs
);

router.post(
  "/resume-builder/compare",
  enforceTier(["PRO_PLUS"]),
  aiController.compareAndTailorResume
);

router.get(
  "/knowledge-center/articles",
  enforceTier(["PRO", "PRO_PLUS"]),
  aiController.generatePersonalizedNews
);

module.exports = router;
