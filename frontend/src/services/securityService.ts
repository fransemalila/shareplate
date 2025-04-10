import { AxiosInstance } from 'axios';
import {
  TwoFactorAuth,
  PrivacySettings,
  UserSession,
  ActivityLogEntry,
  DeviceInfo
} from '../types';

export class SecurityService {
  constructor(private axiosInstance: AxiosInstance) {}

  // Two-Factor Authentication
  async enable2FA(method: TwoFactorAuth['method']): Promise<{ secret: string; qrCode: string }> {
    const response = await this.axiosInstance.post<{ secret: string; qrCode: string }>('/auth/2fa/enable', { method });
    return response.data;
  }

  async verify2FA(code: string, secret: string): Promise<{ backupCodes: string[] }> {
    const response = await this.axiosInstance.post<{ backupCodes: string[] }>('/auth/2fa/verify', { code, secret });
    return response.data;
  }

  async disable2FA(code: string): Promise<void> {
    await this.axiosInstance.post('/auth/2fa/disable', { code });
  }

  // Privacy Settings
  async getPrivacySettings(): Promise<PrivacySettings> {
    const response = await this.axiosInstance.get<PrivacySettings>('/users/privacy');
    return response.data;
  }

  async updatePrivacySettings(settings: PrivacySettings): Promise<PrivacySettings> {
    const response = await this.axiosInstance.put<PrivacySettings>('/users/privacy', settings);
    return response.data;
  }

  // Data Export
  async requestDataExport(): Promise<{ requestId: string }> {
    const response = await this.axiosInstance.post<{ requestId: string }>('/users/data-export');
    return response.data;
  }

  async getDataExportStatus(requestId: string): Promise<{ status: 'pending' | 'ready' | 'failed'; url?: string }> {
    const response = await this.axiosInstance.get(`/users/data-export/${requestId}`);
    return response.data;
  }

  // Activity Log
  async getActivityLog(page = 1, limit = 20): Promise<{ entries: ActivityLogEntry[]; total: number }> {
    const response = await this.axiosInstance.get<{ entries: ActivityLogEntry[]; total: number }>(
      `/users/activity?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Session Management
  async getSessions(): Promise<UserSession[]> {
    const response = await this.axiosInstance.get<UserSession[]>('/auth/sessions');
    return response.data;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.axiosInstance.delete(`/auth/sessions/${sessionId}`);
  }

  async revokeAllOtherSessions(): Promise<void> {
    await this.axiosInstance.delete('/auth/sessions');
  }

  // Device Management
  async getDevices(): Promise<DeviceInfo[]> {
    const response = await this.axiosInstance.get<DeviceInfo[]>('/users/devices');
    return response.data;
  }

  async renameDevice(deviceId: string, name: string): Promise<DeviceInfo> {
    const response = await this.axiosInstance.put<DeviceInfo>(`/users/devices/${deviceId}`, { name });
    return response.data;
  }

  async removeDevice(deviceId: string): Promise<void> {
    await this.axiosInstance.delete(`/users/devices/${deviceId}`);
  }

  async trustDevice(deviceId: string): Promise<DeviceInfo> {
    const response = await this.axiosInstance.post<DeviceInfo>(`/users/devices/${deviceId}/trust`);
    return response.data;
  }
} 