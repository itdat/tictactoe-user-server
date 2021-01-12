const { groupByKey, groupBy } = require("../list");

rooms = [];

const getRooms = () => rooms; 

const addRoom = ({ id, name, level, players = [], guests = [], boardHistory = [] }) => {
  // Id is unique because it is mapped with socket id of room creator
  // Check exist
  const exitingRoom = getRoomById(id);
  if (exitingRoom) return { error: `Room ${name} is exist` };

  const room = { id, name, level, players: players, guests: guests, boardHistory: boardHistory};

  rooms.push(room);

  console.log(`Room ${name} is created.`)

  return { room };
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

module.exports = { getRooms, addRoom, removeRoom };
