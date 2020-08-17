"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var socket_io_1 = __importDefault(require("socket.io"));
var bad_words_1 = __importDefault(require("bad-words"));
var app = express_1.default();
var server = http_1.default.createServer(app);
var io = socket_io_1.default(server);
var textFilter = new bad_words_1.default();
var port = process.env.PORT || 3000;
var messages_1 = require("./utils/messages");
var user_1 = require("./utils/user");
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
io.on("connection", function (socket) {
    socket.on("join", function (_a, cb) {
        var username = _a.username, room = _a.room;
        var status = user_1.addUser({
            id: socket.id,
            room: room,
            username: username,
        });
        if ("error" in status)
            return cb(status.error);
        var serializedRoom = status.room, serializedUsername = status.username;
        socket.join(serializedRoom);
        socket.emit("message", messages_1.generateMessage("Admin", "Welcome"));
        socket.broadcast
            .to(serializedRoom)
            .emit("message", messages_1.generateMessage("Admin", serializedUsername + " has joined."));
        io.to(room).emit("roomData", {
            room: room,
            users: user_1.getUsersInRoom(room),
        });
        cb();
    });
    socket.on("sendMessage", function (message, cb) {
        var user = user_1.getUser(socket.id);
        if (textFilter.isProfane(message))
            return cb("Please be poilite.");
        io.to(user === null || user === void 0 ? void 0 : user.room).emit("message", messages_1.generateMessage(user === null || user === void 0 ? void 0 : user.username, message));
        cb();
    });
    socket.on("sendLocation", function (_a, cb) {
        var latitude = _a.latitude, longitude = _a.longitude;
        var user = user_1.getUser(socket.id);
        io.to(user === null || user === void 0 ? void 0 : user.room).emit("locationMessage", messages_1.generateLocationMessage(user === null || user === void 0 ? void 0 : user.username, "https://google.com/maps?q=" + latitude + "," + longitude));
        cb();
    });
    socket.on("disconnect", function () {
        var user = user_1.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("message", messages_1.generateMessage("Admin", user.username + " has left."));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: user_1.getUsersInRoom(user.room),
            });
        }
    });
});
server.listen(port, function () { return console.log("Server is up on port:", port); });
