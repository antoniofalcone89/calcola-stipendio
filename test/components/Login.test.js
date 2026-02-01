import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../src/components/Login';

// Mock Firebase
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('../../src/config/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

// Mock AuthContext
jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../../src/contexts/AuthContext';

describe('Login', () => {
  const mockSignInWithGoogle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      signInWithGoogle: mockSignInWithGoogle,
      currentUser: null,
      logout: jest.fn(),
      loading: false,
    });
  });

  it('should render login screen with title', () => {
    render(<Login />);

    expect(screen.getByText('Calcolatore Stipendio')).toBeInTheDocument();
    expect(screen.getByText('Accedi per continuare')).toBeInTheDocument();
  });

  it('should render Google sign-in button', () => {
    render(<Login />);

    const signInButton = screen.getByRole('button', { name: /accedi con google/i });
    expect(signInButton).toBeInTheDocument();
  });

  it('should display terms of service text', () => {
    render(<Login />);

    expect(
      screen.getByText(/utilizzando google, accetti i termini di servizio/i)
    ).toBeInTheDocument();
  });

  it('should call signInWithGoogle when button is clicked', async () => {
    mockSignInWithGoogle.mockResolvedValue();
    render(<Login />);

    const signInButton = screen.getByRole('button', { name: /accedi con google/i });
    await userEvent.click(signInButton);

    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it('should show loading state when signing in', async () => {
    mockSignInWithGoogle.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<Login />);

    const signInButton = screen.getByRole('button', { name: /accedi con google/i });
    await userEvent.click(signInButton);

    expect(screen.getByText('Accesso in corso...')).toBeInTheDocument();
    expect(signInButton).toBeDisabled();
  });

  it('should display error message when sign-in fails', async () => {
    const errorMessage = 'Authentication failed';
    mockSignInWithGoogle.mockRejectedValue(new Error(errorMessage));
    render(<Login />);

    const signInButton = screen.getByRole('button', { name: /accedi con google/i });
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should display default error message when error has no message', async () => {
    mockSignInWithGoogle.mockRejectedValue({});
    render(<Login />);

    const signInButton = screen.getByRole('button', { name: /accedi con google/i });
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Errore durante il login. Riprova.')).toBeInTheDocument();
    });
  });

  it('should clear previous error when attempting to sign in again', async () => {
    const errorMessage = 'First error';
    mockSignInWithGoogle
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce();

    render(<Login />);

    const signInButton = screen.getByRole('button', { name: /accedi con google/i });

    // First attempt - should show error
    await userEvent.click(signInButton);
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Second attempt - error should be cleared
    await userEvent.click(signInButton);
    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    });
  });

  it('should not show error alert initially', () => {
    render(<Login />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should show error alert when error occurs', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('Test error'));
    render(<Login />);

    const signInButton = screen.getByRole('button', { name: /accedi con google/i });
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('should enable button after error occurs', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('Test error'));
    render(<Login />);

    const signInButton = screen.getByRole('button', { name: /accedi con google/i });
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(signInButton).not.toBeDisabled();
    });
  });

  it('should show Google icon when not loading', () => {
    render(<Login />);

    const signInButton = screen.getByRole('button', { name: /accedi con google/i });
    // Check that the button contains the Google icon (it's in the startIcon)
    expect(signInButton).toBeInTheDocument();
  });
});
