import express from "express";
import multer from "multer";

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error("Please upload a valid image."));

    cb(null, true);
  },
});

import UserController from "./controllers/userController";
import TaskController from "./controllers/taskController";
import userController from "./controllers/userController";

import Auth from "./middleware/auth";

const routes = express.Router();

routes.post("/users", UserController.store);
routes.post("/login", userController.signIn);
routes.get("/users/me", Auth, UserController.me);
routes.post("/users/logout", Auth, UserController.logOut);
routes.post("/users/logout_all", Auth, UserController.logOutAll);
routes.patch("/users/me", Auth, UserController.update);
routes.delete("/users/me", Auth, UserController.delete);

routes.post("/tasks", Auth, TaskController.store);
routes.patch("/tasks/:id", Auth, TaskController.update);
routes.delete("/tasks/:id", Auth, TaskController.delete);
routes.get("/tasks", Auth, TaskController.list);
routes.get("/tasks/:id", Auth, TaskController.index);

routes.post(
  "/users/me/avatar",
  Auth,
  upload.single("avatar"),
  userController.storeimage,
  (error: any, req: any, res: any, next: any) =>
    res.status(400).send({
      error: error.message,
    })
);

routes.delete("/users/me/avatar", Auth, UserController.deleteImage);
routes.get("/users/:id/avatar", userController.getImage);

export default routes;
