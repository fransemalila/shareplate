import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Create winston format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Create winston transports
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Create the logger
const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Middleware for HTTP request logging
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.url} ${res.statusCode} ${duration}ms`;
    
    if (res.statusCode >= 500) {
      Logger.error(message);
    } else if (res.statusCode >= 400) {
      Logger.warn(message);
    } else {
      Logger.http(message);
    }
  });

  next();
};

// Export logger methods
export const logError = (message: string, error?: any) => {
  Logger.error(message + (error ? `: ${error.message}` : ''));
  if (error?.stack) {
    Logger.error(error.stack);
  }
};

export const logWarn = (message: string) => {
  Logger.warn(message);
};

export const logInfo = (message: string) => {
  Logger.info(message);
};

export const logDebug = (message: string) => {
  Logger.debug(message);
};

export default Logger; 