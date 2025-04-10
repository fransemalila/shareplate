import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config';

const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@SharePlate:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('@SharePlate:refreshToken');
        const response = await api.post('/auth/refresh', { refreshToken });
        const { token } = response.data;

        await AsyncStorage.setItem('@SharePlate:token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (err) {
        await AsyncStorage.multiRemove(['@SharePlate:token', '@SharePlate:refreshToken']);
        // Handle logout or redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api; 