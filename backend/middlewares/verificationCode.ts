import { Response, Request, NextFunction } from "express";
import { ErrorCodes } from "../enum/errorCodes";
import VerificationCodeModel from "../models/verificationCodeModel";
import { Account } from "../types/types";

const checkVerificationCode = (purpose: "email" | "change-password") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // get the code from the body
    const { code = "" } = req.body;

    // get the account from the body (the source of this is previous middleware that fetches the account e.g. authenticate)
    const account = req.body.account as Account;

    // return error if code is empty
    if (!code) {
      res.status(400).json({
        message: "Verification code is missing.",
        code: ErrorCodes.VerificationCodeMissing,
      });
      return;
    }

    // check if there is a pending request verification code for that account
    const verificationInformation = await VerificationCodeModel.findOne({
      email: account.email,
      purpose: purpose,
    });

    if (!verificationInformation) {
      res.status(400).json({
        message:
          "It's either no verification code requested, or it is already expired.",
        code: ErrorCodes.VerificationCodeExpired,
      });
      return;
    }

    // check the attempts if it reaches the max limit (3)
    // fix here

    // check if the code matches
    if (code === verificationInformation.code) {
      next();
    } else {
      // increment the attempt count
      await VerificationCodeModel.updateOne(
        {
          email: account.email,
        },
        { $inc: { attempt: 1 } }
      );

      res.status(400).json({
        message: "Verification code is incorrect.",
        code: ErrorCodes.VerificationCodeIncorrect,
      });
      return;
    }
  };
};

export { checkVerificationCode };
