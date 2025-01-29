"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    dueDate: {
        type: Date,
        default: new Date(),
    },
}, {
    timestamps: true,
});
const TaskModel = mongoose_1.default.model("Task", taskSchema);
exports.default = TaskModel;
