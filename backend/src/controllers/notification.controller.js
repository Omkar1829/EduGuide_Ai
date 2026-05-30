const notificationService = require("../services/notification.service");
const { parsePagination } = require("../utils/pagination");
const { success, error } = require("../utils/apiResponse");

const getNotifications = async (req, res) => {
  try {
    const pagination = parsePagination(req);
    const { isRead } = req.query;
    const parsedIsRead = isRead !== undefined ? isRead === "true" : undefined;
    const result = await notificationService.getNotifications(req.user.id, parsedIsRead, pagination);
    return success(res, {
      notifications: result.notifications,
      pagination: {
        total: result.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(result.total / pagination.limit),
      },
    }, "Notifications fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    return success(res, { count }, "Unread count fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    return success(res, notification, "Notification marked as read", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    return success(res, result, "All notifications marked as read", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
