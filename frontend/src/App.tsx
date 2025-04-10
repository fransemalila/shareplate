import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { useAuth } from './contexts/AuthContext';
import { ErrorPage } from './pages/ErrorPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import FoodListingsPage from './pages/FoodListingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RequestPasswordReset } from './components/auth/RequestPasswordReset';
import { ResetPassword } from './components/auth/ResetPassword';
import { ProfileManagement } from './components/auth/ProfileManagement';
import SecuritySettingsPage from './pages/SecuritySettingsPage';
import HelpPage from './pages/HelpPage';
import SupportPage from './pages/SupportPage';
import CreateFoodListingPage from './pages/CreateFoodListingPage';
import './index.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

// Lazy loaded admin components
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const UsersPage = lazy(() => import('./pages/admin/UsersPage'));
const ContentPage = lazy(() => import('./pages/admin/ContentPage'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center px-4 py-16">
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
            <Route index element={<FoodListingsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            
            {/* Admin Routes */}
            {isAdmin && (
              <Route
                path="admin"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminLayout />
                  </Suspense>
                }
              >
                <Route index element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <DashboardPage />
                  </Suspense>
                } />
                <Route path="users" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <UsersPage />
                  </Suspense>
                } />
                <Route path="content" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ContentPage />
                  </Suspense>
                } />
                <Route path="analytics" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AnalyticsPage />
                  </Suspense>
                } />
                <Route path="settings" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <SettingsPage />
                  </Suspense>
                } />
              </Route>
            )}

            {/* Catch-all route for 404 */}
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App; 