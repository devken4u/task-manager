"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForgotPasswordVerificationCode = exports.requestForgotPasswordVerificationCode = exports.checkEmailIfExisting = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const errorCodes_1 = require("../enum/errorCodes");
const verificationCodeModel_1 = __importDefault(require("../models/verificationCodeModel"));
const verificationCode_1 = require("../utils/verificationCode");
const bcrypt_1 = __importDefault(require("bcrypt"));
const verificationCodeRequestCooldown = Number(process.env.VERIFICATION_CODE_REQUEST_COOLDOWN_IN_MINUTE) || 1; //default is 1 minute
const checkEmailIfExisting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    if (!email) {
        res.status(400).json({
            message: "Email is required.",
            code: errorCodes_1.ErrorCodes.EmailMissing,
        });
        return;
    }
    const account = yield userModel_1.default.findOne({ email: email });
    if (account) {
        res.status(200).json({
            message: "Email is existing.",
            isEmailFound: true,
        });
        return;
    }
    else {
        res.status(400).json({
            message: "Email not found.",
            isEmailFound: false,
            code: errorCodes_1.ErrorCodes.EmailNotFound,
        });
        return;
    }
});
exports.checkEmailIfExisting = checkEmailIfExisting;
const requestForgotPasswordVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email = "" } = req.body;
    // check if email is empty
    if (!email) {
        res.status(400).json({
            message: "Email is required.",
            code: errorCodes_1.ErrorCodes.EmailMissing,
        });
        return;
    }
    // check if email is existing
    const account = yield userModel_1.default.findOne({ email: email });
    if (!account) {
        res.status(400).json({
            message: "Email not found.",
            isEmailFound: false,
            code: errorCodes_1.ErrorCodes.EmailNotFound,
        });
        return;
    }
    // check if there is a pending request verification code for that account
    const verificationInformation = yield verificationCodeModel_1.default.findOne({
        email: email,
        purpose: "forgot-password",
    });
    if (verificationInformation) {
        // calculate the elapsed time the code has existed
        const createdAt = new Date(verificationInformation.createdAt);
        const dateNow = new Date();
        const elapsedSeconds = (dateNow.getTime() - createdAt.getTime()) / 1000;
        // if the code has existed for set time, give new code and manually delete the previous code
        // if not, give an error message
        if (Math.floor(elapsedSeconds) >= verificationCodeRequestCooldown * 60) {
            // deleting the old code
            yield verificationCodeModel_1.default.findOneAndDelete({
                _id: verificationInformation._id,
            });
            (0, verificationCode_1.processVerificationCode)(email, "forgot-password", "Forgot Password");
            res.status(200).json({
                message: "Forgot password verification code sent.",
                email: email,
                cooldown: verificationCodeRequestCooldown * 60,
            });
        }
        else {
            res.status(400).json({
                message: "Request verification code again later.",
                code: errorCodes_1.ErrorCodes.VerificationCodeRequestLimit,
                email: email,
                cooldown: verificationCodeRequestCooldown * 60 - Math.floor(elapsedSeconds),
            });
            return;
        }
    }
    else {
        // there is no pending code in the database
        // process a new one
        (0, verificationCode_1.processVerificationCode)(email, "forgot-password", "Forgot Password");
        res.status(200).json({
            message: "Forgot password verification code sent.",
            email: email,
            cooldown: verificationCodeRequestCooldown * 60,
        });
    }
});
exports.requestForgotPasswordVerificationCode = requestForgotPasswordVerificationCode;
const checkForgotPasswordVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password = "" } = req.body;
    const account = req.body.account;
    if (!password) {
        res.status(400).json({
            message: "Password is missing",
            code: errorCodes_1.ErrorCodes.PasswordMissing,
        });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({
            message: "Minimum password length is 8 characters.",
            code: errorCodes_1.ErrorCodes.PasswordTooShort,
        });
        return;
    }
    const newPassword = yield bcrypt_1.default.hash(password, 10);
    yield userModel_1.default.updateOne({ email: account.email }, { $set: { password: newPassword } });
    // delete the used code
    yield verificationCodeModel_1.default.findOneAndDelete({
        email: account.email,
        purpose: "forgot-password",
    });
    res.status(200).json({
        message: "Password successfully changed.",
    });
});
exports.checkForgotPasswordVerificationCode = checkForgotPasswordVerificationCode;
