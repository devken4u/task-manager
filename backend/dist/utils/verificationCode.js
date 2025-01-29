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
exports.processVerificationCode = void 0;
exports.generateRandomCode = generateRandomCode;
const nodemailer_1 = __importDefault(require("nodemailer"));
const verificationCodeModel_1 = __importDefault(require("../models/verificationCodeModel"));
function sendVerificationCode({ code, to, subject = "TaskHive Code", }) {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "devken4u@gmail.com", //to hide
            pass: "ywadxzoimqrbqtjj", //to hide
        },
    });
    return transporter.sendMail({
        from: "TaskHive <devken4u@gmail.com>", //to hide
        to: to,
        subject: subject,
        html: `Your TaskHive verification code is <u><b>${code}</b><u/>`,
    });
}
function generateRandomCode(min = 1000, max = 8999) {
    // default
    // min - 1000
    // max - 8999 (9999)
    return Math.floor(Math.random() * max) + min;
}
const processVerificationCode = (email, purpose, subject) => __awaiter(void 0, void 0, void 0, function* () {
    // generating the code
    const code = generateRandomCode();
    //saving a new one
    const verificationCode = new verificationCodeModel_1.default({
        code: code,
        email: email,
        purpose: purpose,
        expiresAt: new Date(new Date().getTime() + 1000 * 60 * 2),
    });
    verificationCode.save();
    // send the code to the user's email
    yield sendVerificationCode({
        code: code,
        to: email,
        subject: subject,
    });
});
exports.processVerificationCode = processVerificationCode;
