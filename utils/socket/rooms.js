const { groupByKey, groupBy } = require("../list");
const { addUser, getUsers, removeUser, getUserById, setUserInRoom } = require('./activeUsers');

rooms = [];

const getRooms = () => rooms; 

const addRoom = ({ id, room, name, level, host, player2, guests = [], status }) => {
  // Id is unique because it is mapped with socket id of room creator
  // Check exist
  const exitingRoom = getRoomById(room);
  if (exitingRoom) return { error: `Room ${name} is exist` };

  const newRoom = { id: room, name, level, host: host, player2: null, guests, status: "waiting"};

  rooms.push(newRoom);

  console.log(`Room ${name} is created.`)

  return { user: host, room: newRoom };
};

const getRoomById = (id) => rooms.find((room) => room.id === id);

const removeRoom = ({ id }) => {
  const index = rooms.findIndex((room) => room.id === id);

  if (index === -1) return { error: "This room is not exist."};

  if (index !== -1) {
    console.log(`Room [${id}] has removed.`);
    return rooms.splice(index, 1)[0];
  }
};

module.exports = { getRooms, addRoom, removeRoom, getRoomById };
