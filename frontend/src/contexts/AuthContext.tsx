import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../../../shared/src/types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  requestPhoneVerification: (phoneNumber: string) => Promise<string>;
  verifyPhoneCode: (verificationId: string, code: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<Omit<User, 'createdAt' | 'updatedAt'>>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processUserData = (userData: any): User => ({
    ...userData,
    createdAt: new Date(userData.createdAt),
    updatedAt: new Date(userData.updatedAt),
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        api.setAuthToken(token);
        const userData = await api.getCurrentUser();
        setUser(processUserData(userData));
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { token, user: userData } = await api.login(email, password);
      localStorage.setItem('authToken', token);
      api.setAuthToken(token);
      setUser(processUserData(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { token, user: userData } = await api.register(email, password, name);
      localStorage.setItem('authToken', token);
      api.setAuthToken(token);
      setUser(processUserData(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await api.logout();
      localStorage.removeItem('authToken');
      api.setAuthToken(null);
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const { token, user: userData } = await api.loginWithGoogle();
      localStorage.setItem('authToken', token);
      api.setAuthToken(token);
      setUser(processUserData(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const { token, user: userData } = await api.loginWithFacebook();
      localStorage.setItem('authToken', token);
      api.setAuthToken(token);
      setUser(processUserData(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Facebook login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithApple = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const { token, user: userData } = await api.loginWithApple();
      localStorage.setItem('authToken', token);
      api.setAuthToken(token);
      setUser(processUserData(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Apple login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPhoneVerification = async (phoneNumber: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { verificationId } = await api.requestPhoneVerification(phoneNumber);
      return verificationId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Phone verification request failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPhoneCode = async (verificationId: string, code: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { token, user: userData } = await api.verifyPhoneCode(verificationId, code);
      localStorage.setItem('authToken', token);
      api.setAuthToken(token);
      setUser(processUserData(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Phone verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await api.requestPasswordReset(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset request failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await api.resetPassword(token, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Omit<User, 'createdAt' | 'updatedAt'>>) => {
    try {
      setError(null);
      setIsLoading(true);
      const updatedUser = await api.updateProfile(data);
      setUser(processUserData(updatedUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await api.updatePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await api.deleteAccount(password);
      localStorage.removeItem('authToken');
      api.setAuthToken(null);
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account deletion failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await api.sendVerificationEmail();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (code: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const { user: userData } = await api.verifyEmail(code);
      setUser(processUserData(userData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        loginWithApple,
        requestPhoneVerification,
        verifyPhoneCode,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        updatePassword,
        deleteAccount,
        sendVerificationEmail,
        verifyEmail,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 