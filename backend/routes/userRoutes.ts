import express from "express";
import {
  createNewAccount,
  loginUser,
  logoutUser,
  isAuthenticated,
} from "../controllers/userController";
import { authenticate } from "../middlewares/authenticate";

const userRoutes = express.Router();

// post
userRoutes.route("/register").post(createNewAccount);
userRoutes.route("/login").post(loginUser);
userRoutes.route("/logout").post(logoutUser);

// get
userRoutes.route("/is-authenticated").get(authenticate, isAuthenticated);

export default userRoutes;
