const { success, error } = require("../utils/apiResponse");
const { parsePagination } = require("../utils/pagination");
const courseService = require("../services/course.service");

const getAllCourses = async (req, res, next) => {
  try {
    const pagination = parsePagination(req);
    const filters = {
      category: req.query.category,
      level: req.query.level,
      provider: req.query.provider,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      minRating: req.query.minRating,
    };

    const result = await courseService.getAllCourses(filters, pagination);
    return success(res, result, "Courses retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(req.params.id);
    return success(res, course, "Course retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(req.body);
    return success(res, course, "Course created successfully", 201);
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.updateCourse(req.params.id, req.body);
    return success(res, course, "Course updated successfully");
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    await courseService.deleteCourse(req.params.id);
    return success(res, null, "Course deleted successfully");
  } catch (err) {
    next(err);
  }
};

const getCoursesByCategory = async (req, res, next) => {
  try {
    const courses = await courseService.getCoursesByCategory(req.params.category);
    return success(res, courses, "Courses retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const searchCourses = async (req, res, next) => {
  try {
    const courses = await courseService.searchCourses(req.query.q);
    return success(res, courses, "Search results retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const enrollInCourse = async (req, res, next) => {
  try {
    const enrollment = await courseService.enrollInCourse(req.user.id, req.params.id);
    return success(res, enrollment, "Enrolled successfully", 201);
  } catch (err) {
    next(err);
  }
};

const getEnrolledCourses = async (req, res, next) => {
  try {
    const pagination = parsePagination(req);
    const result = await courseService.getEnrolledCourses(req.user.id, pagination);
    return success(res, result, "Enrolled courses retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const updateCourseProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;
    const enrollment = await courseService.updateCourseProgress(
      req.user.id,
      req.params.id,
      progress
    );
    return success(res, enrollment, "Progress updated successfully");
  } catch (err) {
    next(err);
  }
};

const unenrollFromCourse = async (req, res, next) => {
  try {
    await courseService.unenrollFromCourse(req.user.id, req.params.id);
    return success(res, null, "Unenrolled successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByCategory,
  searchCourses,
  enrollInCourse,
  getEnrolledCourses,
  updateCourseProgress,
  unenrollFromCourse,
};
