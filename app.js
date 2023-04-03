const express = require("express");
const app = express();

const cors = require("cors");
const logger = require("./middlewares/logger.js");
const errorhandler = require("./middlewares/errorhandler.js");
const { sequelize } = require("./models/index.js");
const cookieParser = require("cookie-parser");

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

app.use("/api", indexRouter);
app.use(errorhandler);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
  logger.info(`${PORT} 포트 번호로 서버가 실행되었습니다.`);
});
