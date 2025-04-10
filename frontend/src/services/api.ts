import axios from 'axios';
import { FoodListing, User, NotificationPreferences } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface FoodListingFilters {
  category?: string;
  status?: string;
  tags?: string[];
  location?: {
    lat: number;
    lng: number;
  };
  radius?: number;
  priceRange?: {
    min: number;
    max: number;
  };
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

interface VerificationResponse {
  user: User;
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
      params: {
        ...filters,
        location: filters?.location ? `${filters.location.lat},${filters.location.lng}` : undefined,
        tags: filters?.tags?.join(','),
        priceRange: filters?.priceRange ? `${filters.priceRange.min},${filters.priceRange.max}` : undefined
      }
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

  // Enhanced Review methods
  async getReviews(listingId: string, status?: 'pending' | 'approved' | 'rejected') {
    const response = await this.axiosInstance.get(`/food-listings/${listingId}/reviews`, {
      params: { status }
    });
    return response.data;
  }

  async moderateReview(listingId: string, reviewId: string, action: 'approve' | 'reject', reason?: string) {
    const response = await this.axiosInstance.post(`/food-listings/${listingId}/reviews/${reviewId}/moderate`, {
      action,
      reason
    });
    return response.data;
  }

  async addSellerResponse(listingId: string, reviewId: string, comment: string) {
    const response = await this.axiosInstance.post(
      `/food-listings/${listingId}/reviews/${reviewId}/response`,
      { comment }
    );
    return response.data;
  }

  async updateSellerResponse(listingId: string, reviewId: string, responseId: string, comment: string) {
    const response = await this.axiosInstance.put(
      `/food-listings/${listingId}/reviews/${reviewId}/response/${responseId}`,
      { comment }
    );
    return response.data;
  }

  async deleteSellerResponse(listingId: string, reviewId: string, responseId: string) {
    await this.axiosInstance.delete(
      `/food-listings/${listingId}/reviews/${reviewId}/response/${responseId}`
    );
  }

  async voteReview(listingId: string, reviewId: string, vote: 'helpful' | 'not_helpful') {
    const response = await this.axiosInstance.post(
      `/food-listings/${listingId}/reviews/${reviewId}/vote`,
      { vote }
    );
    return response.data;
  }

  async getUserReputation(userId: string) {
    const response = await this.axiosInstance.get(`/users/${userId}/reputation`);
    return response.data;
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

  // Order methods
  async createOrder(listingId: string, stripePaymentMethodId: string) {
    const response = await this.axiosInstance.post(`/orders`, {
      listingId,
      paymentMethodId: stripePaymentMethodId
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

  // Email verification methods
  async sendVerificationEmail(): Promise<void> {
    const response = await this.axiosInstance.post('/auth/email/send-verification');
    return response.data;
  }

  async verifyEmail(code: string): Promise<VerificationResponse> {
    const response = await this.axiosInstance.post('/auth/email/verify', { code });
    return response.data;
  }

  // Notification methods
  async getNotifications(params?: { page?: number; limit?: number; type?: string }) {
    const response = await this.axiosInstance.get('/notifications', { params });
    return response.data;
  }

  async getUnreadNotificationCount() {
    const response = await this.axiosInstance.get('/notifications/unread/count');
    return response.data.count;
  }

  async markNotificationAsRead(notificationId: string) {
    const response = await this.axiosInstance.put(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead() {
    const response = await this.axiosInstance.put('/notifications/read-all');
    return response.data;
  }

  async deleteNotification(notificationId: string) {
    await this.axiosInstance.delete(`/notifications/${notificationId}`);
  }

  async getNotificationPreferences() {
    const response = await this.axiosInstance.get('/notifications/preferences');
    return response.data;
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>) {
    const response = await this.axiosInstance.put('/notifications/preferences', preferences);
    return response.data;
  }

  async updatePushSubscription(subscription: PushSubscription) {
    const response = await this.axiosInstance.post('/notifications/push-subscription', subscription);
    return response.data;
  }

  async removePushSubscription() {
    await this.axiosInstance.delete('/notifications/push-subscription');
  }

  // Messaging methods
  async getConversations(params?: { page?: number; limit?: number }) {
    const response = await this.axiosInstance.get('/conversations', { params });
    return response.data;
  }

  async getConversation(conversationId: string) {
    const response = await this.axiosInstance.get(`/conversations/${conversationId}`);
    return response.data;
  }

  async createConversation(participantId: string, initialMessage?: string) {
    const response = await this.axiosInstance.post('/conversations', {
      participantId,
      initialMessage
    });
    return response.data;
  }

  async getMessages(conversationId: string, params?: { page?: number; limit?: number; before?: string }) {
    const response = await this.axiosInstance.get(`/conversations/${conversationId}/messages`, {
      params
    });
    return response.data;
  }

  async sendMessage(conversationId: string, content: string, attachments?: File[]) {
    const formData = new FormData();
    formData.append('content', content);
    
    if (attachments?.length) {
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    const response = await this.axiosInstance.post(
      `/conversations/${conversationId}/messages`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }

  async markMessageAsRead(conversationId: string, messageId: string) {
    const response = await this.axiosInstance.put(
      `/conversations/${conversationId}/messages/${messageId}/read`
    );
    return response.data;
  }

  async deleteMessage(conversationId: string, messageId: string) {
    await this.axiosInstance.delete(
      `/conversations/${conversationId}/messages/${messageId}`
    );
  }

  async blockUser(userId: string, reason?: string) {
    const response = await this.axiosInstance.post('/users/block', {
      userId,
      reason
    });
    return response.data;
  }

  async unblockUser(userId: string) {
    await this.axiosInstance.delete(`/users/block/${userId}`);
  }

  async getBlockedUsers() {
    const response = await this.axiosInstance.get('/users/blocked');
    return response.data;
  }

  // User methods
  async getUser(id: string): Promise<User> {
    const response = await this.axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  }
}

export const api = new Api(); 