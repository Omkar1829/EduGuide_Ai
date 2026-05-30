const roadmapRepository = require("../repositories/roadmap.repository");

const getRoadmaps = async (userId, pagination) => {
  const [roadmaps, total] = await Promise.all([
    roadmapRepository.findByUserId(userId, pagination),
    roadmapRepository.countByUserId(userId),
  ]);
  return { roadmaps, total };
};

const getRoadmapById = async (id, userId) => {
  const roadmap = await roadmapRepository.findById(id);
  if (!roadmap) {
    const error = new Error("Roadmap not found");
    error.statusCode = 404;
    throw error;
  }
  if (roadmap.userId !== userId) {
    const error = new Error("Not authorized to access this roadmap");
    error.statusCode = 403;
    throw error;
  }
  return roadmap;
};

const createRoadmap = async (userId, { title, description, targetCareer, phases, progress, isCompleted }) => {
  const roadmap = await roadmapRepository.create({
    userId,
    title,
    description: description || null,
    targetCareer,
    phases: phases || [],
    progress: progress || 0,
    isCompleted: isCompleted || false,
  });
  return roadmap;
};

const updateRoadmap = async (id, userId, data) => {
  const existing = await roadmapRepository.findById(id);
  if (!existing) {
    const error = new Error("Roadmap not found");
    error.statusCode = 404;
    throw error;
  }
  if (existing.userId !== userId) {
    const error = new Error("Not authorized to update this roadmap");
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = ["title", "description", "targetCareer", "phases", "progress", "isCompleted"];
  const updateData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const roadmap = await roadmapRepository.update(id, updateData);
  return roadmap;
};

const deleteRoadmap = async (id, userId) => {
  const existing = await roadmapRepository.findById(id);
  if (!existing) {
    const error = new Error("Roadmap not found");
    error.statusCode = 404;
    throw error;
  }
  if (existing.userId !== userId) {
    const error = new Error("Not authorized to delete this roadmap");
    error.statusCode = 403;
    throw error;
  }

  await roadmapRepository.deleteRoadmap(id);
};

module.exports = {
  getRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
};
