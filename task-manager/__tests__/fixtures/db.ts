import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../../src/models/user";
import Task from "../../src/models/task";

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Testing",
  email: "example@example.com",
  password: "12whatP21",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET as string),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoId,
  name: "Exampling",
  email: "test@example.com",
  password: "d645Dccc",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET as string),
    },
  ],
};

const TaskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "description one",
  owner: userOne._id,
};

const TaskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "description two",
  completed: true,
  owner: userOne._id,
};

const TaskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "description three",
  owner: userTwo._id,
};

async function setUpEnvironment() {
  await User.deleteMany({});
  await Task.deleteMany({});
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(TaskOne).save();
  await new Task(TaskTwo).save();
  await new Task(TaskThree).save();
}

export {
  setUpEnvironment,
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  TaskOne,
  TaskTwo,
  TaskThree,
};
