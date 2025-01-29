import nodemailer from "nodemailer";
import { Account } from "../types/types";
import VerificationCodeModel from "../models/verificationCodeModel";

function sendVerificationCode({
  code,
  to,
  subject = "TaskHive Code",
}: {
  code: number;
  to: string;
  subject: string;
}) {
  const transporter = nodemailer.createTransport({
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

function generateRandomCode(min: number = 1000, max: number = 8999) {
  // default
  // min - 1000
  // max - 8999 (9999)
  return Math.floor(Math.random() * max) + min;
}

const processVerificationCode = async (
  email: string,
  purpose: "email" | "change-password",
  subject: string
) => {
  // generating the code
  const code = generateRandomCode();

  //saving a new one
  const verificationCode = new VerificationCodeModel({
    code: code,
    email: email,
    purpose: purpose,
    expiresAt: new Date(new Date().getTime() + 1000 * 60 * 2),
  });
  verificationCode.save();

  // send the code to the user's email
  await sendVerificationCode({
    code: code,
    to: email,
    subject: subject,
  });
};

export { generateRandomCode, processVerificationCode };
