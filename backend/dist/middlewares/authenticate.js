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
exports.authenticateAdmin = exports.authenticate = void 0;
const token_1 = require("../utils/token");
const userModel_1 = __importDefault(require("../models/userModel"));
const errorCodes_1 = require("../enum/errorCodes");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the token from cookies
    const token = req.cookies.jwt;
    // check if token is empty
    if (!token) {
        res.status(200).json({ isAuthenticated: false });
        return;
    }
    // check if token is valid
    const payload = (0, token_1.checkToken)(token, (0, token_1.getAccessToken)());
    if (!payload) {
        res.status(200).json({ isAuthenticated: false });
        return;
    }
    // find the account
    const account = yield userModel_1.default.findById(payload.userId, { password: 0 });
    if (account) {
        // if account is found store it in the body
        req.body.account = account;
        next();
    }
    else {
        // if account is not found
        res.status(200).json({ isAuthenticated: false });
        return;
    }
});
exports.authenticate = authenticate;
const authenticateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const account = req.body.account;
    if (account.role !== "super-admin" && account.role !== "admin") {
        res.status(401).send({
            code: errorCodes_1.ErrorCodes.Unauthorized,
            message: "Unauthorized resources.",
        });
        return;
    }
    next();
});
exports.authenticateAdmin = authenticateAdmin;
