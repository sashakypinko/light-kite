import { ValidationError } from 'class-validator';
import { ValidationResult } from '../types';
export declare const convertValidationErrors: (errors: ValidationError[]) => ValidationResult;
