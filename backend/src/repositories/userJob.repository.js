const prisma = require("../config/prisma");

const findByUserId = async (userId, pagination = {}) => {
  const { page = 1, limit = 10, skip = 0 } = pagination;

  const [userJobs, total] = await Promise.all([
    prisma.userJob.findMany({
      where: { userId },
      include: { job: true },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.userJob.count({ where: { userId } }),
  ]);

  return {
    userJobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const findByUserAndJob = async (userId, jobId) => {
  return prisma.userJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
};

const saveJob = async (data) => {
  return prisma.userJob.create({ data });
};

const updateStatus = async (userId, jobId, status) => {
  const updateData = { status };
  if (status === "applied") {
    updateData.appliedAt = new Date();
  }

  return prisma.userJob.update({
    where: { userId_jobId: { userId, jobId } },
    data: updateData,
  });
};

const removeSaved = async (userId, jobId) => {
  return prisma.userJob.delete({
    where: { userId_jobId: { userId, jobId } },
  });
};

module.exports = {
  findByUserId,
  findByUserAndJob,
  saveJob,
  updateStatus,
  removeSaved,
};
