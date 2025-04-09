import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const SocialAuth: React.FC = () => {
  const { loginWithGoogle, loginWithFacebook, loginWithApple, requestPhoneVerification, verifyPhoneCode, error } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch (err) {
      console.error('Facebook login failed:', err);
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
    } catch (err) {
      console.error('Apple login failed:', err);
    }
  };

  const handlePhoneNumberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await requestPhoneVerification(phoneNumber);
      setVerificationId(id);
    } catch (err) {
      console.error('Phone verification request failed:', err);
    }
  };

  const handleVerificationCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationId) return;

    try {
      await verifyPhoneCode(verificationId, verificationCode);
    } catch (err) {
      console.error('Phone verification failed:', err);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col space-y-3">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
        >
          <img
            src="/google-icon.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>

        <button
          onClick={handleFacebookLogin}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-[#1877F2] text-white hover:bg-[#1874EA]"
        >
          <img
            src="/facebook-icon.svg"
            alt="Facebook"
            className="w-5 h-5 mr-2"
          />
          Continue with Facebook
        </button>

        <button
          onClick={handleAppleLogin}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-black text-white hover:bg-gray-900"
        >
          <img
            src="/apple-icon.svg"
            alt="Apple"
            className="w-5 h-5 mr-2"
          />
          Continue with Apple
        </button>

        <button
          onClick={() => setShowPhoneVerification(!showPhoneVerification)}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Continue with Phone
        </button>
      </div>

      {showPhoneVerification && (
        <div className="mt-4 p-4 border rounded-md">
          {!verificationId ? (
            <form onSubmit={handlePhoneNumberSubmit} className="space-y-3">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Code
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerificationCodeSubmit} className="space-y-3">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Verify Code
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}; 