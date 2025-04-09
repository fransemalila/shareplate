import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

export const ProfileManagement: React.FC = () => {
  const { user, updateProfile, updatePassword, deleteAccount, error, clearError, isLoading } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    try {
      await updateProfile(profileData);
      alert('Profile updated successfully');
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    if (passwordData.newPassword.length < 8) {
      setValidationError('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setValidationError('New passwords do not match');
      return;
    }

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      alert('Password updated successfully');
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteAccount(passwordData.currentPassword);
      // Redirect will happen automatically due to auth state change
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'security' ? 'border-b-2 border-blue-500' : ''
          }`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      {(error || validationError) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error || validationError}
        </div>
      )}

      {activeTab === 'profile' ? (
        <form onSubmit={handleProfileSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded text-white ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <div>
          <form onSubmit={handlePasswordSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
                minLength={8}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded text-white ${
                isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4 text-red-600">Delete Account</h3>
            <p className="mb-4 text-gray-600">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-2 px-4 rounded text-white bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 