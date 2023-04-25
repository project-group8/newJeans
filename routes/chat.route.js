const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const ChatController = require("../controllers/chat.controller");
const chatController = new ChatController();

router.post("/hunsuChat", authMiddleware, chatController.createUserChat);
router.get("/hunsuChat", chatController.enterUserChat);

module.exports = router;
