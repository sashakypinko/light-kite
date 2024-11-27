"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../exceptions");
const validation_exception_1 = __importDefault(require("../exceptions/validation.exception"));
const handleErrorsMiddleware = (error, req, res, next) => {
    if (error instanceof validation_exception_1.default) {
        res.status(error.statusCode).json({ success: false, errors: error.errors });
    }
    else if (error instanceof exceptions_1.HttpException) {
        res.status(error.statusCode).json({ success: false, error: error.message });
    }
    else {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
exports.default = handleErrorsMiddleware;
