import {ValidationError} from 'class-validator';
import {ValidationResult} from '../types';

export const convertValidationErrors = (errors: ValidationError[]): ValidationResult => {
  const result: ValidationResult = {};

  errors.forEach((error) => {
    if (error.constraints) {
      result[error.property] = Object.values(error.constraints)[0];
    }
  });

  return result;
}