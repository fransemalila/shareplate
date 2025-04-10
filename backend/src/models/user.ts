import mongoose from 'mongoose';

interface UserSettings {
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacy?: {
    profileVisibility?: 'public' | 'private';
    showEmail?: boolean;
    showPhone?: boolean;
  };
  preferences?: {
    language?: string;
    currency?: string;
    theme?: 'light' | 'dark';
  };
}

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  isPhoneVerified?: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  role: 'user' | 'admin' | 'moderator';
  settings?: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
    },
    preferences: {
      language: { type: String, default: 'en' },
      currency: { type: String, default: 'USD' },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    },
  },
}, {
  timestamps: true,
});

// Remove sensitive information when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpires;
  return user;
};

export const User = mongoose.model<IUser>('User', userSchema); 