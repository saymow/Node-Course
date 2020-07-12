"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyNote = exports.readNote = exports.listNotes = exports.removeNote = exports.addNote = void 0;
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var readNote = function (title) {
    var notes = loadData();
    var currentNote = notes.find(function (note) { return note.title === title; });
    if (!currentNote)
        return console.log(chalk_1.default.red.bgWhite.inverse("There is no note using this title."));
    console.log("Title " + chalk_1.default.white.inverse(currentNote.title));
    console.log("Title " + chalk_1.default.bold(currentNote.status));
    console.log("Body: " + currentNote.body);
};
exports.readNote = readNote;
var listNotes = function () {
    var notes = loadData();
    console.log("\n " + chalk_1.default.white.inverse("Notes:") + " \n");
    notes.forEach(function (note) {
        console.log(chalk_1.default.white.inverse("Title:") + "  " + note.title);
        console.log(chalk_1.default.white.inverse("Status:") + "  " + note.status);
        console.log(chalk_1.default.white.inverse("Body:") + "  " + note.body + "\n");
    });
};
exports.listNotes = listNotes;
var addNote = function (_a) {
    var title = _a.title, body = _a.body;
    var notes = loadData();
    var titleAlreadyInUse = notes.some(function (note) { return note.title === title; });
    if (titleAlreadyInUse)
        return console.log(chalk_1.default.bgWhite.red.inverse.bold("Title already in use."));
    notes.push({
        title: title,
        body: body,
        status: "To-do",
    });
    saveData(notes);
    console.log(chalk_1.default.bold.green.inverse("Note " + title + " was added!"));
};
exports.addNote = addNote;
var removeNote = function (title) {
    var notes = loadData();
    var newNotes = notes.filter(function (note) { return note.title !== title; });
    if (newNotes.length === notes.length)
        return console.log(chalk_1.default.bgRed.white("There is no note with this title."));
    saveData(newNotes);
    console.log(chalk_1.default.bold.green.inverse.bold("Note " + title + " was deleted!"));
};
exports.removeNote = removeNote;
var modifyNote = function (title, status) {
    var notes = loadData();
    var note = notes.find(function (item) { return item.title === title; });
    if (!note)
        return console.log(chalk_1.default.bgRed.white("There is not note with this title."));
    var newNote = __assign(__assign({}, note), { status: status });
    var newNotes = notes.map(function (item) { return (item.title === title ? newNote : item); });
    console.log(chalk_1.default.bold.green.inverse.bold("Note " + title + " was modified!"));
    saveData(newNotes);
};
exports.modifyNote = modifyNote;
var loadData = function () {
    try {
        var Buffer_1 = fs_1.default.readFileSync("data.json");
        var JSONdata = Buffer_1.toString();
        var data = JSON.parse(JSONdata);
        return data;
    }
    catch (err) {
        return [];
    }
};
var saveData = function (notes) {
    var JSONdata = JSON.stringify(notes);
    fs_1.default.writeFileSync("data.json", JSONdata);
};
