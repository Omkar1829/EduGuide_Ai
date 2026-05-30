const prisma = require("../config/prisma");

const findByUserId = (userId, { skip, limit }) => {
  return prisma.careerRoadmap.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
};

const countByUserId = (userId) => {
  return prisma.careerRoadmap.count({ where: { userId } });
};

const findById = (id) => {
  return prisma.careerRoadmap.findUnique({ where: { id } });
};

const create = (data) => {
  return prisma.careerRoadmap.create({ data });
};

const update = (id, data) => {
  return prisma.careerRoadmap.update({ where: { id }, data });
};

const deleteRoadmap = (id) => {
  return prisma.careerRoadmap.delete({ where: { id } });
};

module.exports = {
  findByUserId,
  countByUserId,
  findById,
  create,
  update,
  deleteRoadmap,
};
