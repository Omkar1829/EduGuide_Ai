const resumeRepository = require("../repositories/resume.repository");

const getResumes = async (userId, pagination) => {
  const [resumes, total] = await Promise.all([
    resumeRepository.findByUserId(userId, pagination),
    resumeRepository.countByUserId(userId),
  ]);
  return { resumes, total };
};

const getResumeById = async (id, userId) => {
  const resume = await resumeRepository.findById(id);
  if (!resume) {
    const error = new Error("Resume not found");
    error.statusCode = 404;
    throw error;
  }
  if (resume.userId !== userId) {
    const error = new Error("Not authorized to access this resume");
    error.statusCode = 403;
    throw error;
  }
  return resume;
};

const createResume = async (userId, { fileName, fileUrl, parsedContent }) => {
  const resume = await resumeRepository.create({
    userId,
    fileName,
    fileUrl: fileUrl || null,
    parsedContent: parsedContent || undefined,
    status: "PENDING",
  });
  return resume;
};

const updateResume = async (id, userId, data) => {
  const existing = await resumeRepository.findById(id);
  if (!existing) {
    const error = new Error("Resume not found");
    error.statusCode = 404;
    throw error;
  }
  if (existing.userId !== userId) {
    const error = new Error("Not authorized to update this resume");
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = ["fileName", "fileUrl", "parsedContent", "status", "analysis", "score", "feedback", "recommendations"];
  const updateData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const resume = await resumeRepository.update(id, updateData);
  return resume;
};

const deleteResume = async (id, userId) => {
  const existing = await resumeRepository.findById(id);
  if (!existing) {
    const error = new Error("Resume not found");
    error.statusCode = 404;
    throw error;
  }
  if (existing.userId !== userId) {
    const error = new Error("Not authorized to delete this resume");
    error.statusCode = 403;
    throw error;
  }

  await resumeRepository.deleteResume(id);
};

const analyzeResume = async (id, userId) => {
  const resume = await resumeRepository.findById(id);
  if (!resume) {
    const error = new Error("Resume not found");
    error.statusCode = 404;
    throw error;
  }
  if (resume.userId !== userId) {
    const error = new Error("Not authorized to analyze this resume");
    error.statusCode = 403;
    throw error;
  }

  await resumeRepository.update(id, { status: "ANALYZED" });

  const analysis = {
    skills: [],
    experience: [],
    education: [],
    suggestions: [],
    score: 0,
    analyzedAt: new Date().toISOString(),
  };

  const updated = await resumeRepository.update(id, {
    status: "ANALYZED",
    analysis,
    score: analysis.score,
    feedback: { summary: "Resume analysis complete", suggestions: analysis.suggestions },
    recommendations: [],
  });

  return updated;
};

module.exports = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  analyzeResume,
};
