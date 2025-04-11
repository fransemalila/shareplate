import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user';
import { Token } from '../models/token';
import { AuthenticationError, ValidationError } from '../utils/errors';
import { IUser } from '../models/user';
import { IToken } from '../models/token';

export class AuthService {
  private static readonly ACCESS_TOKEN_EXPIRES = '15m';
  private static readonly REFRESH_TOKEN_EXPIRES = '7d';
  private static readonly VERIFICATION_TOKEN_EXPIRES = '24h';
  private static readonly RESET_TOKEN_EXPIRES = '1h';

  /**
   * Generate tokens for a user
   */
  static async generateAuthTokens(userId: string) {
    const accessToken = jwt.sign(
      { sub: userId },
      process.env.JWT_SECRET!,
      { expiresIn: this.ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // 7 days

    await Token.create({
      token: refreshToken,
      userId,
      type: 'refresh',
      expires: refreshTokenExpires
    });

    return {
      access: {
        token: accessToken,
        expires: this.ACCESS_TOKEN_EXPIRES
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires
      }
    };
  }

  /**
   * Verify email verification token
   */
  static async verifyEmail(token: string) {
    const verificationToken = await Token.findOne({
      token,
      type: 'verification',
      blacklisted: false
    });

    if (!verificationToken) {
      throw new AuthenticationError('Invalid or expired verification token');
    }

    // Update user and invalidate token
    await Promise.all([
      User.findByIdAndUpdate(verificationToken.userId, { isEmailVerified: true }),
      Token.findByIdAndUpdate(verificationToken._id, { blacklisted: true })
    ]);

    return true;
  }

  /**
   * Generate email verification token
   */
  static async generateVerificationToken(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // 24 hours

    await Token.create({
      token,
      userId,
      type: 'verification',
      expires
    });

    return token;
  }

  /**
   * Refresh access token
   */
  static async refreshAuth(refreshToken: string) {
    const refreshTokenDoc = await Token.findOne({
      token: refreshToken,
      type: 'refresh',
      blacklisted: false
    });

    if (!refreshTokenDoc) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // Generate new tokens
    const tokens = await this.generateAuthTokens(refreshTokenDoc.userId.toString());

    // Invalidate old refresh token
    await Token.findByIdAndUpdate(refreshTokenDoc._id, { blacklisted: true });

    return tokens;
  }

  /**
   * Generate password reset token
   */
  static async generateResetToken(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ValidationError('No user found with this email');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour

    await Token.create({
      token,
      userId: user._id,
      type: 'reset',
      expires
    });

    return token;
  }

  /**
   * Reset password
   */
  static async resetPassword(token: string, newPassword: string) {
    const resetToken = await Token.findOne({
      token,
      type: 'reset',
      blacklisted: false
    });

    if (!resetToken) {
      throw new AuthenticationError('Invalid or expired reset token');
    }

    // Update password and invalidate token
    await Promise.all([
      User.findByIdAndUpdate(resetToken.userId, { password: newPassword }),
      Token.findByIdAndUpdate(resetToken._id, { blacklisted: true })
    ]);

    return true;
  }

  /**
   * Logout user
   */
  static async logout(refreshToken: string) {
    const token = await Token.findOne({ token: refreshToken, type: 'refresh' });
    if (token) {
      await Token.findByIdAndUpdate(token._id, { blacklisted: true });
    }
  }

  /**
   * Clean up expired tokens
   */
  static async cleanupTokens() {
    const now = new Date();
    await Token.deleteMany({
      expires: { $lt: now }
    });
  }
} 