const prisma = require("../config/prisma");

const findByUserId = (userId, category, { skip, limit }) => {
  const where = { userId };
  if (category) where.category = category;
  return prisma.quiz.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: { results: true },
  });
};

const countByUserId = (userId, category) => {
  const where = { userId };
  if (category) where.category = category;
  return prisma.quiz.count({ where });
};

const findById = (id) => {
  return prisma.quiz.findUnique({
    where: { id },
    include: { results: true },
  });
};

const create = (data) => {
  return prisma.quiz.create({ data });
};

const update = (id, data) => {
  return prisma.quiz.update({ where: { id }, data });
};

const findResults = (quizId) => {
  return prisma.quizResult.findMany({
    where: { quizId },
    orderBy: { createdAt: "desc" },
  });
};

const createResult = (data) => {
  return prisma.quizResult.create({ data });
};

const getResultById = (id) => {
  return prisma.quizResult.findUnique({ where: { id } });
};

const findUserResults = (userId, { skip, limit }) => {
  return prisma.quizResult.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: { quiz: true },
  });
};

const countUserResults = (userId) => {
  return prisma.quizResult.count({ where: { userId } });
};

module.exports = {
  findByUserId,
  countByUserId,
  findById,
  create,
  update,
  findResults,
  createResult,
  getResultById,
  findUserResults,
  countUserResults,
};
