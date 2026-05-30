const prisma = require("../config/prisma");

const findByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const create = (userData) => {
  return prisma.user.create({ data: userData });
};

const update = (id, data) => {
  return prisma.user.update({ where: { id }, data });
};

const findById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const findRefreshToken = (token) => {
  return prisma.refreshToken.findUnique({ where: { token } });
};

const createRefreshToken = (data) => {
  return prisma.refreshToken.create({ data });
};

const deleteRefreshToken = (token) => {
  return prisma.refreshToken.delete({ where: { token } });
};

const deleteExpiredTokens = (userId) => {
  return prisma.refreshToken.deleteMany({
    where: {
      userId,
      expiresAt: { lt: new Date() },
    },
  });
};

module.exports = {
  findByEmail,
  create,
  update,
  findById,
  findRefreshToken,
  createRefreshToken,
  deleteRefreshToken,
  deleteExpiredTokens,
};
