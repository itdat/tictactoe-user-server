const { groupByKey, groupBy } = require("../list");

const users = [];

const addUser = ({ id, name }) => {
  // Check exist
  const exitingUser = getUserByName(name);
  if (exitingUser) return {error: `User ${name} is exist`};

  const user = { id, name: name, status: null, room: null};

  users.push(user);

  return { user };
};

const removeUser = ({id, name}) => {
  let index;
  if (id) {
    index = users.findIndex((user) => user.id === id);
  } else if (name) {
    index = users.findIndex((user) => user.name === name);
  } else return;

  if (index === -1) return { error: "This room is not exist."};

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
  const user = getUserById(id);

  if (!room) return { error: "RoomId is required." };
  if (!id) return { error: "UserId is required." };

  if (user) {
    user.room = room;
    return { user };
  }

  return {error: "User is not exist."};
};

module.exports = {addUser, getUsers, removeUser, getUserById, setUserInRoom};