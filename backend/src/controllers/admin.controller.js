const { success } = require("../utils/apiResponse");
const { parsePagination } = require("../utils/pagination");
const adminService = require("../services/admin.service");

const getAllUsers = async (req, res, next) => {
  try {
    const pagination = parsePagination(req);
    const filters = {
      role: req.query.role,
      isActive: req.query.isActive,
      isVerified: req.query.isVerified,
      search: req.query.search,
    };
    const result = await adminService.getAllUsers(pagination, filters);
    return success(res, result, "Users retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    return success(res, user, "User retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    return success(res, user, "User updated successfully");
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id);
    return success(res, null, "User deleted successfully");
  } catch (err) {
    next(err);
  }
};

const toggleUserActive = async (req, res, next) => {
  try {
    const user = await adminService.toggleUserActive(req.params.id);
    return success(res, user, "User status toggled successfully");
  } catch (err) {
    next(err);
  }
};

const getUserStats = async (req, res, next) => {
  try {
    const stats = await adminService.getUserStats();
    return success(res, stats, "User statistics retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getAllCourses = async (req, res, next) => {
  try {
    const pagination = parsePagination(req);
    const filters = {
      category: req.query.category,
      level: req.query.level,
      isActive: req.query.isActive,
      provider: req.query.provider,
      search: req.query.search,
    };
    const result = await adminService.getAllCourses(pagination, filters);
    return success(res, result, "Courses retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await adminService.getCourseById(req.params.id);
    return success(res, course, "Course retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const course = await adminService.createCourse(req.body);
    return success(res, course, "Course created successfully", 201);
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await adminService.updateCourse(req.params.id, req.body);
    return success(res, course, "Course updated successfully");
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    await adminService.deleteCourse(req.params.id);
    return success(res, null, "Course deleted successfully");
  } catch (err) {
    next(err);
  }
};

const getCourseStats = async (req, res, next) => {
  try {
    const stats = await adminService.getCourseStats();
    return success(res, stats, "Course statistics retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getAllJobs = async (req, res, next) => {
  try {
    const pagination = parsePagination(req);
    const filters = {
      category: req.query.category,
      type: req.query.type,
      isActive: req.query.isActive,
      company: req.query.company,
      location: req.query.location,
      search: req.query.search,
    };
    const result = await adminService.getAllJobs(pagination, filters);
    return success(res, result, "Jobs retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await adminService.getJobById(req.params.id);
    return success(res, job, "Job retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const createJob = async (req, res, next) => {
  try {
    const job = await adminService.createJob(req.body);
    return success(res, job, "Job created successfully", 201);
  } catch (err) {
    next(err);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await adminService.updateJob(req.params.id, req.body);
    return success(res, job, "Job updated successfully");
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    await adminService.deleteJob(req.params.id);
    return success(res, null, "Job deleted successfully");
  } catch (err) {
    next(err);
  }
};

const getJobStats = async (req, res, next) => {
  try {
    const stats = await adminService.getJobStats();
    return success(res, stats, "Job statistics retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getPlatformStats = async (req, res, next) => {
  try {
    const stats = await adminService.getPlatformStats();
    return success(res, stats, "Platform statistics retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 20)
    );
    const activity = await adminService.getRecentActivity(limit);
    return success(res, activity, "Recent activity retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getAnalyticsData = async (req, res, next) => {
  try {
    const data = await adminService.getAnalyticsData();
    return success(res, data, "Analytics data retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getAllQuizzes = async (req, res, next) => {
  try {
    const pagination = parsePagination(req);
    const filters = {
      category: req.query.category,
      status: req.query.status,
      search: req.query.search,
    };
    const result = await adminService.getAllQuizzes(pagination, filters);
    return success(res, result, "Quizzes retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getQuizById = async (req, res, next) => {
  try {
    const quiz = await adminService.getQuizById(req.params.id);
    return success(res, quiz, "Quiz retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const deleteQuiz = async (req, res, next) => {
  try {
    await adminService.deleteQuiz(req.params.id);
    return success(res, null, "Quiz deleted successfully");
  } catch (err) {
    next(err);
  }
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
