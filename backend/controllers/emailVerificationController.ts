import { Request, Response } from "express";
import { Account } from "../types/types";
import { ErrorCodes } from "../enum/errorCodes";
import VerificationCodeModel from "../models/verificationCodeModel";
import { processVerificationCode } from "../utils/verificationCode";
import UserModel from "../models/userModel";

const requestEmailVerificationCode = async (req: Request, res: Response) => {
  const account = req.body.account as Account;

  // check if email is already verified
  if (account.isEmailVerified) {
    res.status(400).json({
      message: "Email is already verified",
      code: ErrorCodes.EmailAlreadyVerified,
    });
    return;
  }

  // check if there is a pending request verification code for that account
  const verificationInformation = await VerificationCodeModel.findOne({
    email: account.email,
  });

  if (verificationInformation) {
    // calculate the elapsed time the code has existed
    const createdAt = new Date(verificationInformation.createdAt);
    const dateNow = new Date();
    const elapsedSeconds = (dateNow.getTime() - createdAt.getTime()) / 1000;

    // if the code has existed for over 60 seconds, give new code and manually delete the previous code
    // if not, give an error message
    if (elapsedSeconds >= 60) {
      // deleting the old code
      await VerificationCodeModel.findOneAndDelete({
        _id: verificationInformation._id,
      });
      processVerificationCode(account);
      res.status(200).json({
        message: "Email verification code sent.",
      });
    } else {
      res.status(400).json({
        message: "Request verification code again later.",
        code: ErrorCodes.VerificationCodeRequestLimit,
      });
      return;
    }
  } else {
    // there is no pending code in the database
    // process a new one
    processVerificationCode(account);
    res.status(200).json({
      message: "Email verification code sent.",
    });
  }
};

const checkEmailVerificationCode = async (req: Request, res: Response) => {
  // this code will run if the code by user and the requested matched.

  // make the email in the database verified
  const account = req.body.account as Account;
  await UserModel.updateOne(
    { email: account.email },
    { $set: { isEmailVerified: true } }
  );

  // send the response
  res.status(200).json({
    message: "Email Verified.",
  });
  return;
};

export { requestEmailVerificationCode, checkEmailVerificationCode };
