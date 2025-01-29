import { Request, Response } from "express";
import { Account } from "../types/types";
import { ErrorCodes } from "../enum/errorCodes";
import VerificationCodeModel from "../models/verificationCodeModel";
import { processVerificationCode } from "../utils/verificationCode";
import UserModel from "../models/userModel";
import "dotenv/config";

const verificationCodeRequestCooldown =
  Number(process.env.VERIFICATION_CODE_REQUEST_COOLDOWN_IN_MINUTE) || 1; //default is 1 minute

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
      await VerificationCodeModel.findOneAndDelete({
        _id: verificationInformation._id,
      });
      processVerificationCode(account.email, "email", "Email Verification");
      res.status(200).json({
        message: "Email verification code sent.",
        email: account.email,
        cooldown: verificationCodeRequestCooldown * 60,
      });
    } else {
      res.status(400).json({
        message: "Request verification code again later.",
        code: ErrorCodes.VerificationCodeRequestLimit,
        email: account.email,
        cooldown:
          verificationCodeRequestCooldown * 60 - Math.floor(elapsedSeconds),
      });
      return;
    }
  } else {
    // there is no pending code in the database
    // process a new one
    processVerificationCode(account.email, "email", "Email Verification");
    res.status(200).json({
      message: "Email verification code sent.",
      email: account.email,
      cooldown: verificationCodeRequestCooldown * 60,
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

  // delete the used code
  await VerificationCodeModel.findOneAndDelete({
    email: account.email,
    purpose: "email",
  });

  // send the response
  res.status(200).json({
    message: "Email Verified.",
  });
  return;
};

export { requestEmailVerificationCode, checkEmailVerificationCode };
