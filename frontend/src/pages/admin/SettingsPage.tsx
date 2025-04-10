import React, { useState } from 'react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
  };
  security: {
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    twoFactorAuthEnabled: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminAlerts: boolean;
  };
  content: {
    allowUserRegistration: boolean;
    moderationEnabled: boolean;
    autoModeration: boolean;
    maxImagesPerListing: number;
    maxListingsPerUser: number;
  };
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<keyof SystemSettings>('general');
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'SharePlate',
      siteDescription: 'A platform for sharing homemade food',
      contactEmail: 'contact@shareplate.com',
      supportPhone: '+1234567890',
    },
    security: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      twoFactorAuthEnabled: true,
      passwordMinLength: 8,
      sessionTimeout: 30,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: false,
      adminAlerts: true,
    },
    content: {
      allowUserRegistration: true,
      moderationEnabled: true,
      autoModeration: false,
      maxImagesPerListing: 10,
      maxListingsPerUser: 50,
    },
  });

  const handleChange = (
    section: keyof SystemSettings,
    field: string,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // Implement settings save
    console.log('Saving settings:', settings);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Site Name</label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => handleChange('general', 'siteName', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Site Description</label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
        <input
          type="email"
          value={settings.general.contactEmail}
          onChange={(e) => handleChange('general', 'contactEmail', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Support Phone</label>
        <input
          type="tel"
          value={settings.general.supportPhone}
          onChange={(e) => handleChange('general', 'supportPhone', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Require Email Verification
          </label>
          <p className="text-sm text-gray-500">
            Users must verify their email before accessing the platform
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.security.requireEmailVerification}
          onChange={(e) => handleChange('security', 'requireEmailVerification', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Two-Factor Authentication
          </label>
          <p className="text-sm text-gray-500">
            Enable two-factor authentication for all users
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.security.twoFactorAuthEnabled}
          onChange={(e) => handleChange('security', 'twoFactorAuthEnabled', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Minimum Password Length
        </label>
        <input
          type="number"
          value={settings.security.passwordMinLength}
          onChange={(e) => handleChange('security', 'passwordMinLength', parseInt(e.target.value))}
          min={6}
          max={32}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Notifications
          </label>
          <p className="text-sm text-gray-500">
            Send email notifications for important updates
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.emailNotifications}
          onChange={(e) => handleChange('notifications', 'emailNotifications', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            SMS Notifications
          </label>
          <p className="text-sm text-gray-500">
            Send SMS notifications for critical updates
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.notifications.smsNotifications}
          onChange={(e) => handleChange('notifications', 'smsNotifications', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      </div>
    </div>
  );

  const renderContentSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content Moderation
          </label>
          <p className="text-sm text-gray-500">
            Enable manual review of user-generated content
          </p>
        </div>
        <input
          type="checkbox"
          checked={settings.content.moderationEnabled}
          onChange={(e) => handleChange('content', 'moderationEnabled', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Max Images per Listing
        </label>
        <input
          type="number"
          value={settings.content.maxImagesPerListing}
          onChange={(e) => handleChange('content', 'maxImagesPerListing', parseInt(e.target.value))}
          min={1}
          max={50}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {(['general', 'security', 'notifications', 'content'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-4 px-6 text-sm font-medium border-b-2
                  ${activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'content' && renderContentSettings()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 