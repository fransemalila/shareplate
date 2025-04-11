import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

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
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors,
      code: err.statusCode,
    });
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: Object.values(err).map((e: any) => ({
        field: e.path,
        message: e.message,
      })),
      code: 400,
    });
  }

  // Handle mongoose duplicate key errors
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'Duplicate field value entered',
      code: 409,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token',
      code: 401,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired',
      code: 401,
    });
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      code: 400,
    });
  }

  // If in development, send error details
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      status: 'error',
      message: err.message,
      stack: err.stack,
      code: 500,
    });
  }

  // Production error - don't leak error details
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    code: 500,
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