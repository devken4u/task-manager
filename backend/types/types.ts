import { Types } from "mongoose";

type Account = {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  isEmailVerified: boolean;
  password: string;
  role: "user" | "admin";
};

type TokenPayload = {
  userId: Types.ObjectId;
  role: "user" | "admin";
  isEmailVerified: boolean;
};

export { Account, TokenPayload };
