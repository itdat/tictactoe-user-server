const { addUser, getUsers, removeUser, getUserById, setUserInRoom } = require('./activeUsers');
const { addRoom, getRooms, removeRoom, getRoomById, getQuickRooms } = require('./rooms');

const initSocket = ({ io }) => {
  // Once someone accesses a client, they also are connected to the Socket.IO server
  io.on('connection', socket => {
    // Log to console
    console.log(`[${socket.id}] Client has connected to Socket.IO.`);

    // Send the online list to all connected clients
    io.emit('onlineList', { users: getUsers() });

    socket.on("loadOnlineUser", ({ name }, callback) => {
      try {
        const {user, error} = addUser({ id: socket.id, name });

        io.emit('onlineList', { users: getUsers() });

        console.log(`User ${user.name} has been online.`);
      } catch (error) {
        // console.log(error);
        return callback(error);
      }

      // Above error is not important
      console.log(`User ${name} has been online.`);

      callback();
    });

    // Remove this user from online list (and logout)
    socket.on("removeOnlineUser", ({ name }) => {
      removeUser({ name: name });
      removeRoom({ id: socket.id });

      io.emit('onlineList', { users: getUsers() });

      console.log(`User ${name} has been offline.`);
    });

    // Client is disconnected (refresh or reopen website)
    socket.on('disconnect', () => {
      removeUser({ id: socket.id });
      removeRoom({ id: socket.id });

      io.emit('onlineList', { users: getUsers() });

      console.log(`[${socket.id}] Client has disconnected to Socket.IO.`)
    });

    // Reload data because the sidebar causes error if the online list component is located in different pages
    socket.on('reloadOnlineList', () => {
      io.emit('onlineList', { users: getUsers() });
    });


    /////////////////* **** *////////////////////


    // Reload room list
    socket.emit('roomList', { rooms: getRooms() });

    // Set game room 
    socket.on("joinRoom", ({ name, roomId, roomName, roomLevel }, callback) => {
      // Host
      let host = getUserById(socket.id);
      // Socket id may be changed while refreshing page
      if (!host) {
        const res = addUser({ id: socket.id, name });
        host = res.user;
        // Also need to update player id for room data in the future..
      }

      // Add a room to room list if this room is not available
      addRoom({ id: socket.id, room: roomId, name: roomName, level: roomLevel, host });

      // Update player id for room data
      const { user, room, error } = setUserInRoom({ id: socket.id, roomId });

      if (error) return callback(error);

      // Join room by socket
      socket.join(roomId);

      // Send message to chat box
      socket.emit('message', { user: 'admin', text: `${user.name} (${user.role}), welcome to room ${room.name}.` });
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} (${user.role}) has joined!` });

      // Broadcast to all user about room info
      io.emit('roomList', { rooms: getRooms() });

      socket.broadcast.to(user.room).emit('roomData', { user, room });
      console.log(`[${socket.id}] Client [${user.name}] has joined room [${room.name}] as a ${user.role}.`);

      callback(user, room);
    });

    // Reload room list
    socket.on('reloadRooms', () => {
      io.emit('roomList', { rooms: getRooms() });
    });

    // When someone sends message
    socket.on('sendMessage', (message, callback) => {
      const user = getUserById(socket.id);

      io.to(user.room).emit('message', { user: `${user.name} (${user.role})`, text: message });

      callback();
    });


    /////////////////* **** *////////////////////


    // When someone sends match info
    socket.on('sendMatchInfo', (params, callback) => {
      const user = getUserById(socket.id);

      if (!user) return callback({error: "[Socket] User is undefined."});
      
      const room = getRoomById(user.room);

      socket.broadcast.to(user.room).emit('matchInfo', { user, room, data: params });

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

      socket.emit('quickRoom', { room: quickRoom });
    });
  });

  // Remove game room 
}

module.exports = { initSocket };
