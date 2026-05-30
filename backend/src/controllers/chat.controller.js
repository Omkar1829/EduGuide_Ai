const chatService = require("../services/chat.service");
const { parsePagination } = require("../utils/pagination");
const { success, error } = require("../utils/apiResponse");

const getChatHistory = async (req, res) => {
  try {
    const pagination = parsePagination(req);
    const { sessionId } = req.params;
    const result = await chatService.getChatHistory(req.user.id, sessionId, pagination);
    return success(res, {
      messages: result.messages,
      pagination: {
        total: result.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(result.total / pagination.limit),
      },
    }, "Chat history fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await chatService.getUserSessions(req.user.id);
    return success(res, sessions, "Sessions fetched successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const saveMessage = async (req, res) => {
  try {
    const { sessionId, role, content, metadata } = req.body;
    const message = await chatService.saveMessage(
      req.user.id,
      sessionId,
      role,
      content,
      metadata
    );
    return success(res, message, "Message saved successfully", 201);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await chatService.deleteSession(req.user.id, sessionId);
    return success(res, result, "Session deleted successfully", 200);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return error(res, err.message, statusCode);
  }
};

module.exports = {
  getChatHistory,
  getSessions,
  saveMessage,
  deleteSession,
};
