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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccountFields = void 0;
const validateField_1 = require("../utils/validateField");
const validateAccountFields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // extracting fields
    const { firstName = "", lastName = "", email = "", password = "" } = req.body;
    // check fields if empty and matches the min and max length
    const missingFields = [];
    if (!(0, validateField_1.validateField)(firstName, 0, 50)) {
        missingFields.push("firstName");
    }
    if (!(0, validateField_1.validateField)(lastName, 0, 50)) {
        missingFields.push("lastName");
    }
    if (!(0, validateField_1.validateField)(email)) {
        missingFields.push("email");
    }
    if (!(0, validateField_1.validateField)(password, 8)) {
        missingFields.push("password");
    }
    // send error code if there fields that is missing or invalid
    if (missingFields.length > 0) {
        res.status(400).json({
            message: "There are missing or invalid required fields.",
            missingFields: [...missingFields],
        });
        return;
    }
    next();
});
exports.validateAccountFields = validateAccountFields;
