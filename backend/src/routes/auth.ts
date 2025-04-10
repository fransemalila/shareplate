import { Router } from 'express';
import { body } from 'express-validator';
import { login, register, forgotPassword, resetPassword, verifyEmail, refreshToken } from '../controllers/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Register user
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],
  validateRequest,
  register
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

// Forgot password
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  forgotPassword
);

// Reset password
router.post(
  '/reset-password/:token',
  [
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage('Password must be between 6 and 20 characters'),
  ],
  validateRequest,
  resetPassword
);

// Verify email
router.get('/verify-email/:token', verifyEmail);

// Refresh token
router.post('/refresh-token', refreshToken);

export default router; 