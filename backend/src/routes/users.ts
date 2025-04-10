import { Router } from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, updateSettings, getSettings } from '../controllers/users';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.patch(
  '/profile',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
    body('phoneNumber').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
  ],
  validateRequest,
  updateProfile
);

// Get user settings
router.get('/settings', getSettings);

// Update user settings
router.patch(
  '/settings',
  [
    body('notifications').optional().isObject().withMessage('Notifications must be an object'),
    body('privacy').optional().isObject().withMessage('Privacy settings must be an object'),
    body('preferences').optional().isObject().withMessage('Preferences must be an object'),
  ],
  validateRequest,
  updateSettings
);

export default router; 