import express from "express";
import {
  requestEmailVerificationCode,
  checkEmailVerificationCode,
} from "../controllers/emailVerificationController";
import { authenticate } from "../middlewares/authenticate";
import { checkVerificationCode } from "../middlewares/verificationCode";

const emailVerificationRoutes = express.Router();

emailVerificationRoutes
  .route("/request-code")
  .post(authenticate, requestEmailVerificationCode);

emailVerificationRoutes
  .route("/verify-code")
  .post(
    authenticate,
    checkVerificationCode("email"),
    checkEmailVerificationCode
  );

export default emailVerificationRoutes;
