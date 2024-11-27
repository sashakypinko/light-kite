"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = __importDefault(require("./http.exception"));
class ValidationException extends http_exception_1.default {
    constructor(errors) {
        super(422, 'Validation failed');
        this.errors = errors;
        Object.setPrototypeOf(this, ValidationException.prototype);
    }
}
exports.default = ValidationException;
