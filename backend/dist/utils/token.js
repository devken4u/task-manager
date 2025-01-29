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
exports.getAccessToken = exports.generateToken = exports.checkToken = exports.clearToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const clearToken = (res) => __awaiter(void 0, void 0, void 0, function* () {
    // set the cookie named jwt as empty
    // this means that the user is logged out
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
});
exports.clearToken = clearToken;
const checkToken = (token, accessToken) => {
    // verify if the token is valid
    const account = jsonwebtoken_1.default.verify(token, accessToken);
    // check if account has value and returning it if it has
    if (account) {
        return {
            userId: account.userId,
            role: account.role,
            isEmailVerified: account.isEmailVerified,
        };
    }
    // return undefined if token is invalid
    return undefined;
};
exports.checkToken = checkToken;
const generateToken = (res, payload, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    // generate the token with the payload
    const token = jsonwebtoken_1.default.sign({
        userId: payload.userId,
        role: payload.role,
        IsEmailVerified: payload.isEmailVerified,
    }, accessToken, {
        expiresIn: "30d",
    });
    // set the cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
});
exports.generateToken = generateToken;
// temp function
const getAccessToken = () => {
    const accessToken = process.env.ACCESS_TOKEN;
    if (!accessToken) {
        throw new Error("Access token is undefined.");
    }
    return accessToken;
};
exports.getAccessToken = getAccessToken;
