const prisma = require("../config/prisma");
const courseRepository = require("../repositories/course.repository");
const userCourseRepository = require("../repositories/userCourse.repository");

const getAllCourses = async (filters, pagination) => {
  return courseRepository.findAll(filters, pagination);
};

const getCourseById = async (id) => {
  const course = await courseRepository.findById(id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  return course;
};

const createCourse = async (data) => {
  return courseRepository.create(data);
};

const updateCourse = async (id, data) => {
  const course = await courseRepository.findById(id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  return courseRepository.update(id, data);
};

const deleteCourse = async (id) => {
  const course = await courseRepository.findById(id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  return courseRepository.remove(id);
};

const getCoursesByCategory = async (category) => {
  return courseRepository.findByCategory(category);
};

const searchCourses = async (query) => {
  return courseRepository.search(query);
};

const enrollInCourse = async (userId, courseId) => {
  const course = await courseRepository.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  const existingEnrollment = await userCourseRepository.findByUserAndCourse(userId, courseId);
  if (existingEnrollment) {
    throw new AppError("Already enrolled in this course", 409);
  }

  const enrollment = await userCourseRepository.enroll({
    userId,
    courseId,
    status: "enrolled",
    progress: 0,
  });

  await prisma.course.update({
    where: { id: courseId },
    data: { enrolledCount: { increment: 1 } },
  });

  return enrollment;
};

const getEnrolledCourses = async (userId) => {
  return userCourseRepository.findByUserId(userId);
};

const updateCourseProgress = async (userId, courseId, progress) => {
  const enrollment = await userCourseRepository.findByUserAndCourse(userId, courseId);
  if (!enrollment) {
    throw new AppError("Not enrolled in this course", 404);
  }

  return userCourseRepository.updateProgress(userId, courseId, progress);
};

const unenrollFromCourse = async (userId, courseId) => {
  const enrollment = await userCourseRepository.findByUserAndCourse(userId, courseId);
  if (!enrollment) {
    throw new AppError("Not enrolled in this course", 404);
  }

  await prisma.course.update({
    where: { id: courseId },
    data: { enrolledCount: { decrement: 1 } },
  });

  return userCourseRepository.unenroll(userId, courseId);
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

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
