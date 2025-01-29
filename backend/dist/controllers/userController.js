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
exports.createNewAdminAccount = exports.getAdminList = exports.deleteUser = exports.getUserList = exports.checkChangePasswordVerificationCode = exports.requestChangePasswordVerificationCode = exports.checkEmailIfExisting = exports.updateUserName = exports.getUserInformation = exports.isAuthenticated = exports.logoutUser = exports.loginUser = exports.createNewAccount = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../models/userModel"));
const validation_1 = require("../utils/validation");
const token_1 = require("../utils/token");
const errorCodes_1 = require("../enum/errorCodes");
const token_2 = require("../utils/token");
const verificationCodeModel_1 = __importDefault(require("../models/verificationCodeModel"));
const verificationCode_1 = require("../utils/verificationCode");
const taskModel_1 = __importDefault(require("../models/taskModel"));
const verificationCodeRequestCooldown = Number(process.env.VERIFICATION_CODE_REQUEST_COOLDOWN_IN_MINUTE) || 1; //default is 1 minute
const createNewAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // extracting fields
    let { firstname = "", lastname = "", email = "", password = "" } = req.body;
    // validate every fields
    if (!(0, validation_1.validateField)(firstname, 0, 50)) {
        res.status(400).json({
            message: "First name is required or invalid.",
            code: errorCodes_1.ErrorCodes.FirstNameMissing,
        });
        return;
    }
    if (!(0, validation_1.validateField)(lastname, 0, 50)) {
        res.status(400).json({
            message: "Last name is required or invalid.",
            code: errorCodes_1.ErrorCodes.LastNameMissing,
        });
        return;
    }
    if (!(0, validation_1.validateField)(email, 0, 254)) {
        res.status(400).json({
            message: "Email address is required opr invalid.",
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
const createNewAdminAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // extracting fields
    let { firstname = "", lastname = "", email = "", password = "", role = "", } = req.body;
    if (role !== "admin" && role !== "super-admin") {
        res.status(401).json({
            message: "Invalid role.",
            code: errorCodes_1.ErrorCodes.Unauthorized,
        });
        return;
    }
    if (!(0, validation_1.validateField)(firstname, 0, 50)) {
    }
    if (!(0, validation_1.validateField)(lastname, 0, 50)) {
        res.status(400).json({
            message: "Last name is required or invalid.",
            code: errorCodes_1.ErrorCodes.LastNameMissing,
        });
        return;
    }
    if (!(0, validation_1.validateField)(email, 0, 254)) {
        res.status(400).json({
            message: "Email address is required opr invalid.",
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
            role: role,
            isEmailVerified: true,
        });
        user.save();
        res.status(201).json({
            message: "New admin account created.",
        });
    }
    catch (error) {
        throw new Error(String(error));
    }
});
exports.createNewAdminAccount = createNewAdminAccount;
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
const getUserInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        email: req.body.account.email,
        firstname: req.body.account.firstname,
        lastname: req.body.account.lastname,
        role: req.body.account.role,
    });
});
exports.getUserInformation = getUserInformation;
const updateUserName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname = "", lastname = "" } = req.body;
    const account = req.body.account;
    const toUpdateFields = {};
    if (!firstname && !lastname) {
        res.status(400).json({
            message: "No fields to update.",
            code: errorCodes_1.ErrorCodes.NoFieldsToUpdate,
        });
        return;
    }
    if (firstname.length > 50 || lastname.length) {
        res.status(400).json({
            message: "Field data is too long.",
            code: errorCodes_1.ErrorCodes.DataExceedsMaximumLimit,
        });
        return;
    }
    if (firstname)
        toUpdateFields.firstname = firstname;
    if (lastname)
        toUpdateFields.lastname = lastname;
    yield userModel_1.default.updateOne({ email: account.email }, { $set: toUpdateFields });
    res.status(200).json({
        message: "User name updated successfully.",
    });
});
exports.updateUserName = updateUserName;
const checkEmailIfExisting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    if (!email) {
        res.status(400).json({
            message: "Email is required.",
            code: errorCodes_1.ErrorCodes.EmailMissing,
        });
        return;
    }
    const account = yield userModel_1.default.findOne({ email: email });
    if (account) {
        res.status(200).json({
            message: "Email is existing.",
            isEmailFound: true,
        });
        return;
    }
    else {
        res.status(400).json({
            message: "Email not found.",
            isEmailFound: false,
            code: errorCodes_1.ErrorCodes.EmailNotFound,
        });
        return;
    }
});
exports.checkEmailIfExisting = checkEmailIfExisting;
const requestChangePasswordVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email = "" } = req.body;
    // check if email is empty
    if (!email) {
        res.status(400).json({
            message: "Email is required.",
            code: errorCodes_1.ErrorCodes.EmailMissing,
        });
        return;
    }
    // check if email is existing
    const account = yield userModel_1.default.findOne({ email: email });
    if (!account) {
        res.status(400).json({
            message: "Email not found.",
            isEmailFound: false,
            code: errorCodes_1.ErrorCodes.EmailNotFound,
        });
        return;
    }
    // check if there is a pending request verification code for that account
    const verificationInformation = yield verificationCodeModel_1.default.findOne({
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
            yield verificationCodeModel_1.default.findOneAndDelete({
                _id: verificationInformation._id,
            });
            (0, verificationCode_1.processVerificationCode)(email, "change-password", "Change Password");
            res.status(200).json({
                message: "Change password verification code sent.",
                email: email,
                cooldown: verificationCodeRequestCooldown * 60,
            });
        }
        else {
            res.status(400).json({
                message: "Request verification code again later.",
                code: errorCodes_1.ErrorCodes.VerificationCodeRequestLimit,
                email: email,
                cooldown: verificationCodeRequestCooldown * 60 - Math.floor(elapsedSeconds),
            });
            return;
        }
    }
    else {
        // there is no pending code in the database
        // process a new one
        (0, verificationCode_1.processVerificationCode)(email, "change-password", "Change Password");
        res.status(200).json({
            message: "Change password verification code sent.",
            email: email,
            cooldown: verificationCodeRequestCooldown * 60,
        });
    }
});
exports.requestChangePasswordVerificationCode = requestChangePasswordVerificationCode;
const checkChangePasswordVerificationCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password = "" } = req.body;
    const account = req.body.account;
    if (!password) {
        res.status(400).json({
            message: "Password is missing",
            code: errorCodes_1.ErrorCodes.PasswordMissing,
        });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({
            message: "Minimum password length is 8 characters.",
            code: errorCodes_1.ErrorCodes.PasswordTooShort,
        });
        return;
    }
    const newPassword = yield bcrypt_1.default.hash(password, 10);
    yield userModel_1.default.updateOne({ email: account.email }, { $set: { password: newPassword } });
    // delete the used code
    yield verificationCodeModel_1.default.findOneAndDelete({
        email: account.email,
        purpose: "change-password",
    });
    res.status(200).json({
        message: "Password successfully changed.",
    });
});
exports.checkChangePasswordVerificationCode = checkChangePasswordVerificationCode;
const getUserList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemPerPage, currentPage, similar } = req.query;
    const sortBy = req.query.sortBy || "createdAt";
    const userInformationList = [];
    try {
        const userList = yield userModel_1.default.find({
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
        const totalUser = yield userModel_1.default.countDocuments({
            role: "user",
            $or: [
                { email: { $regex: similar, $options: "i" } },
                { firstname: { $regex: similar, $options: "i" } },
                { lastname: { $regex: similar, $options: "i" } },
            ],
        });
        for (const user of userList) {
            const totalTask = yield taskModel_1.default.countDocuments({ userId: user._id });
            userInformationList.push({
                _id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname || "",
                isEmailVerified: user.isEmailVerified,
                role: user.role,
                totalTask: totalTask,
            });
        }
        res.status(200).json({ userInformationList, totalUser });
    }
    catch (e) {
        res.status(500).send("An unexpected occurred in the server.");
    }
});
exports.getUserList = getUserList;
const getAdminList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const account = req.body.account;
    if (account.role !== "super-admin") {
        res.status(401).send({
            code: errorCodes_1.ErrorCodes.Unauthorized,
            message: "Unauthorized resources.",
        });
        return;
    }
    const { itemPerPage, currentPage, similar } = req.query;
    const sortBy = req.query.sortBy || "createdAt";
    const adminInformationList = [];
    try {
        const adminList = yield userModel_1.default.find({
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
        const totalAdmin = yield userModel_1.default.countDocuments({
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
            const totalTask = yield taskModel_1.default.countDocuments({ userId: user._id });
            adminInformationList.push({
                _id: user._id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname || "",
                isEmailVerified: user.isEmailVerified,
                role: user.role,
                totalTask: totalTask,
            });
        }
        res.status(200).json({ adminInformationList, totalAdmin });
    }
    catch (e) {
        res.status(500).send("An unexpected occurred in the server.");
    }
});
exports.getAdminList = getAdminList;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({
            message: "Password is missing",
            code: errorCodes_1.ErrorCodes.UserIDRequired,
        });
        return;
    }
    try {
        const deletedUser = yield userModel_1.default.findOneAndDelete({ _id: userId });
        if (deletedUser) {
            res.status(200).json({
                message: "User successfully deleted.",
            });
        }
        else {
            res.status(400).json({
                message: "User not found",
                code: errorCodes_1.ErrorCodes.UserNotFound,
            });
        }
    }
    catch (_a) {
        res.status(500).send("An unexpected occurred in the server.");
    }
});
exports.deleteUser = deleteUser;
