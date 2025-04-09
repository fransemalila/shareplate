import axios from 'axios';
import { FoodListing, User } from '../../../shared/src/types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface FoodListingFilters {
  category?: string;
  priceRange?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface SocialAuthResponse extends AuthResponse {
  isNewUser: boolean;
}

interface PhoneAuthResponse {
  verificationId: string;
}

class Api {
  private token: string | null = null;
  private axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add request interceptor to include auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          this.token = null;
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string | null) {
    this.token = token;
  }

  // Auth methods
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.axiosInstance.post('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.axiosInstance.get<User>('/auth/me');
    return response.data;
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.axiosInstance.post('/auth/request-password-reset', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.axiosInstance.post('/auth/reset-password', { token, newPassword });
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.axiosInstance.put<User>('/auth/profile', data);
    return response.data;
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.axiosInstance.put('/auth/password', { currentPassword, newPassword });
  }

  async deleteAccount(password: string): Promise<void> {
    await this.axiosInstance.delete('/auth/account', { data: { password } });
  }

  // Food listing methods
  async getFoodListings(filters?: FoodListingFilters) {
    const response = await this.axiosInstance.get('/food-listings', {
      params: filters,
    });
    return response.data;
  }

  async getFoodListingById(id: string) {
    const response = await this.axiosInstance.get(`/food-listings/${id}`);
    return response.data;
  }

  async createFoodListing(data: Partial<FoodListing>) {
    const response = await this.axiosInstance.post('/food-listings', data);
    return response.data;
  }

  async updateFoodListing(id: string, data: Partial<FoodListing>) {
    const response = await this.axiosInstance.put(`/food-listings/${id}`, data);
    return response.data;
  }

  async deleteFoodListing(id: string) {
    await this.axiosInstance.delete(`/food-listings/${id}`);
  }

  // Review methods
  async createReview(listingId: string, rating: number, comment: string) {
    const response = await this.axiosInstance.post(`/food-listings/${listingId}/reviews`, {
      rating,
      comment,
    });
    return response.data;
  }

  async updateReview(listingId: string, reviewId: string, rating: number, comment: string) {
    const response = await this.axiosInstance.put(
      `/food-listings/${listingId}/reviews/${reviewId}`,
      { rating, comment }
    );
    return response.data;
  }

  async deleteReview(listingId: string, reviewId: string) {
    await this.axiosInstance.delete(`/food-listings/${listingId}/reviews/${reviewId}`);
  }

  // Image upload
  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await this.axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Social Authentication methods
  async loginWithGoogle(): Promise<SocialAuthResponse> {
    const response = await this.axiosInstance.post<SocialAuthResponse>('/auth/google');
    return response.data;
  }

  async loginWithFacebook(): Promise<SocialAuthResponse> {
    const response = await this.axiosInstance.post<SocialAuthResponse>('/auth/facebook');
    return response.data;
  }

  async loginWithApple(): Promise<SocialAuthResponse> {
    const response = await this.axiosInstance.post<SocialAuthResponse>('/auth/apple');
    return response.data;
  }

  // Phone Authentication methods
  async requestPhoneVerification(phoneNumber: string): Promise<PhoneAuthResponse> {
    const response = await this.axiosInstance.post<PhoneAuthResponse>('/auth/phone/request', {
      phoneNumber,
    });
    return response.data;
  }

  async verifyPhoneCode(verificationId: string, code: string): Promise<AuthResponse> {
    const response = await this.axiosInstance.post<AuthResponse>('/auth/phone/verify', {
      verificationId,
      code,
    });
    return response.data;
  }
}

export const api = new Api(); 