const express = require("express");
const app = express();

const cors = require("cors");
const { sequelize } = require("./models/index.js");
const cookieParser = require("cookie-parser");

const indexRouter = require("./routes/index");

const port = 3000;

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

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
