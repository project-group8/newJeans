require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const logger = require("./middlewares/logger.js");
// const errorhandler = require("./middlewares/errorhandler.js");
// const { sequelize } = require("./models/index.js");
const cookieParser = require("cookie-parser");
app.use(morgan("dev"));

const indexRouter = require("./routes/index");

const PORT = process.env.SERVER_PORT;

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["Authorization"],
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user/kakaoLogin/", (req, res, next) => {
  const { code } = req.body;
  console.log(code);
  logger.info(code);
  return res.send(code || "값이 들어오지 않았습니다.");
});
app.use("/api", indexRouter);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  return res.status(err.output.payload.statusCode || 500).json({
    errorMessage: err.output.payload.message || "서버 에러가 발생했습니다.",
  });
});

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
  logger.info(`${PORT} 포트 번호로 서버가 실행되었습니다.`);
});
