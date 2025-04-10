import { Request, Response } from 'express';
import { User } from '../models/user';

interface AuthRequest extends Request {
  user?: any;
}

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and not already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
      user.isEmailVerified = false; // Require re-verification for new email
    }

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Get user settings
export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.settings || {});
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
};

// Update user settings
export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { notifications, privacy, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize settings object if it doesn't exist
    if (!user.settings) {
      user.settings = {};
    }

    // Update only provided settings
    if (notifications) user.settings.notifications = notifications;
    if (privacy) user.settings.privacy = privacy;
    if (preferences) user.settings.preferences = preferences;

    await user.save();
    res.json(user.settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
}; 