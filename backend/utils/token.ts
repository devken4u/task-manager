import jwt from "jsonwebtoken";
import { Response } from "express";
import { TokenPayload } from "../types/types";

const clearToken = async (res: Response) => {
  // set the cookie named jwt as empty
  // this means that the user is logged out
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
};

const checkToken = (
  token: string,
  accessToken: string
): undefined | TokenPayload => {
  // verify if the token is valid
  const account = jwt.verify(token, accessToken) as TokenPayload;
  // check if account has value and returning it if it has
  if (account) {
    return {
      userId: account.userId,
      role: account.role,
      isEmailVerified: account.isEmailVerified,
    };
  }
  // return undefined if token is invalid
  return undefined;
};

const generateToken = async (
  res: Response,
  payload: TokenPayload,
  accessToken: string
) => {
  // generate the token with the payload
  const token = jwt.sign(
    {
      userId: payload.userId,
      role: payload.role,
      IsEmailVerified: payload.isEmailVerified,
    },
    accessToken,
    {
      expiresIn: "30d",
    }
  );

  // set the cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

// temp function
const getAccessToken = (): string => {
  const accessToken = process.env.ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Access token is undefined.");
  }

  return accessToken;
};
// temp function

export { clearToken, checkToken, generateToken, getAccessToken };
