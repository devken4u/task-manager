import express from "express";
import {
  createNewAccount,
  loginUser,
  logoutUser,
  isAuthenticated,
  getUserInformation,
  updateUserName,
  checkEmailIfExisting,
  checkChangePasswordVerificationCode,
  requestChangePasswordVerificationCode,
  getUserList,
  getAdminList,
  deleteUser,
  createNewAdminAccount,
} from "../controllers/userController";
import { authenticate, authenticateAdmin } from "../middlewares/authenticate";
import { getAccount } from "../middlewares/user";
import { checkVerificationCode } from "../middlewares/verificationCode";

const userRoutes = express.Router();

// post
userRoutes.route("/register").post(createNewAccount);
userRoutes.route("/login").post(loginUser);
userRoutes
  .route("/admin/register")
  .post(authenticate, authenticateAdmin, createNewAdminAccount);
userRoutes.route("/logout").post(logoutUser);
userRoutes.route("/update-user-name").post(authenticate, updateUserName);
userRoutes
  .route("/change-password/request-code")
  .post(requestChangePasswordVerificationCode);
userRoutes
  .route("/change-password")
  .post(
    getAccount,
    checkVerificationCode("change-password"),
    checkChangePasswordVerificationCode
  );

// delete
userRoutes.route("/delete").delete(authenticate, authenticateAdmin, deleteUser);

// get
userRoutes.route("/").get(authenticate, authenticateAdmin, getUserList);
userRoutes.route("/admin").get(authenticate, authenticateAdmin, getAdminList);
userRoutes.route("/is-authenticated").get(authenticate, isAuthenticated);
userRoutes.route("/information").get(authenticate, getUserInformation);
userRoutes.route("/check-email").get(checkEmailIfExisting);

export default userRoutes;
