const jobRepository = require("../repositories/job.repository");
const userJobRepository = require("../repositories/userJob.repository");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getAllJobs = async (filters, pagination) => {
  return jobRepository.findAll(filters, pagination);
};

const getJobById = async (id) => {
  const job = await jobRepository.findById(id);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  return job;
};

const createJob = async (data) => {
  return jobRepository.create(data);
};

const updateJob = async (id, data) => {
  const job = await jobRepository.findById(id);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  return jobRepository.update(id, data);
};

const deleteJob = async (id) => {
  const job = await jobRepository.findById(id);
  if (!job) {
    throw new AppError("Job not found", 404);
  }
  return jobRepository.remove(id);
};

const getJobsByCategory = async (category) => {
  return jobRepository.findByCategory(category);
};

const searchJobs = async (query) => {
  return jobRepository.search(query);
};

const getJobsBySkills = async (skills) => {
  return jobRepository.findBySkills(skills);
};

const saveJob = async (userId, jobId) => {
  const job = await jobRepository.findById(jobId);
  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const existing = await userJobRepository.findByUserAndJob(userId, jobId);
  if (existing) {
    throw new AppError("Job already saved", 409);
  }

  return userJobRepository.saveJob({
    userId,
    jobId,
    status: "saved",
  });
};

const getSavedJobs = async (userId) => {
  return userJobRepository.findByUserId(userId);
};

const updateJobStatus = async (userId, jobId, status) => {
  const userJob = await userJobRepository.findByUserAndJob(userId, jobId);
  if (!userJob) {
    throw new AppError("Job not saved by this user", 404);
  }

  return userJobRepository.updateStatus(userId, jobId, status);
};

const removeSavedJob = async (userId, jobId) => {
  const userJob = await userJobRepository.findByUserAndJob(userId, jobId);
  if (!userJob) {
    throw new AppError("Job not saved by this user", 404);
  }

  return userJobRepository.removeSaved(userId, jobId);
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
