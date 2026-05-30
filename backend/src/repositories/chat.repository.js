const prisma = require("../config/prisma");

const findBySessionId = (userId, sessionId, { skip, limit }) => {
  return prisma.chatHistory.findMany({
    where: { userId, sessionId },
    orderBy: { createdAt: "asc" },
    skip,
    take: limit,
  });
};

const countBySessionId = (userId, sessionId) => {
  return prisma.chatHistory.count({ where: { userId, sessionId } });
};

const findByUserId = (userId, { skip, limit }) => {
  return prisma.chatHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
};

const createMessage = (data) => {
  return prisma.chatHistory.create({ data });
};

const deleteSession = (userId, sessionId) => {
  return prisma.chatHistory.deleteMany({
    where: { userId, sessionId },
  });
};

const getSessions = (userId) => {
  return prisma.chatHistory.groupBy({
    by: ["sessionId"],
    where: { userId },
    _count: { id: true },
    _max: { createdAt: true },
    _min: { createdAt: true },
    orderBy: { sessionId: "desc" },
  });
};

module.exports = {
  findBySessionId,
  countBySessionId,
  findByUserId,
  createMessage,
  deleteSession,
  getSessions,
};
