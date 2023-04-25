require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const { App } = require("@slack/bolt");
const logger = require("./middlewares/logger.js");
const cookieParser = require("cookie-parser");
app.use(morgan("dev"));

const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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
    exposedHeaders: ["Authorization", "refreshtoken"],
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

/**
 * 접속한 유저정보가 connectedUsers 객체로 들어갑니다.
 */
const connectedUsers = {};
io.on("connection", (socket) => {
  connectedUsers[socket.id] = socket;

  //join메서드는 유저를 namespace내의 room으로 이동시킵니다.
  socket.join(socket.id);

  // 현재 namespace내 모든 이용자 수 입니다.
  console.log(
    "현재 namespace내 모든 이용자 수",
    Object.keys(connectedUsers).length
  );

  // room의 이용자 수를 확인합니다.
  console.log(
    "방의 이용자 확인",
    io.sockets.adapter.rooms.get(socket.id)?.size
  );

  // 현재 소캣 아이디입니다.
  console.log("소켓 테스트 socket.id : ", socket.id);

  // 현재 커넥트 되어있는 유저 정보입니다.
  console.log("Connection Info : ", socket.request.connection._peername);

  // 클라이언트에서 "send message"로 요청을 보내면 서버에서 받아주고
  // "receive message"를 클라이언트에 보내줍니다.
  socket.on("send message", (item) => {
    const msg = item.name + " : " + item.message;
    console.log(msg);
    io.emit("receive message", { name: item.name, message: item.message });
  });

  // 연결이 끊어지면 namespace내의 모든 유저를 삭제합니다.
  // 차후에는 room으로 범위를 좁히는 것이 좋다고 생각됩니다.
  socket.on("disconnect", function () {
    delete connectedUsers[socket.id];
    console.log("user disconnected: ", socket.id);
    console.log("user disconnected: ", connectedUsers[0]);
    Object.keys(connectedUsers).forEach((socketId) => {
      delete connectedUsers[socketId];
    });
  });
});

// 슬렉 서버
(async () => {
  await slack.start(process.env.SLACK_PORT);
  console.log("⚡️ Bolt app is running!");
})();

server.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
  logger.info(`${PORT} 포트 번호로 서버가 실행되었습니다.`);
});
