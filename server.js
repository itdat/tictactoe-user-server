
const http = require('http');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./middlewares/passport');

const router = require('./router');

const app = express();
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
const { initSocket } = require('./utils/socket');

initSocket({ io });

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));

