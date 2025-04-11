import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

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

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  isEmailVerified: boolean;
  google?: {
    id: string;
    email: string;
  };
  facebook?: {
    id: string;
    email: string;
  };
  apple?: {
    id: string;
    email: string;
  };
  role: 'user' | 'admin' | 'moderator';
  phoneNumber?: string;
  isPhoneVerified: boolean;
  twoFactorAuth: boolean;
  privacySettings: {
    shareEmail: boolean;
    sharePhone: boolean;
    notifications: boolean;
  };
  status: 'active' | 'suspended' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.google && !this.facebook && !this.apple;
    },
    minlength: 8
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  google: {
    id: String,
    email: String
  },
  facebook: {
    id: String,
    email: String
  },
  apple: {
    id: String,
    email: String
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  phoneNumber: String,
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  twoFactorAuth: {
    type: Boolean,
    default: false
  },
  privacySettings: {
    shareEmail: {
      type: Boolean,
      default: false
    },
    sharePhone: {
      type: Boolean,
      default: false
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ 'google.id': 1 });
userSchema.index({ 'facebook.id': 1 });
userSchema.index({ 'apple.id': 1 });
userSchema.index({ status: 1 });

export const User = mongoose.model<IUser>('User', userSchema); 