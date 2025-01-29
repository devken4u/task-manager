import { NextFunction, Request, Response } from "express";
import UserModel from "../models/userModel";
import { ErrorCodes } from "../enum/errorCodes";

const getAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { email = "" } = req.body;

  if (!email) {
    res.status(400).json({
      message: "Email is missing.",
      code: ErrorCodes.EmailMissing,
    });
    return;
  }

  const account = await UserModel.findOne({ email });
  if (!account) {
    res.status(400).json({
      message: "Email not found.",
      code: ErrorCodes.EmailNotFound,
    });
    return;
  }

  req.body.account = account;
  next();
};

export { getAccount };
