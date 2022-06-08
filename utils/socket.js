import { Server } from "socket.io";
const io = new Server();

import { nanoid } from "nanoid";
const allRooms = [];
let allUsers = [];

const addUser = (newUserId) => {
  if (allUsers.indexOf(newUserId) !== -1) return allUsers;
  allUsers = [...allUsers, newUserId];
};

const removeUser = (userId) => {
  allUsers = allUsers.filter((user) => user !== userId);
};

const addUserToRoom = (socket, roomDetails) => {
  const { roomId, password } = roomDetails;
  const room = allRooms.find((room) => room.name === roomId);
  if (!room) {
    return false;
  }
  if (room.password !== password) {
    return false;
  }
  room.users.push(socket.id);
  socket.join(roomId);
  return room;
};

const removeUserFromRoom = (socket) => {
  allRooms = allRooms.map((room) => {
    room.users = room.users.filter((user) => user !== socket.id);
    return room;
  });
};

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);
  addUser(socket.id);
  // socket to create room
  socket.on("createRoom", (data) => {
    console.log("creating");
    const roomId = nanoid();
    const room = {
      id: roomId,
      name: data.name,
      password: data.password,
      owner: socket.id,
      users: [socket.id],
    };
    allRooms.push(room);
    socket.join(roomId);
    console.log(`room created ${roomId}`, allRooms);
    socket.emit("roomCreated", room);
  });

  // socket to join room with password
  socket.on("joinRoom", (data) => {
    const room = addUserToRoom(socket, data);
    console.log(allRooms);
    if (!room) {
      socket.emit("roomNotFound");
      return;
    }
    console.log("Joining....");
    socket.emit("joinedRoom", { room });
  });

  socket.on("locationUpdate", (data) => {
    socket.to(data.roomId).emit("locationUpdate", { ...data, user: socket.id });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    removeUserFromRoom(socket);
    console.log(`a user disconnected ${socket.id}`);
  });
});

export default io;
