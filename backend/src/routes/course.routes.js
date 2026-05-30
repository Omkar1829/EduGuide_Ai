const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const courseController = require("../controllers/course.controller");
const {
  createCourseValidation,
  updateCourseValidation,
  getCourseByIdValidation,
  getCoursesByCategoryValidation,
  searchCoursesValidation,
  enrollInCourseValidation,
  updateCourseProgressValidation,
  unenrollFromCourseValidation,
} = require("../validations/course.validation");

router.get(
  "/",
  courseController.getAllCourses
);

router.get(
  "/search",
  validate(searchCoursesValidation),
  courseController.searchCourses
);

router.get(
  "/enrolled",
  authenticate,
  courseController.getEnrolledCourses
);

router.get(
  "/category/:category",
  validate(getCoursesByCategoryValidation),
  courseController.getCoursesByCategory
);

router.get(
  "/:id",
  validate(getCourseByIdValidation),
  courseController.getCourseById
);

router.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  validate(createCourseValidation),
  courseController.createCourse
);

router.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validate(updateCourseValidation),
  courseController.updateCourse
);

router.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  validate(getCourseByIdValidation),
  courseController.deleteCourse
);

router.post(
  "/:id/enroll",
  authenticate,
  validate(enrollInCourseValidation),
  courseController.enrollInCourse
);

router.put(
  "/:id/progress",
  authenticate,
  validate(updateCourseProgressValidation),
  courseController.updateCourseProgress
);

router.delete(
  "/:id/unenroll",
  authenticate,
  validate(unenrollFromCourseValidation),
  courseController.unenrollFromCourse
);

module.exports = router;
