"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["EmailNotFound"] = 100] = "EmailNotFound";
    ErrorCodes[ErrorCodes["IncorrectPassword"] = 101] = "IncorrectPassword";
    ErrorCodes[ErrorCodes["EmailOrPasswordIsMissing"] = 102] = "EmailOrPasswordIsMissing";
    ErrorCodes[ErrorCodes["FirstNameMissing"] = 103] = "FirstNameMissing";
    ErrorCodes[ErrorCodes["LastNameMissing"] = 104] = "LastNameMissing";
    ErrorCodes[ErrorCodes["EmailMissing"] = 105] = "EmailMissing";
    ErrorCodes[ErrorCodes["InvalidEmailAddress"] = 106] = "InvalidEmailAddress";
    ErrorCodes[ErrorCodes["PasswordTooShort"] = 108] = "PasswordTooShort";
    ErrorCodes[ErrorCodes["EmailAlreadyExists"] = 109] = "EmailAlreadyExists";
    ErrorCodes[ErrorCodes["EmailAlreadyVerified"] = 110] = "EmailAlreadyVerified";
    ErrorCodes[ErrorCodes["VerificationCodeRequestLimit"] = 111] = "VerificationCodeRequestLimit";
    ErrorCodes[ErrorCodes["VerificationCodeMissing"] = 112] = "VerificationCodeMissing";
    ErrorCodes[ErrorCodes["VerificationCodeExpired"] = 113] = "VerificationCodeExpired";
    ErrorCodes[ErrorCodes["VerificationCodeIncorrect"] = 114] = "VerificationCodeIncorrect";
    ErrorCodes[ErrorCodes["PasswordMissing"] = 115] = "PasswordMissing";
    ErrorCodes[ErrorCodes["NoFieldsToUpdate"] = 116] = "NoFieldsToUpdate";
    ErrorCodes[ErrorCodes["DataExceedsMaximumLimit"] = 117] = "DataExceedsMaximumLimit";
    ErrorCodes[ErrorCodes["TaskIDMissing"] = 118] = "TaskIDMissing";
    ErrorCodes[ErrorCodes["Unauthorized"] = 119] = "Unauthorized";
    ErrorCodes[ErrorCodes["UserIDRequired"] = 120] = "UserIDRequired";
    ErrorCodes[ErrorCodes["UserNotFound"] = 121] = "UserNotFound";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
