"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertValidationErrors = void 0;
const convertValidationErrors = (errors) => {
    const result = {};
    errors.forEach((error) => {
        if (error.constraints) {
            result[error.property] = Object.values(error.constraints)[0];
        }
    });
    return result;
};
exports.convertValidationErrors = convertValidationErrors;
