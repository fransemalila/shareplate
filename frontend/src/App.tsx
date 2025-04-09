import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import FoodListingsPage from './pages/FoodListingsPage';
import { LoginPage } from './pages/LoginPage';
import { RequestPasswordReset } from './components/auth/RequestPasswordReset';
import { ResetPassword } from './components/auth/ResetPassword';
import { ProfileManagement } from './components/auth/ProfileManagement';
import './index.css';

function App() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link
                  to="/"
                  className="px-2 py-2 text-green-600 font-medium"
                >
                  SharePlate
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-gray-700 hover:text-gray-900"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<FoodListingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/request-password-reset" element={<RequestPasswordReset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<ProfileManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 