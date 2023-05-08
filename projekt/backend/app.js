const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const { argv } = require("process");

const app = express();

const server = require("http").Server(app);

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST"],
  },
});

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Cloud
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

let tasksArr = [];

const activeUsers = [];

io.on('connection', (socket) => {
  console.log('socket.on back connected')
  // const connectionDate = new Date().toLocaleString(); 
  // console.log(`user ${socket.id} connected at ${connectionDate}`);

  socket.on('userLoggedIn', (user) => {
    console.log(`User ${user.id} with name ${user.name} logged in`);
    activeUsers.push(user);
    console.log(activeUsers);

    io.emit('userJoined', user.name, activeUsers);
  });

  socket.on('userLoggedOut', (userId) => {
    console.log(`User ${userId} logged out`);
    const index = activeUsers.findIndex((user) => user.id === userId);
    if (index !== -1) {
      activeUsers.splice(index, 1);
    }
    console.log(activeUsers)
  });

  socket.on('addTask', (arg) => {
    tasksArr.push(arg);
    io.emit('addTask', tasksArr);
  })

  socket.on('voteTask', (arg) => {
    tasksArr = tasksArr.filter((task) => task !== arg);
    io.emit('voteTask', {'arr': tasksArr, 'task': arg})
  })

  socket.on('finishedTasks', (arg) => {
    io.emit('finishedTasks', arg);
  })

  io.on('disconnected', () => {
    console.log('user ${socket.id} disconnected');
  });
});


module.exports = { app: app, server: server };
