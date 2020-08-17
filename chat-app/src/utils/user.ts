const users: IUser[] = [];

interface IUser {
  id: string;
  username: string;
  room: string;
}

interface Error {
  error: string;
}

const addUser = ({ id, username, room }: IUser): IUser | Error => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room)
    return {
      error: "Username and room are required",
    };

  const userExists = users.some(
    (user) => user.username === username && user.room === room
  );

  if (userExists)
    return {
      error: "Username already taken.",
    };

  const user = { id, username, room };

  users.push(user);

  return user;
};

const removeUser = (id: string) => {
  const index = users.findIndex((user) => (user.id = id));

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id: string) => users.find((user) => user.id === id);

const getUsersInRoom = (room: string) =>
  users.filter((user) => user.room === room);

export { addUser, removeUser, getUser, getUsersInRoom };
