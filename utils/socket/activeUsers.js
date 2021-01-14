const { groupByKey, groupBy } = require("../list");
const { addRoom, getRooms, removeRoom, getRoomById } = require('./rooms');

const users = [];

const addUser = ({ id, name }) => {
  // Check exist
  const exitingUser = getUserByName(name);
  if (exitingUser) return { error: `User ${name} is exist` };

  const user = { id, name: name, status: null, room: null };

  users.push(user);

  return { user };
};

const removeUser = ({ id, name }) => {
  let index;
  if (id) {
    index = users.findIndex((user) => user.id === id);
  } else if (name) {
    index = users.findIndex((user) => user.name === name);
  } else return;

  if (index === -1) return { error: "This room is not exist." };

  if (index !== -1) {
    console.log(`User [${id}] has removed.`);
    return users.splice(index, 1)[0];
  }
};

const getUsers = () => {
  return users;
};

const getUserByName = (name) => users.find((user) => user.name === name);

const getUserById = (id) => users.find((user) => user.id === id);

const setUserInRoom = ({ id, room }) => {
  try {
    const user = getUserById(id);

    if (!room) return { error: "RoomId is required." };
    if (!id) return { error: "UserId is required." };

    if (user) {
      user.room = room;
    }

    // Calculate role
    const exitingRoom = getRoomById(room);
    if (exitingRoom) {
      if (exitingRoom.player2 === null && user.id !== exitingRoom.host.id) {
        exitingRoom.player2 = user;
        exitingRoom.status = "playing"
      } else {
        exitingRoom.guests.push(user);
      }
    }

    if (user && exitingRoom) return { user, room: exitingRoom };
  } catch (error) {
    return { error };
  }

  return { error: "User is not exist." };
};

module.exports = { addUser, getUsers, removeUser, getUserById, setUserInRoom };