
const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
require('./middlewares/passport');

const router = require('./router');


const server = http.createServer(app);

const connectDB = require("./config/db");

//Connect DB
connectDB();

// Init middleware
app.use(express.json());
//CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  next();
})
app.use(passport.initialize());
//Define routes
app.use("/users", require("./routes/index"));


app.use(cors());
app.use(router);

// Connect socket.io
const socketio = require('socket.io');
const options = { /* ... */ };
const io = socketio(server, options);
const { addUser, removeUser, getUser, getOnlineUsers } = require('./activeUsers');

io.on('connection', socket => {
  console.log(`[${socket.id}] Socket.io is connected`);

  // test
  io.emit('getOnlineUsers', { users: getOnlineUsers() });

  socket.on("join", ({ userId, name }) => {
    if (!userId) {
      userId = 'defaultId';
    }

    const { error, user } = addUser({ id: socket.id, userId, name });

    if (error) {
      console.log(error);
      return;
    }

    io.emit('getOnlineUsers', { users: getOnlineUsers() });

    console.log(`${user.name} has joined!`);
  });

  socket.on('disconnect', () => {
    console.log('Disconnect to Socket.io')
    const user = removeUser(socket.id);

    if (user) {
      io.emit('getOnlineUsers', { users: getOnlineUsers() });
    }
  })
});


server.listen(process.env.PORT || 5000, () => console.log(`Server has started. `));

