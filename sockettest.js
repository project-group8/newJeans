const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

// This is the function that will be called when a user joins a room
const addUser = ({ id, name, room, maxParty, isAdmin }) => {
  // Check for existing user
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  // Validate name and room
  if (!name || !room) return { error: "이름과 방이 필요해요." };

  // Validate username
  if (existingUser) {
    return { error: "이미 존재하는 이름입니다." };
  }

  // Store user
  const user = { id, name, room };
  users.push(user);

  return { user };
};

// This is the function that will be called when a user leaves a room
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// This is the function that will be called when a user sends a message
const getUser = (id) => users.find((user) => user.id === id);

// This is the function that will be called when a user sends a message
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

/**
 * 채팅 데이터를 mysql에 저장합니다.
 */
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "testxp-database.cjncax7oufin.ap-northeast-2.rds.amazonaws.com",
  user: "root",
  password: "4321aaaa",
  database: "testtest",
});

// const router = require("./router");

const PORT = 4000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
// app.use(router);

const rooms = {};
const users = [];

// 클라이언트가 서버에 접속할 때의 이벤트
io.on("connection", (socket) => {
  console.log(`새로운 유저 '${socket.id}'가 접속했습니다.`);
  console.log(`현재 개설된 방 '${Object.keys(rooms).length}'개 입니다. `);

  socket.on("join", ({ name, room, maxParty, isAdmin = "" }, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      name,
      room,
      maxParty,
      isAdmin,
    });

    if (error) {
      return callback({ error: "에러가 발생했습니다." });
    }

    const numUsers = getUsersInRoom(user.room).length;

    socket.emit("currParty", {
      numUsers: `${numUsers}`,
      room: `${user.room}`,
      maxParty: `${maxParty}`,
    });

    if (numUsers >= user.maxParty) {
      return callback({
        error: "방이 가득 찼습니다. 다른 방을 이용해 주세요.",
      });
    }

    // 해당 방에 유저 추가
    socket.join(user.room);

    if (!rooms[user.room]) {
      rooms[user.room] = { messages: [] };
    }

    if (user.room.length == 0) {
      addUser({ user: "hunsuBot" });
    } else if (user.room.length > 0) {
      addUser({ user: "users" });
    }

    socket.emit("message", {
      user: "hunsuBot",
      text: `${user.name}님, ${user.room}에 오신 것을 환영합니다. `,
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
      messages: rooms[user.room].messages,
    });

    callback();
  });

  //disconnect 추가
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      console.log(`${user.name}이(가) 방을 나갔습니다.`);
      const room = user.room;
      if (getUsersInRoom(room).length === 0) {
        console.log(`${room} 방이 삭제되었습니다.`);
        delete rooms[room];
      } else {
        io.to(room).emit("roomData", {
          room: room,
          users: getUsersInRoom(room),
          messages: rooms[room].messages,
        });
      }
    }
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (!user) {
      return;
    }
    const room = user.room;
    if (!rooms[room]) {
      rooms[room] = { messages: [] };
    }
    rooms[room].messages.push({ user: user.name, text: message });
    // rooms[room].messages.push({ name: user.name, message: message });
    io.to(room).emit("message", { user: user.name, text: message });
    // io.to(room).emit("message", { name: user.name, message: message });
    // 채팅 불러오기 트라이
    io.to(room).emit("roomData", {
      room: room,
      users: getUsersInRoom(room),
      messages: rooms[room].messages,
    });
    // 채팅 불러오기 트라이
    callback();
  });

  //채팅을 db에 저장합니다.
  socket.on("new_message", (data) => {
    console.log("Client says", data);

    // send same message back to all users
    io.emit("new_message", data);

    // ! save message in DATABASE
    connection.query(
      "INSERT INTO ChatSaves (saveData) VALUES ('" + data + "')",
      function (error, result) {
        //
      }
    );
  });
});

server.listen(PORT, () => console.log(`서버가 ${PORT} 에서 시작되었어요`));
