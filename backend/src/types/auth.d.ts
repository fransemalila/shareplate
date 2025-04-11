import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface User extends Document {
      id: string;
      email: string;
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
    }
  }
}

export interface AuthProfile {
  id: string;
  displayName?: string;
  emails?: Array<{ value: string }>;
  name?: {
    givenName: string;
    familyName: string;
  };
  email?: string;
}

export interface AuthCallback {
  (error: any, user?: any): void;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
} 