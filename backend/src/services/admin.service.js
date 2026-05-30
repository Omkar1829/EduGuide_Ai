const { AppError } = require("../middlewares/errorHandler");
const adminRepository = require("../repositories/admin.repository");

const getAllUsers = async (pagination, filters) => {
  return adminRepository.getAllUsers(pagination, filters);
};

const getUserById = async (id) => {
  const user = await adminRepository.getUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

const updateUser = async (id, data) => {
  const user = await adminRepository.getUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const allowedFields = {};
  if (data.firstName !== undefined) allowedFields.firstName = data.firstName;
  if (data.lastName !== undefined) allowedFields.lastName = data.lastName;
  if (data.role !== undefined) allowedFields.role = data.role;
  if (data.isVerified !== undefined) allowedFields.isVerified = data.isVerified;
  if (data.isActive !== undefined) allowedFields.isActive = data.isActive;
  if (data.avatarUrl !== undefined) allowedFields.avatarUrl = data.avatarUrl;

  if (Object.keys(allowedFields).length === 0) {
    throw new AppError("No valid fields to update", 400);
  }

  return adminRepository.updateUser(id, allowedFields);
};

const deleteUser = async (id) => {
  const user = await adminRepository.getUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.role === "ADMIN") {
    throw new AppError("Cannot delete admin users", 403);
  }
  return adminRepository.deleteUser(id);
};

const toggleUserActive = async (id) => {
  const user = await adminRepository.toggleUserActive(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

const getUserStats = async () => {
  return adminRepository.getUserStats();
};

const getAllCourses = async (pagination, filters) => {
  return adminRepository.getAllCourses(pagination, filters);
};

const getCourseById = async (id) => {
  const course = await adminRepository.getCourseById(id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  return course;
};

const createCourse = async (data) => {
  return adminRepository.createCourse(data);
};

const updateCourse = async (id, data) => {
  const course = await adminRepository.getCourseById(id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  return adminRepository.updateCourse(id, data);
};

const deleteCourse = async (id) => {
  const course = await adminRepository.getCourseById(id);
  if (!course) {
    throw new AppError("Course not found", 404);
  }
  return adminRepository.deleteCourse(id);
};

const getCourseStats = async () => {
  return adminRepository.getCourseStats();
};

const getAllJobs = async (pagination, filters) => {
  return adminRepository.getAllJobs(pagination, filters);
};

const getJobById = async (id) => {
  const job = await adminRepository.getJobById(id);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  return job;
};

const createJob = async (data) => {
  return adminRepository.createJob(data);
};

const updateJob = async (id, data) => {
  const job = await adminRepository.getJobById(id);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  return adminRepository.updateJob(id, data);
};

const deleteJob = async (id) => {
  const job = await adminRepository.getJobById(id);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  return adminRepository.deleteJob(id);
};

const getJobStats = async () => {
  return adminRepository.getJobStats();
};

const getPlatformStats = async () => {
  return adminRepository.getPlatformStats();
};

const getRecentActivity = async (limit) => {
  return adminRepository.getRecentActivity(limit);
};

const getAnalyticsData = async () => {
  return adminRepository.getAnalyticsData();
};

const getAllQuizzes = async (pagination, filters) => {
  return adminRepository.getAllQuizzes(pagination, filters);
};

const getQuizById = async (id) => {
  const quiz = await adminRepository.getQuizById(id);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }
  return quiz;
};

const deleteQuiz = async (id) => {
  const quiz = await adminRepository.getQuizById(id);
  if (!quiz) {
    throw new AppError("Quiz not found", 404);
  }
  return adminRepository.deleteQuiz(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserActive,
  getUserStats,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
  getPlatformStats,
  getRecentActivity,
  getAnalyticsData,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
};
