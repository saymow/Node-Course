"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes"));
var port = process.env.PORT;
var app = express_1.default();
app.use(express_1.default.json());
app.use(routes_1.default);
app.listen(port, function () { return console.log("Server is up on port", port); });
