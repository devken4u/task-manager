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
exports.checkEmailVerificationCode = exports.requestEmailVerificationCode = void 0;
const errorCodes_1 = require("../enum/errorCodes");
const verificationCodeModel_1 = __importDefault(require("../models/verificationCodeModel"));
const verificationCode_1 = require("../utils/verificationCode");
const userModel_1 = __importDefault(require("../models/userModel"));
require("dotenv/config");
const verificationCodeRequestCooldown = Number(process.env.VERIFICATION_CODE_REQUEST_COOLDOWN_IN_MINUTE) || 1; //default is 1 minute
const requestEmailVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = req.body.account;
    // check if email is already verified
    if (account.isEmailVerified) {
        res.status(400).json({
            message: "Email is already verified",
            code: errorCodes_1.ErrorCodes.EmailAlreadyVerified,
        });
        return;
    }
    // check if there is a pending request verification code for that account
    const verificationInformation = yield verificationCodeModel_1.default.findOne({
        email: account.email,
        purpose: "email",
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
            (0, verificationCode_1.processVerificationCode)(account.email, "email", "Email Verification");
            res.status(200).json({
                message: "Email verification code sent.",
                email: account.email,
                cooldown: verificationCodeRequestCooldown * 60,
            });
        }
        else {
            res.status(400).json({
                message: "Request verification code again later.",
                code: errorCodes_1.ErrorCodes.VerificationCodeRequestLimit,
                email: account.email,
                cooldown: verificationCodeRequestCooldown * 60 - Math.floor(elapsedSeconds),
            });
            return;
        }
    }
    else {
        // there is no pending code in the database
        // process a new one
        (0, verificationCode_1.processVerificationCode)(account.email, "email", "Email Verification");
        res.status(200).json({
            message: "Email verification code sent.",
            email: account.email,
            cooldown: verificationCodeRequestCooldown * 60,
        });
    }
});
exports.requestEmailVerificationCode = requestEmailVerificationCode;
const checkEmailVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // this code will run if the code by user and the requested matched.
    // make the email in the database verified
    const account = req.body.account;
    yield userModel_1.default.updateOne({ email: account.email }, { $set: { isEmailVerified: true } });
    // delete the used code
    yield verificationCodeModel_1.default.findOneAndDelete({
        email: account.email,
        purpose: "email",
    });
    // send the response
    res.status(200).json({
        message: "Email Verified.",
    });
    return;
});
exports.checkEmailVerificationCode = checkEmailVerificationCode;
