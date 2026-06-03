const { success, error } = require("../utils/apiResponse");
const { parsePagination } = require("../utils/pagination");
const jobService = require("../services/job.service");

const getAllJobs = async (req, res, next) => {
  try {
    const pagination = parsePagination(req);
    const filters = {
      category: req.query.category,
      type: req.query.type,
      company: req.query.company,
      location: req.query.location,
      experience: req.query.experience,
      search: req.query.search || req.query.q,
    };

    const result = await jobService.getAllJobs(filters, pagination);
    return success(res, result, "Jobs retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    return success(res, job, "Job retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const createJob = async (req, res, next) => {
  try {
    const job = await jobService.createJob(req.body);
    return success(res, job, "Job created successfully", 201);
  } catch (err) {
    next(err);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    return success(res, job, "Job updated successfully");
  } catch (err) {
    next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    await jobService.deleteJob(req.params.id);
    return success(res, null, "Job deleted successfully");
  } catch (err) {
    next(err);
  }
};

const getJobsByCategory = async (req, res, next) => {
  try {
    const jobs = await jobService.getJobsByCategory(req.params.category);
    return success(res, jobs, "Jobs retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const searchJobs = async (req, res, next) => {
  try {
    const jobs = await jobService.searchJobs(req.query.q);
    return success(res, jobs, "Search results retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const getJobsBySkills = async (req, res, next) => {
  try {
    const { skills } = req.query;
    const skillsArray = skills ? skills.split(",").map((s) => s.trim()) : [];
    const jobs = await jobService.getJobsBySkills(skillsArray);
    return success(res, jobs, "Jobs retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const saveJob = async (req, res, next) => {
  try {
    const saved = await jobService.saveJob(req.user.id, req.params.id);
    return success(res, saved, "Job saved successfully", 201);
  } catch (err) {
    next(err);
  }
};

const getSavedJobs = async (req, res, next) => {
  try {
    const pagination = parsePagination(req);
    const result = await jobService.getSavedJobs(req.user.id, pagination);
    return success(res, result, "Saved jobs retrieved successfully");
  } catch (err) {
    next(err);
  }
};

const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const result = await jobService.updateJobStatus(req.user.id, req.params.id, status);
    return success(res, result, "Job status updated successfully");
  } catch (err) {
    next(err);
  }
};

const removeSavedJob = async (req, res, next) => {
  try {
    await jobService.removeSavedJob(req.user.id, req.params.id);
    return success(res, null, "Job removed from saved list");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobsByCategory,
  searchJobs,
  getJobsBySkills,
  saveJob,
  getSavedJobs,
  updateJobStatus,
  removeSavedJob,
};
