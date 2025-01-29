"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCode = void 0;
const generateCode = (min = 1000, max = 8999) => {
    return Math.floor(Math.random() * max) + min;
};
exports.generateCode = generateCode;
