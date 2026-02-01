import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserMenu from '../../src/components/UserMenu';
import { useAuth } from '../../src/contexts/AuthContext';

// Mock AuthContext
jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('UserMenu', () => {
  const mockLogout = jest.fn();
  const mockCurrentUser = {
    displayName: 'Test User',
    email: 'test@example.com',
    photoURL: 'http://example.com/photo.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      currentUser: mockCurrentUser,
      logout: mockLogout,
    });
  });

  it('should render menu icon button', () => {
    render(<UserMenu />);
    const menuButton = screen.getByRole('button', { name: /apri menu utente/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('should open menu when button is clicked', async () => {
    render(<UserMenu />);
    const menuButton = screen.getByRole('button', { name: /apri menu utente/i });
    await userEvent.click(menuButton);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Esci')).toBeInTheDocument();
  });

  it('should call logout when logout item is clicked', async () => {
    render(<UserMenu />);
    const menuButton = screen.getByRole('button', { name: /apri menu utente/i });
    await userEvent.click(menuButton);

    const logoutItem = screen.getByText('Esci');
    await userEvent.click(logoutItem);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should handle missing display name or photo', async () => {
    useAuth.mockReturnValue({
      currentUser: { email: 'test@example.com' },
      logout: mockLogout,
    });
    render(<UserMenu />);
    const menuButton = screen.getByRole('button', { name: /apri menu utente/i });
    await userEvent.click(menuButton);

    expect(screen.getByText('Utente')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});
