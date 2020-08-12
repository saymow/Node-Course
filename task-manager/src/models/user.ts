import { Document, Model } from "mongoose";
import mongoose from "../db/mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Task from "./task";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate: [
        (value) => {
          let invalidPasswords = ["password"];
          return !invalidPasswords.includes(value.toLowerCase());
        },
        "Invalid {PATH}.",
      ],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate: [
        (value) => {
          if (!validator.isEmail(value)) {
            return false;
          }
          return true;
        },
        "Invalid {PATH}.",
      ],
    },
    age: {
      type: Number,
      default: 0,
      validate: [
        (value: number) => {
          return value < 0 ? false : true;
        },
        "{PATH} is less than 0.",
      ],
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.virtual("tasks", {
  ref: "tasks",
  localField: "_id",
  foreignField: "owner",
});

export interface iUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  tasks: Array<Object>;
  tokens: {
    token: string;
  }[];
  avatar?: Buffer;
  generateAuthToken(): Promise<string>;
  toJSON(): Object;
}

interface IUserModel extends Model<iUser> {
  findByCredentials(email: string, password: string): Promise<iUser>;
}

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET as string);

  user.tokens = [...user.tokens, { token }];
  await user.save();
  return token;
};

//This function is called whenever its object is passed to JSON.stringify() by default, since to pass an object
// as response in a HTTP request we need to stringify it, the function runs to hide some data.
// * Express do stringify our object under the hood.
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

UserSchema.statics.findByCredentials = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Unable to login.");

  const isMatch = await bcrypt.compare(password, user.password as string);

  if (!isMatch) throw new Error("Unable to login.");

  return user;
};

UserSchema.pre<iUser>("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

UserSchema.pre("remove", async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next();
});

const User: IUserModel = mongoose.model<iUser, IUserModel>("User", UserSchema);

export default User;
