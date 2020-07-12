const fs = require("fs");
const chalk = require("chalk");

const readNote = (title) => {
  const notes = loadData();

  const currentNote = notes.find((note) => note.title === title);

  if (!currentNote)
    return console.log(
      chalk.red.bgWhite.inverse("There is no note using this title.")
    );

  console.log(`Title ${chalk.white.inverse(currentNote.title)}`);
  console.log(`Body: ${currentNote.body}`);
};

const listNotes = () => {
  const notes = getNotes();

  console.log(`\n ${chalk.white.inverse("Notes:")} \n`);

  notes.forEach((note) => {
    console.log(`${chalk.white.inverse("Title:")}  ${note.title}`);
    console.log(`${chalk.white.inverse("Body:")}  ${note.body}\n`);
  });
};

const addNote = ({ title, body }) => {
  const notes = loadData();
  const titleAlreadyInUse = notes.some((note) => note.title === title);

  if (titleAlreadyInUse)
    return console.log(chalk.bgWhite.red.inverse.bold("Title already in use."));

  notes.push({
    title,
    body,
  });

  saveData(notes);
  console.log(chalk.bold.green.inverse(`Note ${title} was added!`));
};

const removeNote = (title) => {
  const notes = loadData();

  const newNotes = notes.filter((note) => note.title !== title);

  if (newNotes.length === notes.length)
    return console.log(chalk.bgRed.white("There is no note with this title."));

  saveData(newNotes);
  console.log(chalk.bold.green.inverse.bold(`Note ${title} was deleted!`));
};

const loadData = () => {
  try {
    const Buffer = fs.readFileSync("data.json");
    const JSONdata = Buffer.toString();
    const data = JSON.parse(JSONdata);

    return data;
  } catch (err) {
    return [];
  }
};

const saveData = (notes) => {
  const JSONdata = JSON.stringify(notes);
  fs.writeFileSync("data.json", JSONdata);
};

module.exports = {
  addNote,
  removeNote,
  listNotes,
  readNote,
};
