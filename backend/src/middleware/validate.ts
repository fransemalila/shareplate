import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/errors';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));

    throw new ValidationError('Validation failed', extractedErrors);
  };
};

// Common validation chains
export const commonValidations = {
  email: {
    isEmail: {
      errorMessage: 'Must be a valid email address'
    },
    normalizeEmail: true
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long'
    },
    matches: {
      options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
      errorMessage: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  name: {
    trim: true,
    notEmpty: {
      errorMessage: 'Name cannot be empty'
    },
    isLength: {
      options: { min: 2, max: 50 },
      errorMessage: 'Name must be between 2 and 50 characters'
    }
  },
  phoneNumber: {
    optional: true,
    isMobilePhone: {
      options: 'any',
      errorMessage: 'Must be a valid phone number'
    }
  }
}; 