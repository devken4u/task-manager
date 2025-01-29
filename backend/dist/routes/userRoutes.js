"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authenticate_1 = require("../middlewares/authenticate");
const user_1 = require("../middlewares/user");
const verificationCode_1 = require("../middlewares/verificationCode");
const userRoutes = express_1.default.Router();
// post
userRoutes.route("/register").post(userController_1.createNewAccount);
userRoutes.route("/login").post(userController_1.loginUser);
userRoutes
    .route("/admin/register")
    .post(authenticate_1.authenticate, authenticate_1.authenticateAdmin, userController_1.createNewAdminAccount);
userRoutes.route("/logout").post(userController_1.logoutUser);
userRoutes.route("/update-user-name").post(authenticate_1.authenticate, userController_1.updateUserName);
userRoutes
    .route("/change-password/request-code")
    .post(userController_1.requestChangePasswordVerificationCode);
userRoutes
    .route("/change-password")
    .post(user_1.getAccount, (0, verificationCode_1.checkVerificationCode)("change-password"), userController_1.checkChangePasswordVerificationCode);
// delete
userRoutes.route("/delete").delete(authenticate_1.authenticate, authenticate_1.authenticateAdmin, userController_1.deleteUser);
// get
userRoutes.route("/").get(authenticate_1.authenticate, authenticate_1.authenticateAdmin, userController_1.getUserList);
userRoutes.route("/admin").get(authenticate_1.authenticate, authenticate_1.authenticateAdmin, userController_1.getAdminList);
userRoutes.route("/is-authenticated").get(authenticate_1.authenticate, userController_1.isAuthenticated);
userRoutes.route("/information").get(authenticate_1.authenticate, userController_1.getUserInformation);
userRoutes.route("/check-email").get(userController_1.checkEmailIfExisting);
exports.default = userRoutes;
