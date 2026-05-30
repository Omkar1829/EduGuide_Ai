const prisma = require("../config/prisma");

const findByUserId = (userId, isRead, { skip, limit }) => {
  const where = { userId };
  if (isRead !== undefined) where.isRead = isRead;
  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
};

const countByUserId = (userId, isRead) => {
  const where = { userId };
  if (isRead !== undefined) where.isRead = isRead;
  return prisma.notification.count({ where });
};

const findById = (id) => {
  return prisma.notification.findUnique({ where: { id } });
};

const create = (data) => {
  return prisma.notification.create({ data });
};

const markAsRead = (id) => {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });
};

const markAllAsRead = (userId) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
};

const deleteOlderThan = (userId, date) => {
  return prisma.notification.deleteMany({
    where: {
      userId,
      createdAt: { lt: date },
    },
  });
};

const getUnreadCount = (userId) => {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

module.exports = {
  findByUserId,
  countByUserId,
  findById,
  create,
  markAsRead,
  markAllAsRead,
  deleteOlderThan,
  getUnreadCount,
};
