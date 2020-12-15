const { addGuest, setActiveUser, setRoom, removeGuest, getGuestById, getOnlineUsers } = require('./activeUsers');


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


    // Set online or offline
    socket.on("setStatus", ({ name, status }, callback) => {
      const { error, user } = setActiveUser({ id: socket.id, name, status });

      if (error) return callback(error);

      io.emit('getOnlineUsers', { users: getOnlineUsers() });

      console.log(`User ${name} is updated online status.`);
      callback();
    });


    // Set game room 
    socket.on("joinRoom", ({ name, room, roomLevel }) => {
      const { error, guest } = setRoom({ id: socket.id, name, room, roomLevel });

      if (error) return callback(error);

      console.log(`Client ${guest.name} has joined the room named [${room}].`);
      callback();
    });


    // Remove game room 
    socket.on("leaveRoom", ({ name }) => {
      const { error, guest } = setRoom({ id: socket.id, name, room: null, roomLevel: null });

      if (error) return callback(error);

      console.log(`Client ${user.name} has left the room named [${room}].`);
      callback();
    });
    

    // Client is disconnected
    socket.on('disconnect', () => {
      const guest = removeGuest(socket.id);
      io.emit('getOnlineUsers', { users: getOnlineUsers() });
    })
  });
}

module.exports = { initSocket };
