const resumeService = require("../services/resume.service");
const { parsePagination } = require("../utils/pagination");
const { success, error } = require("../utils/apiResponse");

const getResumes = async (req, res) => {
  try {
    const pagination = parsePagination(req);
    const result = await resumeService.getResumes(req.user.id, pagination);
    return success(res, {
      resumes: result.resumes,
      pagination: {
        total: result.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(result.total / pagination.limit),
      },
    }, "Resumes fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id, req.user.id);
    return success(res, resume, "Resume fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const createResume = async (req, res) => {
  try {
    const resume = await resumeService.createResume(req.user.id, req.body);
    return success(res, resume, "Resume created successfully", 201);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const updateResume = async (req, res) => {
  try {
    const resume = await resumeService.updateResume(req.params.id, req.user.id, req.body);
    return success(res, resume, "Resume updated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const deleteResume = async (req, res) => {
  try {
    await resumeService.deleteResume(req.params.id, req.user.id);
    return success(res, null, "Resume deleted successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const analyzeResume = async (req, res) => {
  try {
    const resume = await resumeService.analyzeResume(req.params.id, req.user.id);
    return success(res, resume, "Resume analyzed successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

module.exports = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  analyzeResume,
};
