import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { RateLimitError } from '../utils/errors';

// Rate limiting configuration
export const rateLimiter = {
  // General API rate limit
  api: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    handler: (req: Request, res: Response) => {
      throw new RateLimitError();
    }
  }),

  // Auth endpoints rate limit
  auth: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later',
    handler: (req: Request, res: Response) => {
      throw new RateLimitError('Too many authentication attempts');
    }
  })
};

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://shareplate.com',
      'https://api.shareplate.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // 10 minutes
};

// Security headers using helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.shareplate.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
});

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

// Data sanitization against NoSQL query injection
export const sanitizeMongoQueries = mongoSanitize();

// Request sanitization middleware
export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim().escape();
      }
    });
  }

  // Sanitize request query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string).trim().escape();
      }
    });
  }

  next();
};

// Security middleware chain
export const securityMiddleware = [
  // Security headers
  securityHeaders,

  // CORS
  cors(corsOptions),

  // Rate limiting
  rateLimiter.api,

  // Request size limiting
  requestSizeLimiter,

  // Data sanitization against NoSQL query injection
  sanitizeMongoQueries,

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
]; 