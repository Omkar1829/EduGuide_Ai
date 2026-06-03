const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const adminController = require("../controllers/admin.controller");
const {
  createCourseValidation,
  updateCourseValidation,
  createJobValidation,
  updateJobValidation,
  updateUserValidation,
} = require("../validations/admin.validation");

router.use(authenticate);
router.use(authorize(["ADMIN"]));

router.get("/stats", adminController.getPlatformStats);
router.get("/analytics", adminController.getAnalyticsData);
router.get("/activity", adminController.getRecentActivity);

router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", validate(updateUserValidation), adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.put("/users/:id/toggle-active", adminController.toggleUserActive);

router.get("/courses", adminController.getAllCourses);
router.get("/courses/:id", adminController.getCourseById);
router.post("/courses", validate(createCourseValidation), adminController.createCourse);
router.put("/courses/:id", validate(updateCourseValidation), adminController.updateCourse);
router.delete("/courses/:id", adminController.deleteCourse);

router.get("/jobs", adminController.getAllJobs);
router.get("/jobs/:id", adminController.getJobById);
router.post("/jobs", validate(createJobValidation), adminController.createJob);
router.put("/jobs/:id", validate(updateJobValidation), adminController.updateJob);
router.delete("/jobs/:id", adminController.deleteJob);
router.get("/jobs/scrape/status", adminController.getScrapeStatus);
router.post("/jobs/scrape/stop", adminController.stopScrapeJobs);
router.post("/jobs/scrape", adminController.scrapeJobs);

// Admin Quiz Management
router.get("/quizzes", adminController.getAllQuizzes);
router.get("/quizzes/:id", adminController.getQuizById);
router.delete("/quizzes/:id", adminController.deleteQuiz);

module.exports = router;
