"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sendVerificationCode;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendVerificationCode({ code, to, subject = "TaskHive Code", }) {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "devken4u@gmail.com",
            pass: "ywadxzoimqrbqtjj",
        },
    });
    return transporter.sendMail({
        from: "TaskHive <devken4u@gmail.com>",
        to: to,
        subject: subject,
        html: `Your TaskHive verification code is <u><b>${code}</b><u/>`,
    });
}
