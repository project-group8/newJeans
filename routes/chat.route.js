const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const ChatController = require("../controllers/chat.controller");
const chatController = new ChatController();

router.post("/hunsuChat", authMiddleware, chatController.createUserChat); // 확인
router.get("/hunsuChat", chatController.enterUserChat); // 확인
router.get("/hunsuChat/admin/:roomName", chatController.adminUser); // 확인
router.delete(
  "/hunsuChat/:roomName",
  authMiddleware,
  chatController.deleteUserChat
); // 확인
router.post("/chatSave", authMiddleware, chatController.chatSave); //확인
router.get("/chatSave/:chatSaveIdx", chatController.findChatSave); // 확인
router.get("/doneChat", chatController.doneChat); //확인

// /api/chat/chatSave

module.exports = router;
