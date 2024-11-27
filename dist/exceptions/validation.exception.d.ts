import HttpException from './http.exception';
import { ValidationResult } from '../types';
export default class ValidationException extends HttpException {
    readonly errors: ValidationResult;
    constructor(errors: ValidationResult);
}
