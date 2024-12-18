"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = exports.logoutUser = exports.loginUser = exports.createNewAccount = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
const validation_1 = require("../utils/validation");
const token_1 = require("../utils/token");
const errorCodes_1 = require("../enum/errorCodes");
const token_2 = require("../utils/token");
const createNewAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // extracting fields
    let { firstname = "", lastname = "", email = "", password = "" } = req.body;
    // validate every fields
    if (!(0, validation_1.validateField)(firstname)) {
        res.status(400).json({
            message: "First name is required.",
            code: errorCodes_1.ErrorCodes.FirstNameMissing,
        });
        return;
    }
    if (!(0, validation_1.validateField)(lastname)) {
        res.status(400).json({
            message: "Last name is required.",
            code: errorCodes_1.ErrorCodes.LastNameMissing,
        });
        return;
    }
    if (!(0, validation_1.validateField)(email)) {
        res.status(400).json({
            message: "Email address is required.",
            code: errorCodes_1.ErrorCodes.EmailMissing,
        });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({
            message: "Invalid email address.",
            code: errorCodes_1.ErrorCodes.InvalidEmailAddress,
        });
        return;
    }
    // check if email already exist
    const existingEmail = yield userModel_1.default.findOne({ email: req.body.email });
    if (existingEmail) {
        res.status(400).json({
            message: "Email already exist.",
            code: errorCodes_1.ErrorCodes.EmailAlreadyExists,
        });
        return;
    }
    if (!(0, validation_1.validateField)(password, 8)) {
        res.status(400).json({
            message: "Minimum password length is 8 characters.",
            code: errorCodes_1.ErrorCodes.PasswordTooShort,
        });
        return;
    }
    // hash password
    password = yield bcrypt_1.default.hash(password, 10);
    // saving the user if all validation is accepted
    try {
        const user = new userModel_1.default({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: password,
        });
        user.save();
        res.status(201).json({
            message: "New user account created.",
        });
    }
    catch (error) {
        throw new Error(String(error));
    }
});
exports.createNewAccount = createNewAccount;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // extracting email and password
    const { email = "", password = "" } = req.body;
    // check if email and password is empty
    if (!(0, validation_1.validateField)(email) || !(0, validation_1.validateField)(password)) {
        res.status(400).json({
            message: "Email and Password is required.",
            code: errorCodes_1.ErrorCodes.EmailOrPasswordIsMissing,
        });
        return;
    }
    // check if email exists
    const account = (yield userModel_1.default.findOne({ email }));
    if (!account) {
        res.status(400).json({
            message: "Email doesn't exist.",
            code: errorCodes_1.ErrorCodes.EmailNotFound,
        });
        return;
    }
    // check if password matched
    const isPasswordMatched = yield bcrypt_1.default.compare(password, account.password);
    if (!isPasswordMatched) {
        res.status(401).json({
            message: "Password doesn't match.",
            code: errorCodes_1.ErrorCodes.IncorrectPassword,
        });
        return;
    }
    // generate token if no error occurred
    (0, token_1.generateToken)(res, {
        userId: account._id,
        role: account.role,
        isEmailVerified: account.isEmailVerified,
    }, (0, token_2.getAccessToken)());
    res.status(200).send({ message: "User successfully logged in." });
});
exports.loginUser = loginUser;
const logoutUser = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, token_1.clearToken)(res);
    res.status(200).json({ message: "Logged out successfully" });
});
exports.logoutUser = logoutUser;
const isAuthenticated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // this function will run if authenticate middleware passes the validation
    const account = req.body.account;
    if (account) {
        res.status(200).json({
            isAuthenticated: true,
            role: account.role,
            isEmailVerified: account.isEmailVerified,
        });
    }
    else {
        // if account is empty
        res.status(200).json({ isAuthenticated: false });
    }
});
exports.isAuthenticated = isAuthenticated;
