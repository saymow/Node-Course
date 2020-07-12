import fs from "fs";
import chalk from "chalk";

export interface NoteInterface {
  title: string;
  body: string;
  status: string;
}

const readNote = (title: string) => {
  const notes = loadData();

  const currentNote = notes.find((note: NoteInterface) => note.title === title);

  if (!currentNote)
    return console.log(
      chalk.red.bgWhite.inverse("There is no note using this title.")
    );

  console.log(`Title ${chalk.white.inverse(currentNote.title)}`);
  console.log(`Title ${chalk.bold(currentNote.status)}`);
  console.log(`Body: ${currentNote.body}`);
};

const listNotes = () => {
  const notes = loadData();

  console.log(`\n ${chalk.white.inverse("Notes:")} \n`);

  notes.forEach((note) => {
    console.log(`${chalk.white.inverse("Title:")}  ${note.title}`);
    console.log(`${chalk.white.inverse("Status:")}  ${note.status}`);
    console.log(`${chalk.white.inverse("Body:")}  ${note.body}\n`);
  });
};

const addNote = ({ title, body }: NoteInterface) => {
  const notes = loadData();
  const titleAlreadyInUse = notes.some((note) => note.title === title);

  if (titleAlreadyInUse)
    return console.log(chalk.bgWhite.red.inverse.bold("Title already in use."));

  notes.push({
    title,
    body,
    status: "To-do",
  });

  saveData(notes);
  console.log(chalk.bold.green.inverse(`Note ${title} was added!`));
};

const removeNote = (title: string) => {
  const notes = loadData();

  const newNotes = notes.filter((note: NoteInterface) => note.title !== title);

  if (newNotes.length === notes.length)
    return console.log(chalk.bgRed.white("There is no note with this title."));

  saveData(newNotes);
  console.log(chalk.bold.green.inverse.bold(`Note ${title} was deleted!`));
};

const modifyNote = (title: string, status: string) => {
  const notes = loadData();

  const note = notes.find((item) => item.title === title);

  if (!note)
    return console.log(chalk.bgRed.white("There is not note with this title."));

  const newNote = {
    ...note,
    status,
  };

  const newNotes = notes.map((item) => (item.title === title ? newNote : item));

  console.log(chalk.bold.green.inverse.bold(`Note ${title} was modified!`));

  saveData(newNotes);
};

const loadData = (): NoteInterface[] => {
  try {
    const Buffer = fs.readFileSync("data.json");
    const JSONdata = Buffer.toString();
    const data = JSON.parse(JSONdata);

    return data;
  } catch (err) {
    return [];
  }
};

const saveData = (notes: NoteInterface[]) => {
  const JSONdata = JSON.stringify(notes);
  fs.writeFileSync("data.json", JSONdata);
};

export { addNote, removeNote, listNotes, readNote, modifyNote };
