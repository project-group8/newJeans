const express = require("express");
const router = express.Router();
const authLoginMiddleware = require("../middlewares/auth-login-middleware");

const UserController = require("../controllers/users.controller");
const userController = new UserController();

// 회원가입
router.post("/signup", userController.userSignup);
// 회원 조회
router.get("/allUsers", userController.getAllusers);
// 로그인
router.post("/login", authLoginMiddleware, userController.userLogin);
// 로그 아웃
router.get("/logout", userController.userlogout);
module.exports = router;
