"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = __importDefault(require("./http.exception"));
class UnauthorizedException extends http_exception_1.default {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}
exports.default = UnauthorizedException;
