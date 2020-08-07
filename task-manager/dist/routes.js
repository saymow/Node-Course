"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var upload = multer_1.default({
    limits: {
        fileSize: 1000000,
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return cb(new Error("Please upload a valid image."));
        cb(null, true);
    },
});
var userController_1 = __importDefault(require("./controllers/userController"));
var taskController_1 = __importDefault(require("./controllers/taskController"));
var userController_2 = __importDefault(require("./controllers/userController"));
var auth_1 = __importDefault(require("./middleware/auth"));
var routes = express_1.default.Router();
routes.post("/users", userController_1.default.store);
routes.post("/login", userController_2.default.signIn);
routes.get("/users/me", auth_1.default, userController_1.default.me);
routes.post("/users/logout", auth_1.default, userController_1.default.logOut);
routes.post("/users/logout_all", auth_1.default, userController_1.default.logOutAll);
routes.patch("/users/me", auth_1.default, userController_1.default.update);
routes.delete("/users/me", auth_1.default, userController_1.default.delete);
routes.post("/tasks", auth_1.default, taskController_1.default.store);
routes.patch("/tasks/:id", auth_1.default, taskController_1.default.update);
routes.delete("/tasks/:id", auth_1.default, taskController_1.default.delete);
routes.get("/tasks", auth_1.default, taskController_1.default.list);
routes.get("/tasks/:id", auth_1.default, taskController_1.default.index);
routes.post("/users/me/avatar", auth_1.default, upload.single("avatar"), userController_2.default.storeimage, function (error, req, res, next) {
    return res.status(400).send({
        error: error.message,
    });
});
routes.delete("/users/me/avatar", auth_1.default, userController_1.default.deleteImage);
routes.get("/users/:id/avatar", userController_2.default.getImage);
exports.default = routes;
