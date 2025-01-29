import { NextFunction, Request, Response } from "express";
import { getAccessToken, checkToken } from "../utils/token";
import UserModel from "../models/userModel";
import { Account } from "../types/types";
import { ErrorCodes } from "../enum/errorCodes";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get the token from cookies
  const token = req.cookies.jwt;

  // check if token is empty
  if (!token) {
    res.status(200).json({ isAuthenticated: false });
    return;
  }

  // check if token is valid
  const payload = checkToken(token, getAccessToken());
  if (!payload) {
    res.status(200).json({ isAuthenticated: false });
    return;
  }

  // find the account
  const account = await UserModel.findById(payload.userId, { password: 0 });
  if (account) {
    // if account is found store it in the body
    req.body.account = account;
    next();
  } else {
    // if account is not found
    res.status(200).json({ isAuthenticated: false });
    return;
  }
};

const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const account = req.body.account as Account;

  if (account.role !== "super-admin" && account.role !== "admin") {
    res.status(401).send({
      code: ErrorCodes.Unauthorized,
      message: "Unauthorized resources.",
    });
    return;
  }
  next();
};

export { authenticate, authenticateAdmin };
