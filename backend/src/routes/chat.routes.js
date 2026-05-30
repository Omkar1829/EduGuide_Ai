const express = require("express");
const chatController = require("../controllers/chat.controller");
const validate = require("../middlewares/validate");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.use(authenticate);

router.get("/history/:sessionId", chatController.getChatHistory);
router.get("/sessions", chatController.getSessions);
router.post("/message", chatController.saveMessage);
router.delete("/sessions/:sessionId", chatController.deleteSession);

module.exports = router;
