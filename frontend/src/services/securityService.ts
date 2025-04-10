import { api } from './api';
import {
  TwoFactorAuth,
  PrivacySettings,
  UserSession,
  ActivityLogEntry,
  DeviceInfo
} from '../types';

export class SecurityService {
  // Two-Factor Authentication
  async enable2FA(method: TwoFactorAuth['method']): Promise<{ secret: string; qrCode: string }> {
    const response = await api.post<{ secret: string; qrCode: string }>('/auth/2fa/enable', { method });
    return response;
  }

  async verify2FA(code: string, secret: string): Promise<{ backupCodes: string[] }> {
    const response = await api.post<{ backupCodes: string[] }>('/auth/2fa/verify', { code, secret });
    return response;
  }

  async disable2FA(code: string): Promise<void> {
    await api.post('/auth/2fa/disable', { code });
  }

  // Privacy Settings
  async getPrivacySettings(): Promise<PrivacySettings> {
    const response = await api.get<PrivacySettings>('/users/privacy');
    return response;
  }

  async updatePrivacySettings(settings: PrivacySettings): Promise<PrivacySettings> {
    const response = await api.put<PrivacySettings>('/users/privacy', settings);
    return response;
  }

  // Data Export
  async requestDataExport(): Promise<{ requestId: string }> {
    const response = await api.post<{ requestId: string }>('/users/data-export');
    return response;
  }

  async getDataExportStatus(requestId: string): Promise<{ status: 'pending' | 'ready' | 'failed'; url?: string }> {
    const response = await api.get(`/users/data-export/${requestId}`);
    return response;
  }

  // Activity Log
  async getActivityLog(page = 1, limit = 20): Promise<{ entries: ActivityLogEntry[]; total: number }> {
    const response = await api.get<{ entries: ActivityLogEntry[]; total: number }>(
      `/users/activity?page=${page}&limit=${limit}`
    );
    return response;
  }

  // Session Management
  async getSessions(): Promise<UserSession[]> {
    const response = await api.get<UserSession[]>('/auth/sessions');
    return response;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await api.delete(`/auth/sessions/${sessionId}`);
  }

  async revokeAllOtherSessions(): Promise<void> {
    await api.delete('/auth/sessions');
  }

  // Device Management
  async getDevices(): Promise<DeviceInfo[]> {
    const response = await api.get<DeviceInfo[]>('/users/devices');
    return response;
  }

  async renameDevice(deviceId: string, name: string): Promise<DeviceInfo> {
    const response = await api.put<DeviceInfo>(`/users/devices/${deviceId}`, { name });
    return response;
  }

  async removeDevice(deviceId: string): Promise<void> {
    await api.delete(`/users/devices/${deviceId}`);
  }

  async trustDevice(deviceId: string): Promise<DeviceInfo> {
    const response = await api.post<DeviceInfo>(`/users/devices/${deviceId}/trust`);
    return response;
  }
} 