import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SecurityService } from '../services/securityService';
import { TwoFactorAuth, PrivacySettings, UserSession, DeviceInfo } from '../types';
import Button from '../components/common/Button';

const SecuritySettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'2fa' | 'privacy' | 'sessions' | 'devices' | 'activity' | 'export'>('2fa');
  const [loading, setLoading] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState<TwoFactorAuth | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [qrCode, setQrCode] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [exportStatus, setExportStatus] = useState<'idle' | 'pending' | 'ready' | 'failed'>('idle');
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  const securityService = new SecurityService(/* pass your axios instance here */);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'privacy':
          const settings = await securityService.getPrivacySettings();
          setPrivacySettings(settings);
          break;
        case 'sessions':
          const userSessions = await securityService.getSessions();
          setSessions(userSessions);
          break;
        case 'devices':
          const userDevices = await securityService.getDevices();
          setDevices(userDevices);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async (method: TwoFactorAuth['method']) => {
    try {
      const { qrCode, secret } = await securityService.enable2FA(method);
      setQrCode(qrCode);
      setTwoFactorAuth({ enabled: false, method, secret });
    } catch (error) {
      console.error('Error enabling 2FA:', error);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorAuth?.secret) return;
    try {
      await securityService.verify2FA(verificationCode, twoFactorAuth.secret);
      setTwoFactorAuth({ ...twoFactorAuth, enabled: true });
      setQrCode('');
      setVerificationCode('');
    } catch (error) {
      console.error('Error verifying 2FA:', error);
    }
  };

  const handleUpdatePrivacy = async (settings: PrivacySettings) => {
    try {
      const updated = await securityService.updatePrivacySettings(settings);
      setPrivacySettings(updated);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  };

  const handleExportData = async () => {
    try {
      setExportStatus('pending');
      const { requestId } = await securityService.requestDataExport();
      
      // Poll for export status
      const checkStatus = async () => {
        const { status, url } = await securityService.getDataExportStatus(requestId);
        if (status === 'ready' && url) {
          setExportStatus('ready');
          setExportUrl(url);
        } else if (status === 'failed') {
          setExportStatus('failed');
        } else {
          setTimeout(checkStatus, 5000); // Check again in 5 seconds
        }
      };

      checkStatus();
    } catch (error) {
      console.error('Error requesting data export:', error);
      setExportStatus('failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Security & Privacy Settings</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['2fa', 'privacy', 'sessions', 'devices', 'activity', 'export'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {activeTab === '2fa' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h2>
                {!twoFactorAuth?.enabled ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <div className="space-x-4">
                      <Button onClick={() => handleEnable2FA('2fa_app')}>Enable Authenticator App</Button>
                      <Button onClick={() => handleEnable2FA('sms')}>Enable SMS</Button>
                      <Button onClick={() => handleEnable2FA('email')}>Enable Email</Button>
                    </div>
                    {qrCode && (
                      <div className="mt-4">
                        <img src={qrCode} alt="2FA QR Code" className="mb-4" />
                        <div className="flex items-center space-x-4">
                          <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter verification code"
                            className="border-gray-300 rounded-md"
                          />
                          <Button onClick={handleVerify2FA}>Verify</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-green-600">✓ Two-factor authentication is enabled</p>
                    <Button
                      variant="danger"
                      className="mt-4"
                      onClick={() => securityService.disable2FA(verificationCode)}
                    >
                      Disable 2FA
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'privacy' && privacySettings && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Privacy Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => handleUpdatePrivacy({
                        ...privacySettings,
                        profileVisibility: e.target.value as PrivacySettings['profileVisibility']
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { key: 'showEmail', label: 'Show Email' },
                      { key: 'showPhone', label: 'Show Phone Number' },
                      { key: 'showLocation', label: 'Show Location' },
                      { key: 'allowMessaging', label: 'Allow Messaging' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={key}
                          checked={privacySettings[key as keyof PrivacySettings] as boolean}
                          onChange={(e) => handleUpdatePrivacy({
                            ...privacySettings,
                            [key]: e.target.checked
                          })}
                          className="h-4 w-4 text-green-600 rounded border-gray-300"
                        />
                        <label htmlFor={key} className="ml-2 text-gray-700">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Active Sessions</h2>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{session.deviceName}</p>
                        <p className="text-sm text-gray-500">
                          {session.browser} • {session.location}
                        </p>
                        <p className="text-xs text-gray-400">
                          Last active: {new Date(session.lastActive).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        onClick={() => securityService.revokeSession(session.id)}
                      >
                        Revoke
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => securityService.revokeAllOtherSessions()}>
                    Revoke All Other Sessions
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'devices' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Device Management</h2>
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-gray-500">
                          {device.browser} • {device.os}
                        </p>
                        <p className="text-xs text-gray-400">
                          Last active: {new Date(device.lastActive).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant={device.trusted ? 'outline' : 'primary'}
                          onClick={() => securityService.trustDevice(device.id)}
                        >
                          {device.trusted ? 'Trusted' : 'Trust Device'}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => securityService.removeDevice(device.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900">Data Export</h2>
                <p className="text-gray-600">
                  Download a copy of your personal data. This includes your profile information,
                  listings, orders, and activity history.
                </p>
                {exportStatus === 'idle' && (
                  <Button onClick={handleExportData}>Request Data Export</Button>
                )}
                {exportStatus === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                    <span className="text-gray-600">Preparing your data...</span>
                  </div>
                )}
                {exportStatus === 'ready' && exportUrl && (
                  <div>
                    <p className="text-green-600 mb-2">Your data is ready!</p>
                    <Button as="a" href={exportUrl} download>
                      Download Data
                    </Button>
                  </div>
                )}
                {exportStatus === 'failed' && (
                  <div className="text-red-600">
                    Failed to prepare data export. Please try again.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SecuritySettingsPage; 