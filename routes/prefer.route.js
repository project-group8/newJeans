const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware.js");

const PreferController = require("../controllers/prefer.controller.js");
const preferController = new PreferController();

// 포스트에 투표합니다.
router.put("/post/:postIdx", authMiddleware, preferController.postPoll);

// 포스트의 투표 결과를 봅니다.
router.get("/post/:postIdx", preferController.postPollResult);

module.exports = router;
