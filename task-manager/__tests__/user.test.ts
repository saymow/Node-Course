import request from "supertest";
import app from "../src/app";
import User from "../src/models/user";

import { userOne, userOneId, setUpEnvironment } from "./fixtures/db";

beforeEach(setUpEnvironment);

test("Should signup a user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Gustavo",
      email: "test@test.com",
      password: "Password123",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "Gustavo",
      email: "test@test.com",
    },
    token: user?.tokens[0].token,
  });

  expect(user?.password).not.toBe("Password123");
});

test("Should signup user with valid name/email/password", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Testing",
      password: "AAgooDPAsssq0124",
      email: "teste@teste.com",
    })
    .expect(201);

  const user = await User.findOne({
    email: "teste@teste.com",
  });

  expect(user).not.toBeNull();

  if (user)
    expect(response.body).toHaveProperty(
      "token",
      user.tokens[user.tokens.length - 1].token
    );
});

test("Should not signup user with invalid name/email/password", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Testing",
      password: 4,
      email: "teste@teste.com",
    })
    .expect(400);

  expect(response.body).toEqual({});
});

test("Should login using valid credentials", async () => {
  const response = await request(app)
    .post("/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findOne({
    email: userOne.email,
  });

  expect(user).not.toBeNull();

  expect(response.body.token).toBe(user?.tokens[1].token);
});

test("Should not login when using invalid crendentials", async () => {
  await request(app)
    .post("/login")
    .send({
      email: userOne.email,
      password: "InvalidPass5454",
    })
    .expect(401);
});

test("Should get user profile when a valid token is provided", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get user profile when a token is not provided", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account when a token is provided", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user).toBeNull();
});

test("Should not delete account when a token is not provided", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "__tests__/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user?.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields when authenticated", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      name: "NewName",
    })
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  const user = await User.findById(userOneId);

  if (!user) throw "User is null.";

  expect(user.name).toBe("NewName");
});

test("Should not update invalid user fields when authenticated", async () => {
  await request(app)
    .patch("/users/me")
    .send({
      location: "eqpdp´s",
    })
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(400);
});
