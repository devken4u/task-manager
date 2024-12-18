import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UserModel from "../models/userModel";
import { validateField } from "../utils/validation";
import { clearToken, generateToken } from "../utils/token";
import { ErrorCodes } from "../enum/errorCodes";
import { Account } from "../types/types";
import { getAccessToken } from "../utils/token";
import { TokenPayload } from "../types/types";

const createNewAccount = async (req: Request, res: Response) => {
  // extracting fields
  let { firstname = "", lastname = "", email = "", password = "" } = req.body;

  // validate every fields
  if (!validateField(firstname)) {
    res.status(400).json({
      message: "First name is required.",
      code: ErrorCodes.FirstNameMissing,
    });
    return;
  }

  if (!validateField(lastname)) {
    res.status(400).json({
      message: "Last name is required.",
      code: ErrorCodes.LastNameMissing,
    });
    return;
  }

  if (!validateField(email)) {
    res.status(400).json({
      message: "Email address is required.",
      code: ErrorCodes.EmailMissing,
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      message: "Invalid email address.",
      code: ErrorCodes.InvalidEmailAddress,
    });
    return;
  }

  // check if email already exist
  const existingEmail = await UserModel.findOne({ email: req.body.email });
  if (existingEmail) {
    res.status(400).json({
      message: "Email already exist.",
      code: ErrorCodes.EmailAlreadyExists,
    });
    return;
  }

  if (!validateField(password, 8)) {
    res.status(400).json({
      message: "Minimum password length is 8 characters.",
      code: ErrorCodes.PasswordTooShort,
    });
    return;
  }

  // hash password
  password = await bcrypt.hash(password, 10);

  // saving the user if all validation is accepted
  try {
    const user = new UserModel({
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: password,
    });
    user.save();
    res.status(201).json({
      message: "New user account created.",
    });
  } catch (error) {
    throw new Error(String(error));
  }
};

const loginUser = async (req: Request, res: Response) => {
  // extracting email and password
  const { email = "", password = "" } = req.body;

  // check if email and password is empty
  if (!validateField(email) || !validateField(password)) {
    res.status(400).json({
      message: "Email and Password is required.",
      code: ErrorCodes.EmailOrPasswordIsMissing,
    });
    return;
  }

  // check if email exists
  const account = (await UserModel.findOne({ email })) as Account;
  if (!account) {
    res.status(400).json({
      message: "Email doesn't exist.",
      code: ErrorCodes.EmailNotFound,
    });
    return;
  }

  // check if password matched
  const isPasswordMatched = await bcrypt.compare(password, account.password);
  if (!isPasswordMatched) {
    res.status(401).json({
      message: "Password doesn't match.",
      code: ErrorCodes.IncorrectPassword,
    });
    return;
  }

  // generate token if no error occurred
  generateToken(
    res,
    {
      userId: account._id,
      role: account.role,
      isEmailVerified: account.isEmailVerified,
    },
    getAccessToken()
  );
  res.status(200).send({ message: "User successfully logged in." });
};

const logoutUser = async (_req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "Logged out successfully" });
};

const isAuthenticated = async (req: Request, res: Response) => {
  // this function will run if authenticate middleware passes the validation
  const account = req.body.account as TokenPayload;
  if (account) {
    res.status(200).json({
      isAuthenticated: true,
      role: account.role,
      isEmailVerified: account.isEmailVerified,
    });
  } else {
    // if account is empty
    res.status(200).json({ isAuthenticated: false });
  }
};

export { createNewAccount, loginUser, logoutUser, isAuthenticated };
