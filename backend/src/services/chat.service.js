const chatRepository = require("../repositories/chat.repository");

const getChatHistory = async (userId, sessionId, pagination) => {
  const [messages, total] = await Promise.all([
    chatRepository.findBySessionId(userId, sessionId, pagination),
    chatRepository.countBySessionId(userId, sessionId),
  ]);
  return { messages, total };
};

const getUserSessions = async (userId) => {
  const sessions = await chatRepository.getSessions(userId);
  return sessions.map((session) => ({
    sessionId: session.sessionId,
    messageCount: session._count.id,
    lastMessageAt: session._max.createdAt,
    firstMessageAt: session._min.createdAt,
  }));
};

const saveMessage = async (userId, sessionId, role, content, metadata) => {
  const message = await chatRepository.createMessage({
    userId,
    sessionId,
    role,
    content,
    metadata: metadata || undefined,
  });
  return message;
};

const deleteSession = async (userId, sessionId) => {
  const messages = await chatRepository.findBySessionId(userId, sessionId, {
    skip: 0,
    limit: 1,
  });

  if (messages.length === 0) {
    const error = new Error("Chat session not found");
    error.statusCode = 404;
    throw error;
  }

  await chatRepository.deleteSession(userId, sessionId);
  return { deletedCount: messages.length };
};

module.exports = {
  getChatHistory,
  getUserSessions,
  saveMessage,
  deleteSession,
};
