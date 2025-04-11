import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { User } from '../models/user';
import { body } from 'express-validator';
import { AuthService } from '../services/auth.service';
import { validate } from '../middleware/validate';
import { rateLimiter } from '../middleware/security';
import { commonValidations } from '../middleware/validate';
import { AuthenticationError } from '../utils/errors';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

// Registration validation
const registerValidation = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Register route
router.post('/register',
  rateLimiter.auth,
  validate(registerValidation),
  async (req, res, next) => {
    try {
      const { email, password, name } = req.body;

      // Create user
      const user = await User.create({
        email,
        password,
        name,
        isEmailVerified: false
      });

      // Generate verification token
      const verificationToken = await AuthService.generateVerificationToken(user._id);

      // Generate auth tokens
      const tokens = await AuthService.generateAuthTokens(user._id);

      // TODO: Send verification email

      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isEmailVerified: user.isEmailVerified
        },
        tokens
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login route
router.post('/login',
  rateLimiter.auth,
  validate(loginValidation),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new AuthenticationError('Invalid credentials');
      }

      const tokens = await AuthService.generateAuthTokens(user._id);

      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          isEmailVerified: user.isEmailVerified
        },
        tokens
      });
    } catch (error) {
      next(error);
    }
  }
);

// Refresh token route
router.post('/refresh-token',
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AuthenticationError('Refresh token is required');
      }

      const tokens = await AuthService.refreshAuth(refreshToken);
      res.json({ tokens });
    } catch (error) {
      next(error);
    }
  }
);

// Logout route
router.post('/logout',
  async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

// Verify email route
router.get('/verify-email/:token',
  async (req, res, next) => {
    try {
      const { token } = req.params;
      await AuthService.verifyEmail(token);
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Request password reset route
router.post('/forgot-password',
  rateLimiter.auth,
  validate([body('email').isEmail()]),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const resetToken = await AuthService.generateResetToken(email);
      // TODO: Send password reset email
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      next(error);
    }
  }
);

// Reset password route
router.post('/reset-password/:token',
  rateLimiter.auth,
  validate([body('password').isLength({ min: 8 })]),
  async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      await AuthService.resetPassword(token, password);
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res, next) => {
    try {
      const tokens = await AuthService.generateAuthTokens(req.user.id);
      res.redirect(`${process.env.FRONTEND_URL}/auth-callback?tokens=${encodeURIComponent(JSON.stringify(tokens))}`);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  async (req, res, next) => {
    try {
      const tokens = await AuthService.generateAuthTokens(req.user.id);
      res.redirect(`${process.env.FRONTEND_URL}/auth-callback?tokens=${encodeURIComponent(JSON.stringify(tokens))}`);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/apple',
  passport.authenticate('apple', { scope: ['name', 'email'] })
);

router.get('/apple/callback',
  passport.authenticate('apple', { session: false }),
  async (req, res, next) => {
    try {
      const tokens = await AuthService.generateAuthTokens(req.user.id);
      res.redirect(`${process.env.FRONTEND_URL}/auth-callback?tokens=${encodeURIComponent(JSON.stringify(tokens))}`);
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, authConfig.jwt.secret) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error getting user data' });
  }
});

export default router; 