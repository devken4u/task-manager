"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const verificationCodeSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
    },
    attempt: {
        type: Number,
        default: 0,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: new Date(Date.now() + 1000 * 60 * 5), // 5 minute expiration
    },
}, { timestamps: true });
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const VerificationCodeModel = mongoose_1.default.model("VerificationCodes", verificationCodeSchema);
exports.default = VerificationCodeModel;
