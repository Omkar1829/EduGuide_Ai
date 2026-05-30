const roadmapService = require("../services/roadmap.service");
const { parsePagination } = require("../utils/pagination");
const { success, error } = require("../utils/apiResponse");

const getRoadmaps = async (req, res) => {
  try {
    const pagination = parsePagination(req);
    const result = await roadmapService.getRoadmaps(req.user.id, pagination);
    return success(res, {
      roadmaps: result.roadmaps,
      pagination: {
        total: result.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(result.total / pagination.limit),
      },
    }, "Roadmaps fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await roadmapService.getRoadmapById(req.params.id, req.user.id);
    return success(res, roadmap, "Roadmap fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const createRoadmap = async (req, res) => {
  try {
    const roadmap = await roadmapService.createRoadmap(req.user.id, req.body);
    return success(res, roadmap, "Roadmap created successfully", 201);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const updateRoadmap = async (req, res) => {
  try {
    const roadmap = await roadmapService.updateRoadmap(req.params.id, req.user.id, req.body);
    return success(res, roadmap, "Roadmap updated successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const deleteRoadmap = async (req, res) => {
  try {
    await roadmapService.deleteRoadmap(req.params.id, req.user.id);
    return success(res, null, "Roadmap deleted successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

module.exports = {
  getRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
};
