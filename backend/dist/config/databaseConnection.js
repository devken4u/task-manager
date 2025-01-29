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
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
// fetch the mongo db uri from the environment variables
const connectionString = process.env.MONGO_URI;
const databaseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // check if connection string is empty
        // if empty throw an error
        if (!connectionString) {
            throw new Error("MONGO_URI is not defined in the environment variables");
        }
        yield mongoose_1.default.connect(connectionString);
        console.log(`Successfully connected to database -> ${connectionString}`);
    }
    catch (error) {
        // throw an error if any other problems occur
        throw error;
    }
});
exports.default = databaseConnection;
