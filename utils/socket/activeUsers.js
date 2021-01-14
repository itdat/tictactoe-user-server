const { groupByKey, groupBy } = require("../list");
const { addRoom, getRooms, removeRoom, getRoomById } = require('./rooms');

const users = [];

const addUser = ({ id, name }) => {
  if (!name || name === "") return { error: "[Socket] Username is required." };

  // Check exist
  const exitingUser = getUserById(id);

  if (exitingUser) return { error: `[Socket] User ${name} is exist.` };

  const user = { id, name, room: null, role: null };

  users.push(user);

  return { user };
};

const removeUser = ({ id, name }) => {
  let index = id
    ? users.findIndex((user) => user.id === id)
    : users.findIndex((user) => user.name === name);

  if (!id && !name) return { error: "[Socket] Username or id is required." }

  if (index === -1) return { error: "[Socket] This room is not exist." };

  if (index !== -1) {
    console.log(`User [${name || id}] has removed.`);
    return users.splice(index, 1)[0];
  }
};

const getUsers = () => users;

const getUserByName = (name) => users.find((user) => user.name === name);

const getUserById = (id) => users.find((user) => user.id === id);

const setUserInRoom = ({ id, roomId }) => {
  if (!roomId) return { error: "[Socket] RoomId is required." };
  if (!id) return { error: "[Socket] UserId is required." };

  const user = getUserById(id);

  if (user) {
    // Update roomId value for user data
    user.room = roomId;

    // Calculate role
    const room = getRoomById(roomId);

    if (room && room.host) {
      if (user.name === room.host.name) {
        // Update userId values for room data
        room.host.id = user.id;
        // Update role value for user data
        user.role = "host";
      } else if (room.player2 && user.name === room.player2.name) {
        room.player2.id = user.id;
        user.role = "player2";
      } else if (room.player2 === null && user.name !== room.host.name) {
        room.host.id = user.id;
        user.role = "player2"
        // Update player2 value for room data
        room.player2 = user;
        // "waiting" to "playing"
        room.status = "playing";
      } else if (user.name !== room.host.name && user.name !== room.player2.name) {
        room.host.id = user.id;
        user.role = "guest";
        room.guests.push(user);
      }

      console.log("[SetUserInRoom]", user);
      return { user, room };
    }
  }

  return { error: "[Socket] User is not exist." };
};

module.exports = { addUser, getUsers, removeUser, getUserById, setUserInRoom };