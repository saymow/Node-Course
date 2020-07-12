const yargs = require("yargs");

const { addNote, removeNote, listNotes, readNote } = require("./notes");

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
    });
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
    removeNote(title);
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
      describe: "The note title to find."
    }
  },
  handler(argv) {
    const { title } = argv;

    readNote(title);
  },
});

yargs.parse();
