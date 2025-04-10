import rateLimit from 'express-rate-limit';
import { logWarn } from '../utils/logger';

// Create different rate limiters for different routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
  handler: (req, res) => {
    logWarn(`Rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per windowMs
  message: 'Too many requests, please try again after a minute',
  handler: (req, res) => {
    logWarn(`Rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.'
    });
  }
});

// Special limiter for sensitive operations
export const sensitiveOpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many sensitive operations, please try again after an hour',
  handler: (req, res) => {
    logWarn(`Sensitive operation rate limit exceeded for IP ${req.ip}`);
    res.status(429).json({
      error: 'Too many sensitive operations, please try again later.'
    });
  }
}); 