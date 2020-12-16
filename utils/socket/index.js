const { addGuest, setActiveUser, setRoom, removeGuest, getGuestById, getOnlineUsers, getRooms } = require('./activeUsers');


const initSocket = ({ io }) => {
  // Once someone have accessed client, they also are connected to the Socket.IO server
  io.on('connection', socket => {

    // Log server
    console.log(`Client [${socket.id}] has connected to Socket.IO.`);

    // Client has added as a guest
    addGuest({ id: socket.id });

    // Send online list to all connected clients
    io.emit('getOnlineUsers', { users: getOnlineUsers() });


    // Reload data because Sidebar cause error if online list component located in different pages
    socket.on('reloadOnlineUsers', () => {
      io.emit('getOnlineUsers', { users: getOnlineUsers() });
    });


    // Reload data
    socket.on('reloadRooms', () => {
      socket.emit('getRooms', { rooms: getRooms() });
    });


    // Set online or offline
    socket.on("setStatus", ({ name, status }, callback) => {
      const { error, user } = setActiveUser({ id: socket.id, name, status });

      if (error) return callback(error);

      io.emit('getOnlineUsers', { users: getOnlineUsers() });

      console.log(`User ${name} is updated online status.`);
      callback();
    });


    // Set game room 
    socket.on("joinRoom", ({ name, room, roomLevel }, callback) => {
      const { error, guest } = setRoom({ id: socket.id, name, room, roomLevel });

      if (error) return callback(error);

      socket.join(guest.room);

      socket.emit('message', { user: 'admin', text: `[${guest.name || socket.id}], welcome to room [${guest.room}].` });
      socket.broadcast.to(guest.room).emit('message', { user: 'admin', text: `[${guest.name || socket.id}] has joined!` });

      io.emit('getRooms', { rooms: getRooms() });

      console.log(`Client [${socket.id}] has joined room [${guest.room}].`);
      callback();
    });


    // When someone send message
    socket.on('sendMessage', (message, callback) => {
      const guest = getGuestById(socket.id);

      if (!guest.room) return "[Dev] Please reload page to get new connect."

      io.to(guest.room).emit('message', { user: `[${guest.name || socket.id}]`, text: message });

      callback();
    });


    // Remove game room 
    socket.on("leaveRoom", ({ name }) => {
      const { error, guest } = setRoom({ id: socket.id, name, room: null, roomLevel: null });

      if (error) return callback(error);

      io.emit('getRooms', { rooms: getRooms() });

      console.log(`Client ${user.name} has left the room named [${room}].`);
      callback();
    });


    // Client is disconnected
    socket.on('disconnect', () => {
      const guest = removeGuest(socket.id);
      io.emit('getOnlineUsers', { users: getOnlineUsers() });

      io.emit('getRooms', { rooms: getRooms() });
    });
  });
}

module.exports = { initSocket };
