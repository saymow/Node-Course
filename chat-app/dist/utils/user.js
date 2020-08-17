"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
var users = [];
var addUser = function (_a) {
    var id = _a.id, username = _a.username, room = _a.room;
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    if (!username || !room)
        return {
            error: "Username and room are required",
        };
    var userExists = users.some(function (user) { return user.username === username && user.room === room; });
    if (userExists)
        return {
            error: "Username already taken.",
        };
    var user = { id: id, username: username, room: room };
    users.push(user);
    return user;
};
exports.addUser = addUser;
var removeUser = function (id) {
    var index = users.findIndex(function (user) { return (user.id = id); });
    if (index !== -1)
        return users.splice(index, 1)[0];
};
exports.removeUser = removeUser;
var getUser = function (id) { return users.find(function (user) { return user.id === id; }); };
exports.getUser = getUser;
var getUsersInRoom = function (room) {
    return users.filter(function (user) { return user.room === room; });
};
exports.getUsersInRoom = getUsersInRoom;
