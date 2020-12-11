const users = [];

const addUser = ({ id, userId, name }) => {
  if (!name || !userId) return { error: 'Username or userId are required.' };

  // name = name.trim().toLowerCase();
  // userId = userId.trim().toLowerCase();

  let existingUser = users.find((user) => /* user.userId === userId &&  */user.name === name);

  if (existingUser) {
    console.log(`..Online User named ${name} is existed`);
    // Update socketId
    existingUser.id = id;
    return { user: existingUser };
  }

  const user = { id, userId, name };

  users.push(user);

  console.log(`..Online User named ${name} is added`);
  
  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getOnlineUsers = () => users;

module.exports = { addUser, removeUser, getUser, getOnlineUsers };