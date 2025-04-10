import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'https://shareplate.com']
    : ['http://localhost:3003'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // 10 minutes
};

// Helmet configuration for security headers
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", process.env.API_URL || 'http://localhost:8005'],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
};

// Request size limiter middleware
const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
  const MAX_CONTENT_LENGTH = 10 * 1024 * 1024; // 10MB
  
  if (req.headers['content-length']) {
    const contentLength = parseInt(req.headers['content-length'], 10);
    if (contentLength > MAX_CONTENT_LENGTH) {
      return next(new AppError(413, 'Request entity too large'));
    }
  }
  next();
};

// Security middleware chain
export const securityMiddleware = [
  // Basic security headers
  helmet(helmetConfig),

  // CORS
  cors(corsOptions),

  // Rate limiting
  limiter,

  // Request size limiting
  requestSizeLimiter,

  // Data sanitization against NoSQL query injection
  mongoSanitize(),

  // Prevent parameter pollution
  hpp({
    whitelist: [
      'price',
      'rating',
      'category',
      'tags',
      'sort',
      'fields',
      'page',
      'limit'
    ]
  }),

  // Custom security middleware
  (req: Request, res: Response, next: NextFunction) => {
    // Remove powered by header
    res.removeHeader('X-Powered-By');
    
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(self), payment=(self)'
    );

    next();
  }
]; 