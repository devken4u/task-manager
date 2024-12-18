import { NextFunction, Request, Response } from "express";
import { getAccessToken, checkToken } from "../utils/token";
import UserModel from "../models/userModel";

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
  const account = await UserModel.findById(payload.userId);
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

export { authenticate };
