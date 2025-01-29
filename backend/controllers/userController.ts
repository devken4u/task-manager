import bcrypt from "bcrypt";
import { Request, Response } from "express";
import UserModel from "../models/userModel";
import { validateField } from "../utils/validation";
import { clearToken, generateToken } from "../utils/token";
import { ErrorCodes } from "../enum/errorCodes";
import { Account } from "../types/types";
import { getAccessToken } from "../utils/token";
import { TokenPayload } from "../types/types";
import VerificationCodeModel from "../models/verificationCodeModel";
import { processVerificationCode } from "../utils/verificationCode";
import { UserList } from "../types/types";
import { Types } from "mongoose";
import TaskModel from "../models/taskModel";

const verificationCodeRequestCooldown =
  Number(process.env.VERIFICATION_CODE_REQUEST_COOLDOWN_IN_MINUTE) || 1; //default is 1 minute

const createNewAccount = async (req: Request, res: Response) => {
  // extracting fields
  let { firstname = "", lastname = "", email = "", password = "" } = req.body;

  // validate every fields
  if (!validateField(firstname, 0, 50)) {
    res.status(400).json({
      message: "First name is required or invalid.",
      code: ErrorCodes.FirstNameMissing,
    });
    return;
  }

  if (!validateField(lastname, 0, 50)) {
    res.status(400).json({
      message: "Last name is required or invalid.",
      code: ErrorCodes.LastNameMissing,
    });
    return;
  }

  if (!validateField(email, 0, 254)) {
    res.status(400).json({
      message: "Email address is required opr invalid.",
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

const createNewAdminAccount = async (req: Request, res: Response) => {
  // extracting fields
  let {
    firstname = "",
    lastname = "",
    email = "",
    password = "",
    role = "",
  } = req.body;

  if (role !== "admin" && role !== "super-admin") {
    res.status(401).json({
      message: "Invalid role.",
      code: ErrorCodes.Unauthorized,
    });
    return;
  }

  if (!validateField(firstname, 0, 50)) {
  }

  if (!validateField(lastname, 0, 50)) {
    res.status(400).json({
      message: "Last name is required or invalid.",
      code: ErrorCodes.LastNameMissing,
    });
    return;
  }

  if (!validateField(email, 0, 254)) {
    res.status(400).json({
      message: "Email address is required opr invalid.",
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
      role: role,
      isEmailVerified: true,
    });
    user.save();
    res.status(201).json({
      message: "New admin account created.",
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

const getUserInformation = async (req: Request, res: Response) => {
  res.status(200).json({
    email: req.body.account.email,
    firstname: req.body.account.firstname,
    lastname: req.body.account.lastname,
    role: req.body.account.role,
  });
};

const updateUserName = async (req: Request, res: Response) => {
  const { firstname = "", lastname = "" } = req.body;
  const account = req.body.account as Account;
  const toUpdateFields: { firstname?: string; lastname?: string } = {};

  if (!firstname && !lastname) {
    res.status(400).json({
      message: "No fields to update.",
      code: ErrorCodes.NoFieldsToUpdate,
    });
    return;
  }

  if (firstname.length > 50 || lastname.length) {
    res.status(400).json({
      message: "Field data is too long.",
      code: ErrorCodes.DataExceedsMaximumLimit,
    });
    return;
  }

  if (firstname) toUpdateFields.firstname = firstname;
  if (lastname) toUpdateFields.lastname = lastname;

  await UserModel.updateOne({ email: account.email }, { $set: toUpdateFields });

  res.status(200).json({
    message: "User name updated successfully.",
  });
};

const checkEmailIfExisting = async (req: Request, res: Response) => {
  const email = req.query.email;

  if (!email) {
    res.status(400).json({
      message: "Email is required.",
      code: ErrorCodes.EmailMissing,
    });
    return;
  }

  const account = await UserModel.findOne({ email: email });

  if (account) {
    res.status(200).json({
      message: "Email is existing.",
      isEmailFound: true,
    });
    return;
  } else {
    res.status(400).json({
      message: "Email not found.",
      isEmailFound: false,
      code: ErrorCodes.EmailNotFound,
    });
    return;
  }
};

const requestChangePasswordVerificationCode = async (
  req: Request,
  res: Response
) => {
  const { email = "" } = req.body;

  // check if email is empty
  if (!email) {
    res.status(400).json({
      message: "Email is required.",
      code: ErrorCodes.EmailMissing,
    });
    return;
  }

  // check if email is existing
  const account = await UserModel.findOne({ email: email });

  if (!account) {
    res.status(400).json({
      message: "Email not found.",
      isEmailFound: false,
      code: ErrorCodes.EmailNotFound,
    });
    return;
  }

  // check if there is a pending request verification code for that account
  const verificationInformation = await VerificationCodeModel.findOne({
    email: email,
    purpose: "change-password",
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
      processVerificationCode(email, "change-password", "Change Password");
      res.status(200).json({
        message: "Change password verification code sent.",
        email: email,
        cooldown: verificationCodeRequestCooldown * 60,
      });
    } else {
      res.status(400).json({
        message: "Request verification code again later.",
        code: ErrorCodes.VerificationCodeRequestLimit,
        email: email,
        cooldown:
          verificationCodeRequestCooldown * 60 - Math.floor(elapsedSeconds),
      });
      return;
    }
  } else {
    // there is no pending code in the database
    // process a new one
    processVerificationCode(email, "change-password", "Change Password");
    res.status(200).json({
      message: "Change password verification code sent.",
      email: email,
      cooldown: verificationCodeRequestCooldown * 60,
    });
  }
};

const checkChangePasswordVerificationCode = async (
  req: Request,
  res: Response
) => {
  const { password = "" } = req.body;
  const account = req.body.account as Account;

  if (!password) {
    res.status(400).json({
      message: "Password is missing",
      code: ErrorCodes.PasswordMissing,
    });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      message: "Minimum password length is 8 characters.",
      code: ErrorCodes.PasswordTooShort,
    });
    return;
  }

  const newPassword = await bcrypt.hash(password, 10);

  await UserModel.updateOne(
    { email: account.email },
    { $set: { password: newPassword } }
  );

  // delete the used code
  await VerificationCodeModel.findOneAndDelete({
    email: account.email,
    purpose: "change-password",
  });

  res.status(200).json({
    message: "Password successfully changed.",
  });
};

const getUserList = async (req: Request, res: Response) => {
  const { itemPerPage, currentPage, similar } = req.query;

  const sortBy = req.query.sortBy || "createdAt";

  const userInformationList: UserList[] = [];

  try {
    const userList = await UserModel.find({
      role: "user",
      $or: [
        { email: { $regex: similar, $options: "i" } },
        { firstname: { $regex: similar, $options: "i" } },
        { lastname: { $regex: similar, $options: "i" } },
      ],
    })
      .skip(Number(itemPerPage) * Number(currentPage))
      .limit(Number(itemPerPage))
      .sort({ [String(sortBy)]: 1 });

    const totalUser = await UserModel.countDocuments({
      role: "user",
      $or: [
        { email: { $regex: similar, $options: "i" } },
        { firstname: { $regex: similar, $options: "i" } },
        { lastname: { $regex: similar, $options: "i" } },
      ],
    });

    for (const user of userList) {
      const totalTask = await TaskModel.countDocuments({ userId: user._id });

      userInformationList.push({
        _id: user._id as Types.ObjectId,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname || "",
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        totalTask: totalTask,
      });
    }

    res.status(200).json({ userInformationList, totalUser });
  } catch (e) {
    res.status(500).send("An unexpected occurred in the server.");
  }
};

const getAdminList = async (req: Request, res: Response) => {
  const account = req.body.account as Account;

  if (account.role !== "super-admin") {
    res.status(401).send({
      code: ErrorCodes.Unauthorized,
      message: "Unauthorized resources.",
    });
    return;
  }

  const { itemPerPage, currentPage, similar } = req.query;

  const sortBy = req.query.sortBy || "createdAt";

  const adminInformationList: UserList[] = [];

  try {
    const adminList = await UserModel.find({
      $and: [
        { $or: [{ role: "admin" }, { role: "super-admin" }] },
        {
          $or: [
            { email: { $regex: similar, $options: "i" } },
            { firstname: { $regex: similar, $options: "i" } },
            { lastname: { $regex: similar, $options: "i" } },
          ],
        },
      ],
    })
      .skip(Number(itemPerPage) * Number(currentPage))
      .limit(Number(itemPerPage))
      .sort({ [String(sortBy)]: 1 });

    const totalAdmin = await UserModel.countDocuments({
      $and: [
        { $or: [{ role: "admin" }, { role: "super-admin" }] },
        {
          $or: [
            { email: { $regex: similar, $options: "i" } },
            { firstname: { $regex: similar, $options: "i" } },
            { lastname: { $regex: similar, $options: "i" } },
          ],
        },
      ],
    });

    for (const user of adminList) {
      const totalTask = await TaskModel.countDocuments({ userId: user._id });

      adminInformationList.push({
        _id: user._id as Types.ObjectId,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname || "",
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        totalTask: totalTask,
      });
    }

    res.status(200).json({ adminInformationList, totalAdmin });
  } catch (e) {
    res.status(500).send("An unexpected occurred in the server.");
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({
      message: "Password is missing",
      code: ErrorCodes.UserIDRequired,
    });
    return;
  }

  try {
    const deletedUser = await UserModel.findOneAndDelete({ _id: userId });
    if (deletedUser) {
      res.status(200).json({
        message: "User successfully deleted.",
      });
    } else {
      res.status(400).json({
        message: "User not found",
        code: ErrorCodes.UserNotFound,
      });
    }
  } catch {
    res.status(500).send("An unexpected occurred in the server.");
  }
};

export {
  createNewAccount,
  loginUser,
  logoutUser,
  isAuthenticated,
  getUserInformation,
  updateUserName,
  checkEmailIfExisting,
  requestChangePasswordVerificationCode,
  checkChangePasswordVerificationCode,
  getUserList,
  deleteUser,
  getAdminList,
  createNewAdminAccount,
};
