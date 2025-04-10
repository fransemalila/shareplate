import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

interface ErrorResponse {
  status: 'error' | 'fail';
  message: string;
  stack?: string;
  errors?: ValidationError[] | null;
}

const handleValidationError = (err: ValidationError[]): AppError => {
  const message = `Invalid input: ${err.map(e => e.msg).join(', ')}`;
  return new AppError(400, message);
};

const handleDuplicateKeyError = (err: any): AppError => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: ${field}. Please use another value.`;
  return new AppError(400, message);
};

const handleCastError = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleJWTError = (): AppError => 
  new AppError(401, 'Invalid token. Please log in again.');

const handleJWTExpiredError = (): AppError => 
  new AppError(401, 'Your token has expired. Please log in again.');

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err as AppError;
  error.statusCode = error.statusCode || 500;

  // Log error
  logger.error({
    error: {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode
    },
    path: req.path,
    method: req.method,
    requestId: req.id
  });

  if (process.env.NODE_ENV === 'development') {
    const errorResponse: ErrorResponse = {
      status: error.statusCode >= 500 ? 'error' : 'fail',
      message: error.message,
      stack: error.stack,
      errors: null
    };

    if (err instanceof Array && err[0] instanceof ValidationError) {
      error = handleValidationError(err);
      errorResponse.errors = err;
    }

    return res.status(error.statusCode).json(errorResponse);
  }

  // Production error handling
  if (error.isOperational) {
    // Operational, trusted error: send message to client
    return res.status(error.statusCode).json({
      status: error.statusCode >= 500 ? 'error' : 'fail',
      message: error.message
    });
  }

  // Programming or other unknown error: don't leak error details
  logger.error('ERROR 💥:', error);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
};

export const unhandledRejectionHandler = (server: any) => {
  process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

export const uncaughtExceptionHandler = () => {
  process.on('uncaughtException', (err: Error) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
  });
}; 