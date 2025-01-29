import mongoose from "mongoose";
import "dotenv/config";

const verificationCodeExpiration =
  Number(process.env.VERIFICATION_CODE_EXPIRATION_IN_MINUTE) || 5; //default is 5 minutes

const verificationCodeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["email", "change-password"],
      required: true,
    },
    attempt: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: new Date(Date.now() + 1000 * 60 * verificationCodeExpiration), // 5 minute expiration
    },
  },
  { timestamps: true }
);

verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationCodeModel = mongoose.model(
  "VerificationCodes",
  verificationCodeSchema
);

export default VerificationCodeModel;
