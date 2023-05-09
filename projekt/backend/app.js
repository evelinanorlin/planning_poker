const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { argv } = require('process');

const app = express();

const server = require('http').Server(app);

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URI,
    methods: ['GET', 'POST'],
  },
});

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Cloud
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

let tasksArr = [];
let finishedTasks = [];
let currentVotes = [];
let activeUsers = [];

io.on('connection', (socket) => {
  console.log('socket.on back connected')

  socket.on('userLoggedIn', (user) => {
    const userExists = activeUsers.map(inloggedUser => inloggedUser.id).includes(user.id);
    if(userExists) {
      console.log(`User ${user.id} already exists in activeUsers`);
      return; 
    }
    console.log(`User ${user.id} with name ${user.name} logged in`);
    activeUsers.push(user);
    socket.userId = user.id;
    console.log(activeUsers);

    io.emit('userJoined', user.name, activeUsers);
  });

  socket.on('userLoggedOut', (userId) => {
    console.log(`User ${userId} logged out`);
    const index = activeUsers.findIndex((user) => user.id === userId);
    if (index !== -1) {
      activeUsers.splice(index, 1);
      io.emit('activeUsersUpdated', activeUsers);
    }
    console.log(activeUsers);
  });

  socket.on('disconnect', () => {
    const index = activeUsers.findIndex((user) => user.id === socket.userId);
    if (index !== -1) {
      activeUsers.splice(index, 1);
      io.emit('activeUsersUpdated', activeUsers);
    }
    console.log(activeUsers);
  });

  // socket.on('userDisconnected', (userId) => {
  //   console.log(`User ${userId} is diconnected`);
  //   const index = activeUsers.findIndex((user) => user.id === userId);
  //   if (index !== -1) {
  //     activeUsers.splice(index, 1);
  //     io.emit('activeUsersUpdated', activeUsers);
  //   }
  // });

  socket.on('loadSite', (arg) =>{
    io.emit('loadSite', tasksArr, finishedTasks)
  })

  socket.on('addTask', (arg) => {
    tasksArr.push(arg);
    io.emit('addTask', tasksArr);
  });

  socket.on('voteTask', (arg) => {
    tasksArr = tasksArr.filter((task) => task !== arg);
    io.emit('voteTask', { arr: tasksArr, task: arg });
  });

  socket.on('userVoted', (voteNumber, user) => {
    const vote = { userId: user.id, voteNumber };
    const userIndex = currentVotes.findIndex((vote) => vote.userId === user.id);
    activeUsers.find((activeUser) => activeUser.id === user.id).hasVoted = true;

    if (userIndex !== -1) {
      currentVotes[userIndex].voteNumber = voteNumber;
    } else {
      currentVotes.push(vote);
    }

    // if (currentVotes.length === activeUsers.length) {
    //   // EMIT: SPEL ÄR SLUT!!
    // } else {
    // EMIT: Den som ligger under här.
    // }
    console.log(currentVotes);
    io.emit('userVoted', activeUsers);
  });

  socket.on('finishedTasks', (arg) => {
    finishedTasks.push(arg);
    io.emit('finishedTasks', finishedTasks);
  });

  io.on('disconnect', () => {
    const userId = socket.userId;
    console.log('user ${socket.id} disconnected');
    if (userId) {
      io.emit('userLoggedOut', userId);
    }
  });
});

module.exports = { app: app, server: server };
