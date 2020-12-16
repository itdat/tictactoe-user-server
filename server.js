const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const passport = require("passport");
require("./middlewares/passport");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./socket/users");
const connectDB = require("./config/db");

// Init server
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

//Connect DB
connectDB();

// Init middleware
app.use(express.json());
app.use(passport.initialize());

//Define routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/rooms", require("./routes/rooms"));

// Handle socket
io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

// Listen
server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
