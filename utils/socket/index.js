const { addUser, getUsers, removeUser } = require('./activeUsers');

const initSocket = ({ io }) => {
  // Once someone have accessed client, they also are connected to the Socket.IO server
  io.on('connection', socket => {
    // Log
    console.log(`[${socket.id}] Client has connected to Socket.IO.`);

    // Send online list to all connected clients
    io.emit('getOnlineUsers', { users: getUsers() });

    socket.on("setOnlineStatus", ({ name }, callback) => {
      const { error, user } = addUser({ id: socket.id, name });
      // if (error) return callback(error);
      // console.log(error);
      if (error) return;

      io.emit('getOnlineUsers', { users: getUsers() });

      console.log(`User ${name} has online.`);
    });

    socket.on("removeOnlineStatus", ({ name }) => {
      removeUser({ name: name });

      io.emit('getOnlineUsers', { users: getUsers() });

      console.log(`User ${name} has offline.`);
    });

    // Client is disconnected
    socket.on('disconnect', () => {
      removeUser({ id: socket.id });

      io.emit('getOnlineUsers', { users: getUsers() });

      console.log("[${socket.id}] Client has disconnected to Socket.IO.")
    });

    // Reload data because Sidebar cause error if online list component located in different pages
    socket.on('reloadOnlineUsers', () => {
      io.emit('getOnlineUsers', { users: getUsers() });
    });
  });
}

module.exports = { initSocket };
