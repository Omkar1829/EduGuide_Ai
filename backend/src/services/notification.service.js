const notificationRepository = require("../repositories/notification.repository");

const getNotifications = async (userId, isRead, pagination) => {
  const [notifications, total] = await Promise.all([
    notificationRepository.findByUserId(userId, isRead, pagination),
    notificationRepository.countByUserId(userId, isRead),
  ]);
  return { notifications, total };
};

const getUnreadCount = async (userId) => {
  const count = await notificationRepository.getUnreadCount(userId);
  return count;
};

const createNotification = async (userId, type, title, message, data) => {
  const notification = await notificationRepository.create({
    userId,
    type,
    title,
    message,
    data: data || undefined,
  });
  return notification;
};

const markAsRead = async (id, userId) => {
  const notification = await notificationRepository.findById(id);
  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }
  if (notification.userId !== userId) {
    const error = new Error("Not authorized to update this notification");
    error.statusCode = 403;
    throw error;
  }

  const updated = await notificationRepository.markAsRead(id);
  return updated;
};

const markAllAsRead = async (userId) => {
  const result = await notificationRepository.markAllAsRead(userId);
  return { updatedCount: result.count };
};

const deleteOldNotifications = async (userId, daysToKeep = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const result = await notificationRepository.deleteOlderThan(userId, cutoffDate);
  return { deletedCount: result.count };
};

module.exports = {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteOldNotifications,
};
