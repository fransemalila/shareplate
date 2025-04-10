import React, { useState, useEffect } from 'react';
import { NotificationPreferences as INotificationPreferences, NotificationType } from '../../types';
import { api } from '../../services/api';
import Button from '../common/Button';

const defaultPreferences: INotificationPreferences = {
  userId: '',
  channels: {
    order_status: ['email', 'in_app', 'push'],
    new_message: ['email', 'in_app', 'push'],
    review: ['email', 'in_app'],
    price_alert: ['email', 'in_app'],
    listing_expiry: ['email', 'in_app'],
    account_alert: ['email', 'in_app', 'push']
  },
  emailFrequency: 'instant',
  pushEnabled: true,
  emailEnabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const notificationTypes: { type: NotificationType; label: string; description: string }[] = [
  {
    type: 'order_status',
    label: 'Order Status Updates',
    description: 'Get notified about changes to your order status'
  },
  {
    type: 'new_message',
    label: 'New Messages',
    description: 'Receive notifications when you get new messages'
  },
  {
    type: 'review',
    label: 'Reviews',
    description: 'Get notified about new reviews on your listings'
  },
  {
    type: 'price_alert',
    label: 'Price Alerts',
    description: 'Receive alerts when prices change on your watched items'
  },
  {
    type: 'listing_expiry',
    label: 'Listing Expiry',
    description: 'Get notified when your listings are about to expire'
  },
  {
    type: 'account_alert',
    label: 'Account Alerts',
    description: 'Important updates about your account'
  }
];

const NotificationPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<INotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const response = await api.getNotificationPreferences();
      setPreferences(response);
    } catch (err) {
      setError('Failed to load notification preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelToggle = (type: NotificationType, channel: 'email' | 'in_app' | 'push') => {
    setPreferences(prev => {
      const channels = [...prev.channels[type]];
      const index = channels.indexOf(channel);
      
      if (index === -1) {
        channels.push(channel);
      } else {
        channels.splice(index, 1);
      }

      return {
        ...prev,
        channels: {
          ...prev.channels,
          [type]: channels
        }
      };
    });
  };

  const handleEmailFrequencyChange = (frequency: 'instant' | 'daily' | 'weekly') => {
    setPreferences(prev => ({
      ...prev,
      emailFrequency: frequency
    }));
  };

  const handleToggleEmail = () => {
    setPreferences(prev => ({
      ...prev,
      emailEnabled: !prev.emailEnabled
    }));
  };

  const handleTogglePush = async () => {
    try {
      const newPushEnabled = !preferences.pushEnabled;
      
      if (newPushEnabled) {
        // Request push notification permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Register service worker for push notifications
          const registration = await navigator.serviceWorker.register('/sw.js');
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY
          });
          
          // Send subscription to server
          await api.updatePushSubscription(subscription);
        }
      } else {
        // Remove push subscription from server
        await api.removePushSubscription();
      }

      setPreferences(prev => ({
        ...prev,
        pushEnabled: newPushEnabled
      }));
    } catch (err) {
      setError('Failed to update push notification settings');
      console.error('Error updating push settings:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.updateNotificationPreferences(preferences);
      setError(null);
    } catch (err) {
      setError('Failed to save notification preferences');
      console.error('Error saving preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">Notification Preferences</h2>
          <p className="mt-1 text-sm text-gray-600">
            Choose how and when you want to receive notifications
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Global Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Global Settings</h3>
            
            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    preferences.emailEnabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={preferences.emailEnabled}
                  onClick={handleToggleEmail}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences.emailEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-b">
              <div>
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <p className="text-sm text-gray-600">Receive notifications on your device</p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    preferences.pushEnabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={preferences.pushEnabled}
                  onClick={handleTogglePush}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences.pushEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {preferences.emailEnabled && (
              <div className="py-4 border-b">
                <h4 className="font-medium text-gray-900 mb-2">Email Frequency</h4>
                <div className="flex space-x-4">
                  {(['instant', 'daily', 'weekly'] as const).map((frequency) => (
                    <label key={frequency} className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-green-600"
                        checked={preferences.emailFrequency === frequency}
                        onChange={() => handleEmailFrequencyChange(frequency)}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {frequency}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notification Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Notification Types</h3>
            
            {notificationTypes.map(({ type, label, description }) => (
              <div key={type} className="py-4 border-b">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{label}</h4>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-green-600"
                      checked={preferences.channels[type].includes('in_app')}
                      onChange={() => handleChannelToggle(type, 'in_app')}
                    />
                    <span className="ml-2 text-sm text-gray-700">In-app</span>
                  </label>
                  
                  {preferences.emailEnabled && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-green-600"
                        checked={preferences.channels[type].includes('email')}
                        onChange={() => handleChannelToggle(type, 'email')}
                      />
                      <span className="ml-2 text-sm text-gray-700">Email</span>
                    </label>
                  )}
                  
                  {preferences.pushEnabled && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-green-600"
                        checked={preferences.channels[type].includes('push')}
                        onChange={() => handleChannelToggle(type, 'push')}
                      />
                      <span className="ml-2 text-sm text-gray-700">Push</span>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg">
          <Button
            variant="primary"
            onClick={handleSave}
            loading={saving}
            disabled={saving}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences; 