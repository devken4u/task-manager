"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstname: {
        type: String,
        required: true,
        maxLength: 50,
    },
    lastname: {
        type: String,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 254,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "super-admin"],
        default: "user",
    },
}, { timestamps: true });
const UserModel = mongoose_1.default.model("User", userSchema);
exports.default = UserModel;
