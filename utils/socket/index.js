const { addUser, getUsers, removeUser, getUserById, setUserInRoom } = require('./activeUsers');
const { addRoom, getRooms, removeRoom } = require('./rooms');

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
      removeRoom({ id: socket.id });

      io.emit('getOnlineUsers', { users: getUsers() });

      console.log(`User ${name} has offline.`);
    });

    // Client is disconnected
    socket.on('disconnect', () => {
      removeUser({ id: socket.id });
      removeRoom({ id: socket.id });

      io.emit('getOnlineUsers', { users: getUsers() });

      console.log("[${socket.id}] Client has disconnected to Socket.IO.")
    });

    // Reload data because Sidebar cause error if online list component located in different pages
    socket.on('reloadOnlineUsers', () => {
      io.emit('getOnlineUsers', { users: getUsers() });
    });

    // Reload room list
    socket.emit('getRooms', { rooms: getRooms() });

    // Set game room 
    socket.on("joinRoom", ({ roomId, roomName, roomLevel }, callback) => {
      // Add a room to room list if this room is not available
      const { room } = addRoom({ id: roomId, name: roomName, level: roomLevel });

      // Join room by socket
      socket.join(roomId);

      const { user } = setUserInRoom({ id: socket.id, room: roomId });

      // Send message to chat box
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${roomName}.` });
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

      // Broadcast to all user about room info
      io.emit('getRooms', { rooms: getRooms() });

      console.log(`[${socket.id}] Client has joined room [${roomName}].`);
    });

    socket.on('reloadRooms', () => {
      io.emit('getRooms', { rooms: getRooms() });
    });

    // When someone send message
    socket.on('sendMessage', (message, callback) => {
      const user = getUserById(socket.id);

      io.to(user.room).emit('message', { user: `${user.name}`, text: message });

      callback();
    });
  });

  // Remove game room 
}

module.exports = { initSocket };
