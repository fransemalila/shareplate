import nodemailer from 'nodemailer';
import { IUser } from '../models/user';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  private static async sendEmail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'SharePlate <noreply@shareplate.com>',
      to,
      subject,
      html
    };

    return this.transporter.sendMail(mailOptions);
  }

  static async sendVerificationEmail(user: IUser, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const html = `
      <h1>Welcome to SharePlate!</h1>
      <p>Hi ${user.name},</p>
      <p>Thank you for registering with SharePlate. Please verify your email address by clicking the button below:</p>
      <p>
        <a href="${verificationUrl}" style="
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;
        ">
          Verify Email
        </a>
      </p>
      <p>Or copy and paste this link in your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account with SharePlate, please ignore this email.</p>
      <p>Best regards,<br>The SharePlate Team</p>
    `;

    return this.sendEmail(user.email, 'Verify your email address', html);
  }

  static async sendPasswordResetEmail(user: IUser, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const html = `
      <h1>Reset Your Password</h1>
      <p>Hi ${user.name},</p>
      <p>You requested to reset your password. Click the button below to create a new password:</p>
      <p>
        <a href="${resetUrl}" style="
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 15px 32px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;
        ">
          Reset Password
        </a>
      </p>
      <p>Or copy and paste this link in your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Best regards,<br>The SharePlate Team</p>
    `;

    return this.sendEmail(user.email, 'Reset your password', html);
  }

  static async sendWelcomeEmail(user: IUser) {
    const html = `
      <h1>Welcome to SharePlate!</h1>
      <p>Hi ${user.name},</p>
      <p>Thank you for joining SharePlate. We're excited to have you as part of our community!</p>
      <p>With SharePlate, you can:</p>
      <ul>
        <li>Share your delicious food with others</li>
        <li>Discover amazing homemade meals</li>
        <li>Connect with food lovers in your area</li>
        <li>Reduce food waste and help the environment</li>
      </ul>
      <p>Get started by:</p>
      <ol>
        <li>Completing your profile</li>
        <li>Browsing available listings</li>
        <li>Creating your first food listing</li>
      </ol>
      <p>If you have any questions, our support team is here to help!</p>
      <p>Best regards,<br>The SharePlate Team</p>
    `;

    return this.sendEmail(user.email, 'Welcome to SharePlate!', html);
  }

  static async sendOrderConfirmation(user: IUser, order: any) {
    const html = `
      <h1>Order Confirmation</h1>
      <p>Hi ${user.name},</p>
      <p>Your order has been confirmed!</p>
      <p>Order details:</p>
      <ul>
        <li>Order ID: ${order.id}</li>
        <li>Item: ${order.item.title}</li>
        <li>Quantity: ${order.quantity}</li>
        <li>Total: $${order.total.toFixed(2)}</li>
        <li>Pickup time: ${new Date(order.pickupTime).toLocaleString()}</li>
        <li>Location: ${order.location}</li>
      </ul>
      <p>Please make sure to pick up your order at the specified time.</p>
      <p>Best regards,<br>The SharePlate Team</p>
    `;

    return this.sendEmail(user.email, 'Order Confirmation - SharePlate', html);
  }
} 