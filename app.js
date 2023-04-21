require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const { App } = require("@slack/bolt");
const logger = require("./middlewares/logger.js");
const cookieParser = require("cookie-parser");
app.use(morgan("dev"));

const indexRouter = require("./routes/index");

const slack = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNINGSECRET,
  socketMode: true,
  appToken: process.env.SLACK_APPTOKEN,
});

const PORT = process.env.SERVER_PORT;

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["Authorization","refreshtoken"],
    // exposedHeaders: [],
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", indexRouter);

app.use((err, req, res, next) => {
  // Slack에 에러 메시지를 보냅니다.
  slack.client.chat.postMessage({
    channel: process.env.SLACK_CHANNEL,
    text: `An error occurred : ${err.message}`,
  });
  logger.error(err.stack);
  return res.status(err.output.payload.statusCode || 500).json({
    errorMessage: err.output.payload.message || "서버 에러가 발생했습니다.",
  });
});

// 슬렉 서버
(async () => {
  await slack.start(process.env.PORT || 3001);
  console.log("⚡️ Bolt app is running!");
})();

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
  logger.info(`${PORT} 포트 번호로 서버가 실행되었습니다.`);
});
