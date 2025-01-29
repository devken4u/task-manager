import { Types } from "mongoose";

type Account = {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  role: "user" | "admin" | "super-admin";
};

type TokenPayload = {
  userId: Types.ObjectId;
  role: "user" | "admin" | "super-admin";
  isEmailVerified: boolean;
};

type UserList = {
  _id: Types.ObjectId;
  email: string;
  totalTask: number;
  firstname: string;
  lastname: string;
  isEmailVerified: boolean;
  role: "user" | "admin" | "super-admin";
};

export { Account, TokenPayload, UserList };
