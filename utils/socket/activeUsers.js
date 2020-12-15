const guests = [];

const addGuest = ({ id }) => {
  const guest = { id, name: null, status: null, room: null, roomLevel: null };

  guests.push(guest);

  console.log(`Client [${id}] has been added as a guest.`);
  return { guest };
}

const setActiveUser = ({ id, name, status }) => {
  const user = getGuestById(id);

  if (!name) return { error: 'Username is required.' };
  if (!status) return { error: 'Status is required.' };

  // Truong hop user nay da dang nhap dau do
  const existingUser = getUserByName(name)
  if (existingUser) return { error: 'This user is taken.' };

  // Truong hop user nay dang nhap lai voi tai khoan khac, hoac dang hap lai tai khoan hien tai
  // khong quan tam nua boi vi sau day da cap nhat lai username tren socket id nay

  if (user) {
    user.name = name;
    user.status = status;

    return { user }
  }

  return { error: 'Unknown error occurred.' }
}

const setRoom = ({ id, name, room, roomLevel }) => {
  const guest = getGuestById(id);

  if (!room) return { error: 'Room is required.' };
  if (!roomLevel) return { error: 'Room Level is required.' };

  if (guest) {
    guest.room = room;
    guest.roomLevel = roomLevel;
    return { guest };
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

// TODO: Create file Enums.js later
const getOnlineUsers = () => guests.filter((guest) => guest.status === 1);

module.exports = { addGuest, setActiveUser, setRoom, removeGuest, getGuestById, getOnlineUsers };