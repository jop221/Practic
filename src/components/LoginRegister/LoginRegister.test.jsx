import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginRegister from './LoginRegister';

const mockOnLoginSuccess = jest.fn();

describe('LoginRegister Component', () => {
  beforeEach(() => {
    mockOnLoginSuccess.mockClear();
  });

  test('renders login form by default', () => {
    render(<LoginRegister onLoginSuccess={mockOnLoginSuccess} />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Email/i)).not.toBeInTheDocument();
  });

  test('toggles to register form', () => {
    render(<LoginRegister onLoginSuccess={mockOnLoginSuccess} />);
    fireEvent.click(screen.getByText(/Register/i));
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  test('calls onLoginSuccess on successful login', async () => {
    // Mock login and register functions
    jest.mock('../../api/auth.js', () => ({
      login: jest.fn(() => Promise.resolve({ access_token: 'token' })),
      register: jest.fn(() => Promise.resolve())
    }));

    render(<LoginRegister onLoginSuccess={mockOnLoginSuccess} />);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
  });
});
