import path from "path";
import http from "http";
import express from "express";
import socketio from "socket.io";
import filter from "bad-words";

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const textFilter = new filter();

const port = process.env.PORT || 3000;

import { generateMessage, generateLocationMessage } from "./utils/messages";
import { addUser, removeUser, getUser, getUsersInRoom } from "./utils/user";

app.use(express.static(path.join(__dirname, "..", "public")));

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, cb) => {
    const status = addUser({
      id: socket.id,
      room,
      username,
    });

    if ("error" in status) return cb(status.error);

    const { room: serializedRoom, username: serializedUsername } = status;

    socket.join(serializedRoom);

    socket.emit("message", generateMessage("Admin", "Welcome"));
    socket.broadcast
      .to(serializedRoom)
      .emit(
        "message",
        generateMessage("Admin", `${serializedUsername} has joined.`)
      );
    io.to(room).emit("roomData", {
      room,
      users: getUsersInRoom(room),
    });

    cb();
  });

  socket.on("sendMessage", (message, cb) => {
    const user = getUser(socket.id);

    if (textFilter.isProfane(message)) return cb("Please be poilite.");

    io.to(user?.room as string).emit(
      "message",
      generateMessage(user?.username as string, message)
    );
    cb();
  });

  socket.on("sendLocation", ({ latitude, longitude }, cb) => {
    const user = getUser(socket.id);

    io.to(user?.room as string).emit(
      "locationMessage",
      generateLocationMessage(
        user?.username as string,
        `https://google.com/maps?q=${latitude},${longitude}`
      )
    );
    cb();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left.`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(port, () => console.log("Server is up on port:", port));
