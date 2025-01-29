"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailVerificationController_1 = require("../controllers/emailVerificationController");
const authenticate_1 = require("../middlewares/authenticate");
const verificationCode_1 = require("../middlewares/verificationCode");
const emailVerificationRoutes = express_1.default.Router();
emailVerificationRoutes
    .route("/request-code")
    .post(authenticate_1.authenticate, emailVerificationController_1.requestEmailVerificationCode);
emailVerificationRoutes
    .route("/verify-code")
    .post(authenticate_1.authenticate, (0, verificationCode_1.checkVerificationCode)("email"), emailVerificationController_1.checkEmailVerificationCode);
exports.default = emailVerificationRoutes;
