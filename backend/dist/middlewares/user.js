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
exports.getAccount = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const errorCodes_1 = require("../enum/errorCodes");
const getAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email = "" } = req.body;
    if (!email) {
        res.status(400).json({
            message: "Email is missing.",
            code: errorCodes_1.ErrorCodes.EmailMissing,
        });
        return;
    }
    const account = yield userModel_1.default.findOne({ email });
    if (!account) {
        res.status(400).json({
            message: "Email not found.",
            code: errorCodes_1.ErrorCodes.EmailNotFound,
        });
        return;
    }
    req.body.account = account;
    next();
});
exports.getAccount = getAccount;
