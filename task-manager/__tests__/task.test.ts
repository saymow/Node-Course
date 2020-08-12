import request from "supertest";
import app from "../src/app";
import Task from "../src/models/task";

import {
  setUpEnvironment,
  userOne,
  userOneId,
  TaskOne,
  TaskTwo,
  userTwo,
} from "./fixtures/db";
import { response } from "express";

beforeEach(setUpEnvironment);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Task description",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);

  expect(task).not.toBeNull();
  if (task) expect(task.completed).toBe(false);
});

test("Should not create task with invalid description", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      what12: "testing",
    })
    .expect(400);
});

test("Should update user's task", async () => {
  await request(app)
    .patch(`/tasks/${TaskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "This is new description",
      completed: true,
    });

  const task = await Task.findById(TaskOne._id);

  expect(task).toMatchObject({
    description: "This is new description",
    completed: true,
  });
});

test("Should not update someeone's else task", async () => {
  await request(app)
    .patch(`/tasks/${TaskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: "This is new description",
      completed: true,
    })
    .expect(404);

  const task = await Task.findById(TaskOne._id);

  expect(task).not.toMatchObject({
    description: "This is new description",
    completed: true,
  });
});

test("Should get only tasks created by specific user", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("Should fecth user task by id", async () => {
  const response = await request(app)
    .get(`/tasks/${TaskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body).toMatchObject({
    description: "description one",
    completed: false,
  });
});

test("Should not fetch user task by id when not authenticated", async () => {
  const response = await request(app)
    .get(`/tasks/${TaskOne._id}`)
    .send()
    .expect(401);

  expect(response.body).not.toMatchObject({
    description: "description one",
    completed: false,
  });
});

test("Should not get someone's else task by id", async () => {
  const response = await request(app)
    .get(`/task/${TaskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  expect(response.body).toEqual({});
});

test("Should fecth only completed tasks", async () => {
  const response = await request(app)
    .get("/tasks?completed=true")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send();
  
  response.body.map((task: typeof TaskTwo) => {
    expect(task.completed).toBe(true);
  });
});

test("Should fecth only noncompleted tasks", async () => {
  const response = await request(app)
    .get("/tasks?completed=false")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send();
  
  response.body.map((task: typeof TaskTwo) => {
    expect(task.completed).toBe(false);
  });
});

test("Should not delete another user tasks", async () => {
  await request(app)
    .delete(`/tasks/${TaskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(TaskOne._id);
  expect(task).not.toBeNull();
});
