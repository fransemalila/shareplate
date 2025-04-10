import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';

// Mock component to test the useAuth hook
const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      {user ? (
        <>
          <div>Logged in as {user.email}</div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login('test@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  it('provides authentication state and methods', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially not logged in
    expect(screen.getByText(/login/i)).toBeInTheDocument();

    // Test login
    const loginButton = screen.getByText(/login/i);
    await act(async () => {
      await userEvent.click(loginButton);
    });

    // Should show logged in state
    expect(screen.getByText(/logged in as/i)).toBeInTheDocument();

    // Test logout
    const logoutButton = screen.getByText(/logout/i);
    await act(async () => {
      await userEvent.click(logoutButton);
    });

    // Should be back to logged out state
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
}); 