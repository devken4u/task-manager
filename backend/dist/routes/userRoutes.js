"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authenticate_1 = require("../middlewares/authenticate");
const userRoutes = express_1.default.Router();
// post
userRoutes.route("/register").post(userController_1.createNewAccount);
userRoutes.route("/login").post(userController_1.loginUser);
userRoutes.route("/logout").post(userController_1.logoutUser);
// get
userRoutes.route("/is-authenticated").get(authenticate_1.authenticate, userController_1.isAuthenticated);
exports.default = userRoutes;
