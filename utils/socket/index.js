const { addUser, getUsers, removeUser, getUserById, setUserInRoom } = require('./activeUsers');
const { addRoom, getRooms, removeRoom, getRoomById, getQuickRooms } = require('./rooms');

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
      const host = getUserById(socket.id);
      // Add a room to room list if this room is not available
      addRoom({ id: socket.id, room: roomId, name: roomName, level: roomLevel, host });

      const {user, room, error} = setUserInRoom({ id: socket.id, room: roomId });

      // Join room by socket
      socket.join(roomId);

      if (error) return;

      // Send message to chat box
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${roomName}.` });
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

      // Broadcast to all user about room info
      io.emit('getRooms', { rooms: getRooms() });

      console.log(`[${socket.id}] Client has joined room [${roomName}].`);

      callback(user, room);
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

    // When someone send match info
    socket.on('sendMatchInfo', (params, callback) => {
      const user = getUserById(socket.id);
      // 
      const room = getRoomById(user.room);

      socket.broadcast.to(user.room).emit('matchInfo', { user: `${user.name}`, data: params });

      callback();
    });

    socket.on('requestQuickGame', () => {
      // all rooms -> find rooms with status = "quickly"
      // if exist -> join first item
      // else -> create a room with status = "quickly"
      // notes: this room is hide in room list screen
      const items = getQuickRooms();
      let quickRoom;

      if (items.length > 0) {
        quickRoom = items[0];
      } else {
        const host = getUserById(socket.id);
        // Add a room to room list if this room is not available
        const res = addRoom({ id: socket.id, room: socket.id, name: socket.id, level: 3, host, status: "quickly" });
        quickRoom = res.room;
      }

      socket.emit('quickRoom', {room: quickRoom});
    });
  });

  // Remove game room 
}

module.exports = { initSocket };
