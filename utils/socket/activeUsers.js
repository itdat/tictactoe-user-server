const guests = [];

const addGuest = ({ id }) => {
  const guest = { id, name: null, status: null, room: null, roomLevel: null };

  guests.push(guest);

  console.log(`Client [${id}] has added as a guest.`);
  return { guest };
}

const setActiveUser = ({ id, name, status }) => {
  const user = getGuestById(id);

  if (!name) return { error: 'Username is required.' };
  if (!status) return { error: 'Status is required.' };

  // Truong hop user nay da dang nhap dau do
  const existingUser = getUserByName(name)
  if (existingUser) return { error: 'This user is taken.' };

  // Truong hop user nay dang nhap lai voi tai khoan khac, hoac tai khoan hien tai
  // => da cap nhat lai tren socket id nay

  if (user) {
    user.name = name;
    user.status = status;

    return { user }
  }

  return { error: 'Unknown error occurred.' }
}

const setRoom = ({ id, name, room, roomLevel }) => {
  const user = getGuestById(id);

  if (!name) return { error: 'Username is required.' };
  // if (!room) return { error: 'Room is required.' };
  // if (!roomLevel) return { error: 'Room Level is required.' };

  if (user) {
    user.room = room;
    user.roomLevel = roomLevel;

    return { user }
  }

  return { error: 'Unknown error occurred.' }
}

const removeGuest = (id) => {
  const index = guests.findIndex((guest) => guest.id === id);

  if (index !== -1) {
    console.log(`Client [${id}] has removed.`)
    return guests.splice(index, 1)[0];
  }
}

const getGuestById = (id) => guests.find((guest) => guest.id === id);

const getUserByName = (name) => guests.find((guest) => guest.name === name);

// TODO: Create Enums
const getOnlineUsers = () => guests.filter((guest) => guest.status === 1);

module.exports = { addGuest, setActiveUser, setRoom, removeGuest, getGuestById, getOnlineUsers };