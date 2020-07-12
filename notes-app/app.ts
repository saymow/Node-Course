import yargs from "yargs";
import chalk from "chalk";

import {
  addNote,
  listNotes,
  readNote,
  removeNote,
  modifyNote,
  NoteInterface,
} from "./notes";

yargs.command({
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
  handler(argv) {
    const { title, body } = argv;

    addNote({
      title,
      body,
    } as NoteInterface);
  },
});

yargs.command({
  command: "remove",
  describe: "Remove a note",
  builder: {
    title: {
      demandOption: true,
      describe: "Note title to be deleted",
      type: "string",
    },
  },
  handler(argv) {
    const { title } = argv;
    removeNote(title as string);
  },
});

yargs.command({
  command: "list",
  describe: "List all notes",
  handler() {
    listNotes();
  },
});

yargs.command({
  command: "read",
  describe: "Read a specific node",
  builder: {
    title: {
      demandOption: true,
      type: "string",
      describe: "The note title to find.",
    },
  },
  handler(argv) {
    const { title } = argv;

    readNote(title as string);
  },
});

yargs.command({
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
  handler(argv) {
    const { title, status } = argv;
    let statusAvailable = ["To-do", "In-progress", "Done"];

    if (!statusAvailable.includes(status as string))
      return console.log(
        chalk.bgRed.bold("Status value should be one of: ") +
          statusAvailable.join(", ") +
          "."
      );

    modifyNote(title as string, status as string);
  },
});

yargs.parse();
