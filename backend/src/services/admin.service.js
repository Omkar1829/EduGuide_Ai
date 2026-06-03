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
  if (data.subscriptionTier !== undefined) allowedFields.subscriptionTier = data.subscriptionTier;

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
  const jobData = { ...data };
  if (jobData.salaryMin !== undefined || jobData.salaryMax !== undefined) {
    const min = jobData.salaryMin !== undefined && jobData.salaryMin !== null ? jobData.salaryMin : "";
    const max = jobData.salaryMax !== undefined && jobData.salaryMax !== null ? jobData.salaryMax : "";
    if (min || max) {
      jobData.salaryRange = `${min} - ${max}`.trim();
    }
    delete jobData.salaryMin;
    delete jobData.salaryMax;
  }
  return adminRepository.createJob(jobData);
};

const updateJob = async (id, data) => {
  const job = await adminRepository.getJobById(id);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  const jobData = { ...data };
  if (jobData.salaryMin !== undefined || jobData.salaryMax !== undefined) {
    const min = jobData.salaryMin !== undefined && jobData.salaryMin !== null ? jobData.salaryMin : "";
    const max = jobData.salaryMax !== undefined && jobData.salaryMax !== null ? jobData.salaryMax : "";
    if (min || max) {
      jobData.salaryRange = `${min} - ${max}`.trim();
    }
    delete jobData.salaryMin;
    delete jobData.salaryMax;
  }
  return adminRepository.updateJob(id, jobData);
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

let activeScrapeProcess = null;
let activeScrapeStatus = {
  active: false,
  location: '',
  limit: 10,
  keyword: '',
  progress: {
    scraped: 0,
    inserted: 0,
    failed: 0,
    currentSearch: '',
    currentLoc: '',
  },
  result: null,
};

const getScrapeStatus = () => {
  return activeScrapeStatus;
};

const stopScrapeJobs = () => {
  if (activeScrapeProcess) {
    try {
      activeScrapeProcess.kill("SIGINT");
    } catch (e) {
      console.error("Failed to kill scraper process:", e);
    }
    activeScrapeProcess = null;
  }
  activeScrapeStatus.active = false;
  activeScrapeStatus.result = {
    success: false,
    message: "Scraping terminated by administrator.",
    inserted: activeScrapeStatus.progress.inserted,
    failed: activeScrapeStatus.progress.failed,
    totalScraped: activeScrapeStatus.progress.scraped,
  };
  return activeScrapeStatus;
};

const scrapeJobs = async (location, limit = 10, keyword = '') => {
  const { spawn } = require("child_process");
  const path = require("path");

  if (activeScrapeStatus.active) {
    throw new AppError("Scrape process already running.", 400);
  }

  // Reset status
  activeScrapeStatus = {
    active: true,
    location,
    limit: parseInt(limit) || 10,
    keyword: keyword || '',
    progress: {
      scraped: 0,
      inserted: 0,
      failed: 0,
      currentSearch: '',
      currentLoc: '',
    },
    result: null,
  };

  const scraperPath = path.resolve(__dirname, "../../../job-scraper/src/index.js");
  const cmdArgs = ["scrape", location, keyword || '', limit ? String(limit) : ''];
  const cwd = path.resolve(__dirname, "../../../job-scraper");

  console.log(`Spawning background scraper process: node "${scraperPath}" ${cmdArgs.join(" ")}`);
  
  activeScrapeProcess = spawn("node", [scraperPath, ...cmdArgs], { cwd });

  activeScrapeProcess.stdout.on("data", (data) => {
    const text = data.toString();
    const lines = text.split("\n");
    for (const line of lines) {
      if (line.includes("PROGRESS_UPDATE:")) {
        try {
          const startIdx = line.indexOf("PROGRESS_UPDATE:");
          const jsonStr = line.substring(startIdx + "PROGRESS_UPDATE:".length).trim();
          const update = JSON.parse(jsonStr);
          if (update.scrapedCount !== undefined) {
            activeScrapeStatus.progress.scraped += update.scrapedCount;
          }
          if (update.insertedCount !== undefined) {
            activeScrapeStatus.progress.inserted = update.insertedCount;
          }
          if (update.failedCount !== undefined) {
            activeScrapeStatus.progress.failed = update.failedCount;
          }
          if (update.currentSearch) {
            activeScrapeStatus.progress.currentSearch = update.currentSearch;
          }
          if (update.currentLoc) {
            activeScrapeStatus.progress.currentLoc = update.currentLoc;
          }
        } catch (e) {
          console.error("Error parsing scraper progress update:", e);
        }
      }
    }
  });

  activeScrapeProcess.stderr.on("data", (data) => {
    console.error(`Scraper stderr: ${data.toString()}`);
  });

  activeScrapeProcess.on("close", (code) => {
    console.log(`Scraper process finished with exit code ${code}`);
    activeScrapeStatus.active = false;
    activeScrapeProcess = null;
    if (!activeScrapeStatus.result) {
      activeScrapeStatus.result = {
        success: code === 0,
        inserted: activeScrapeStatus.progress.inserted,
        failed: activeScrapeStatus.progress.failed,
        totalScraped: activeScrapeStatus.progress.scraped,
      };
    }
  });

  return activeScrapeStatus;
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
  scrapeJobs,
  getScrapeStatus,
  stopScrapeJobs,
};
