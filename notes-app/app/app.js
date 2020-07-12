"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var chalk_1 = __importDefault(require("chalk"));
var notes_1 = require("./notes");
yargs_1.default.command({
    command: "add",
    describe: "Add a note",
    builder: {
        title: {
            demandOption: true,
            describe: "Note title",
            type: "string",
        },
        body: {
            demandOption: true,
            describe: "Note body",
            type: "string",
        },
    },
    handler: function (argv) {
        var title = argv.title, body = argv.body;
        notes_1.addNote({
            title: title,
            body: body,
        });
    },
});
yargs_1.default.command({
    command: "remove",
    describe: "Remove a note",
    builder: {
        title: {
            demandOption: true,
            describe: "Note title to be deleted",
            type: "string",
        },
    },
    handler: function (argv) {
        var title = argv.title;
        notes_1.removeNote(title);
    },
});
yargs_1.default.command({
    command: "list",
    describe: "List all notes",
    handler: function () {
        notes_1.listNotes();
    },
});
yargs_1.default.command({
    command: "read",
    describe: "Read a specific node",
    builder: {
        title: {
            demandOption: true,
            type: "string",
            describe: "The note title to find.",
        },
    },
    handler: function (argv) {
        var title = argv.title;
        notes_1.readNote(title);
    },
});
yargs_1.default.command({
    command: "modifyStatus",
    describe: "Modify a specific note status.",
    builder: {
        title: {
            demandOption: true,
            type: "string",
            describe: "Title of the note to have status modified.",
        },
        status: {
            demandOption: true,
            type: "string",
            describe: "Note new status",
        },
    },
    handler: function (argv) {
        var title = argv.title, status = argv.status;
        var statusAvailable = ["To-do", "In-progress", "Done"];
        if (!statusAvailable.includes(status))
            return console.log(chalk_1.default.bgRed.bold("Status value should be one of: ") +
                statusAvailable.join(", ") +
                ".");
        notes_1.modifyNote(title, status);
    },
});
yargs_1.default.parse();
