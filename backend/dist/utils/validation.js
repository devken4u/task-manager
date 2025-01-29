"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateField = validateField;
function validateField(field, minLength = 0, maxLength = 0) {
    // is empty
    if (field.trim().length === 0) {
        return false;
    }
    // is greater than min length
    if (field.trim().length < minLength && minLength > 0) {
        return false;
    }
    // is greater than max length
    if (field.trim().length > maxLength && maxLength > 0) {
        return false;
    }
    return true;
}
