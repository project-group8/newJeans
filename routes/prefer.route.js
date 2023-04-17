const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware.js");

const PreferController = require("../controllers/prefer.controller.js");
const preferController = new PreferController();

router.put("/post/:postIdx", authMiddleware, preferController.postToggleLike);

module.exports = router;
