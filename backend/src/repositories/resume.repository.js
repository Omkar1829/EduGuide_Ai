const prisma = require("../config/prisma");

const findByUserId = (userId, { skip, limit }) => {
  return prisma.resumeAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
};

const countByUserId = (userId) => {
  return prisma.resumeAnalysis.count({ where: { userId } });
};

const findById = (id) => {
  return prisma.resumeAnalysis.findUnique({ where: { id } });
};

const create = (data) => {
  return prisma.resumeAnalysis.create({ data });
};

const update = (id, data) => {
  return prisma.resumeAnalysis.update({ where: { id }, data });
};

const deleteResume = (id) => {
  return prisma.resumeAnalysis.delete({ where: { id } });
};

module.exports = {
  findByUserId,
  countByUserId,
  findById,
  create,
  update,
  deleteResume,
};
