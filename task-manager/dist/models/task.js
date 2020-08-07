"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("../db/mongoose"));
var TaskSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, {
    timestamps: true,
});
var Task = mongoose_1.default.model("tasks", TaskSchema);
exports.default = Task;
