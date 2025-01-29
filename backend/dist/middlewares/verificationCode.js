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
exports.checkVerificationCode = void 0;
const errorCodes_1 = require("../enum/errorCodes");
const verificationCodeModel_1 = __importDefault(require("../models/verificationCodeModel"));
const checkVerificationCode = (purpose) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // get the code from the body
        const { code = "" } = req.body;
        // get the account from the body (the source of this is previous middleware that fetches the account e.g. authenticate)
        const account = req.body.account;
        // return error if code is empty
        if (!code) {
            res.status(400).json({
                message: "Verification code is missing.",
                code: errorCodes_1.ErrorCodes.VerificationCodeMissing,
            });
            return;
        }
        // check if there is a pending request verification code for that account
        const verificationInformation = yield verificationCodeModel_1.default.findOne({
            email: account.email,
            purpose: purpose,
        });
        if (!verificationInformation) {
            res.status(400).json({
                message: "It's either no verification code requested, or it is already expired.",
                code: errorCodes_1.ErrorCodes.VerificationCodeExpired,
            });
            return;
        }
        // check the attempts if it reaches the max limit (3)
        // fix here
        // check if the code matches
        if (code === verificationInformation.code) {
            next();
        }
        else {
            // increment the attempt count
            yield verificationCodeModel_1.default.updateOne({
                email: account.email,
            }, { $inc: { attempt: 1 } });
            res.status(400).json({
                message: "Verification code is incorrect.",
                code: errorCodes_1.ErrorCodes.VerificationCodeIncorrect,
            });
            return;
        }
    });
};
exports.checkVerificationCode = checkVerificationCode;
