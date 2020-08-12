import { Model, Document } from "mongoose";
import mongoose from "../db/mongoose";

const TaskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

interface ITask extends Document {
  description: string;
  completed: boolean;
}

interface ITaskModel extends Model<ITask> {}

const Task: ITaskModel = mongoose.model(
  "tasks",
  TaskSchema
);

export default Task;
