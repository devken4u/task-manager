"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const forgotPasswordController_1 = require("../controllers/forgotPasswordController");
const verificationCode_1 = require("../middlewares/verificationCode");
const user_1 = require("../middlewares/user");
const forgotPasswordRoutes = express_1.default.Router();
forgotPasswordRoutes.route("/check-email").get(forgotPasswordController_1.checkEmailIfExisting);
forgotPasswordRoutes
    .route("/request-code")
    .post(forgotPasswordController_1.requestForgotPasswordVerificationCode);
forgotPasswordRoutes
    .route("/reset")
    .post(user_1.getAccount, (0, verificationCode_1.checkVerificationCode)("forgot-password"), forgotPasswordController_1.checkForgotPasswordVerificationCode);
exports.default = forgotPasswordRoutes;
