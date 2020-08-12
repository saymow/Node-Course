import { Document } from "mongoose";
import { Request, Response } from "express";

import Task from "../models/task";

interface UpdateTaskPros extends Document {
  description?: string;
  completed?: boolean;
}

type validUpdateProp = "description" | "completed";

export default {
  async store(req: Request, res: Response) {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    try {
      await task.save();
      res.status(201).send(task);
    } catch (error) {
      res.status(400).send();
    }
  },

  async update(req: Request, res: Response) {
    const updates = Object.keys(req.body);
    const validUpdates = ["description", "completed"];
    const isInvalid = updates.some((key) => !validUpdates.includes(key));

    if (isInvalid) return res.status(400).send({ error: "invalid updates!" });

    try {
      const _id = req.params.id;

      const task: UpdateTaskPros | null = await Task.findOne({
        _id,
        owner: req.user._id,
      });

      if (!task) return res.status(404).send();

      updates.forEach((key) => {
        task[key as validUpdateProp] = req.body[key];
      });

      task.save();

      // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      //   new: true,
      //   runValidators: true,
      // });

      if (!task) return res.status(404).send();

      res.send(task);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const _id = req.params.id;

      const task = await Task.findOneAndDelete({ _id, owner: req.user._id });

      if (!task) return res.status(404).send();

      res.send(task);
    } catch (err) {
      res.status(500).send();
    }
  },
  // GET /tasks?completed=true
  // GET /tasks?limit=10&skip=1
  // GET /tasks?sortBy=createdAt_ASC//DESC
  // ASC = 1 // DESC = -1
  async list(req: Request, res: Response) {
    const match: {
      completed?: Boolean;
    } = {};
    const sort = {} as any;
    const { limit, skip } = req.query;

    if (req.query.completed)
      match["completed"] = req.query.completed === "true";

    if (req.query.sortBy) {
      const value = req.query.sortBy as string;

      let [prop, method] = value.split("_");

      sort[prop] = method === "DESC" ? -1 : 1;
    }

    try {
      // const tasks = await Task.find({ owner: req.user._id });
      await req.user
        .populate({
          path: "tasks",
          match,
          options: {
            skip: Number(limit) * Number(skip),
            limit: Number(limit),
            sort,
          },
        })
        .execPopulate();

      res.send(req.user.tasks);
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  },

  async index(req: Request, res: Response) {
    const _id = req.params.id;

    try {
      const task = await Task.findOne({ _id, owner: req.user._id });
      if (!task) return res.status(404).send();
      res.send(task);
    } catch (error) {
      res.status(500).send();
    }
  },
};
