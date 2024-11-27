import HttpException from './http.exception';
import {ValidationResult} from '../types';

export default class ValidationException extends HttpException {
  constructor(public readonly errors: ValidationResult) {
    super(422, 'Validation failed');
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}