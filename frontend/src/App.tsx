import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
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
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import ContentPage from './pages/admin/ContentPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import SettingsPage from './pages/admin/SettingsPage';
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><FoodListingsPage /></Layout>
  },
  {
    path: "/browse",
    element: <Layout><FoodListingsPage /></Layout>
  },
  {
    path: "/share",
    element: <Layout><CreateFoodListingPage /></Layout>
  },
  {
    path: "/login",
    element: <Layout><LoginPage /></Layout>
  },
  {
    path: "/register",
    element: <Layout><RegisterPage /></Layout>
  },
  {
    path: "/request-password-reset",
    element: <Layout><RequestPasswordReset /></Layout>
  },
  {
    path: "/reset-password/:token",
    element: <Layout><ResetPassword /></Layout>
  },
  {
    path: "/profile",
    element: <Layout><ProfileManagement /></Layout>
  },
  {
    path: "/settings/security",
    element: <Layout><SecuritySettingsPage /></Layout>
  },
  {
    path: "/help",
    element: <Layout><HelpPage /></Layout>
  },
  {
    path: "/support",
    element: <Layout><SupportPage /></Layout>
  },
  {
    path: "/admin",
    element: <Layout><AdminLayout /></Layout>,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "users",
        element: <UsersPage />
      },
      {
        path: "content",
        element: <ContentPage />
      },
      {
        path: "analytics",
        element: <AnalyticsPage />
      },
      {
        path: "settings",
        element: <SettingsPage />
      },
      {
        path: "support",
        element: <SupportPage />
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true
  }
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App; 