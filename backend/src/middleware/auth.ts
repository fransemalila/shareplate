import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { AuthenticationError, AuthorizationError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: any;
  token?: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AuthenticationError('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    const user = await User.findById(decoded.sub).select('-password');

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (user.status !== 'active') {
      throw new AuthorizationError('Account is not active');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else {
      next(error);
    }
  }
};

export const requireRoles = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

export const requireVerifiedEmail = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (!req.user.isEmailVerified) {
    throw new AuthorizationError('Email verification required');
  }

  next();
};

export const requireVerifiedPhone = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (!req.user.isPhoneVerified) {
    throw new AuthorizationError('Phone verification required');
  }

  next();
};

export const requireTwoFactorAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (req.user.twoFactorAuth && !req.session.twoFactorVerified) {
    throw new AuthorizationError('Two-factor authentication required');
  }

  next();
}; 