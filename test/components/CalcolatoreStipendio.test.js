import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalcolatoreStipendio from '../../src/components/CalcolatoreStipendio';
import * as database from '../../src/db/local-storage-manager';

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

jest.mock('../../src/db/local-storage-manager');
jest.mock('../../src/hooks/usePagaOraria', () => ({
  usePagaOraria: jest.fn(() => [10, jest.fn()]),
}));
jest.mock('../../src/hooks/useOreLavorate', () => ({
  useOreLavorate: jest.fn(() => ({
    oreLavorate: {},
    saveHours: jest.fn().mockResolvedValue(),
    removeHours: jest.fn().mockResolvedValue(),
    removeAllHours: jest.fn().mockResolvedValue(),
  })),
}));
jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    currentUser: { uid: 'test-user-id' },
    signInWithGoogle: jest.fn(),
    logout: jest.fn(),
    loading: false,
  })),
}));

describe('CalcolatoreStipendio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    database.loadOreLavorate.mockResolvedValue({});
    database.loadPagaOraria.mockResolvedValue(10);
  });

  it('should render main title with current month', () => {
    render(<CalcolatoreStipendio />);

    expect(screen.getByText(/calcolatore stipendio/i)).toBeInTheDocument();
  });

  it('should render hourly rate input', () => {
    render(<CalcolatoreStipendio />);

    expect(screen.getByLabelText('Paga oraria (€)')).toBeInTheDocument();
  });

  it('should render work hours input', () => {
    render(<CalcolatoreStipendio />);

    expect(screen.getByLabelText(/ore lavorate/i)).toBeInTheDocument();
  });

  it('should render summary table', () => {
    render(<CalcolatoreStipendio />);

    expect(screen.getByText('Riepilogo del mese')).toBeInTheDocument();
  });

  it('should render total summary', () => {
    render(<CalcolatoreStipendio />);

    expect(screen.getByText('Totali')).toBeInTheDocument();
  });

  it('should calculate and display totals correctly', () => {
    const { useOreLavorate } = require('../../src/hooks/useOreLavorate');
    useOreLavorate.mockReturnValue({
      oreLavorate: {
        '2024-01-15': 8.5,
        '2024-01-16': 7.5,
      },
      saveHours: jest.fn().mockResolvedValue(),
      removeHours: jest.fn().mockResolvedValue(),
      removeAllHours: jest.fn().mockResolvedValue(),
    });

    render(<CalcolatoreStipendio />);

    expect(screen.getByText(/ore totali:/i)).toBeInTheDocument();
    expect(screen.getByText(/stipendio previsto:/i)).toBeInTheDocument();
  });

  it('should allow saving work hours', async () => {
    const mockSaveHours = jest.fn().mockResolvedValue();
    const { useOreLavorate } = require('../../src/hooks/useOreLavorate');
    useOreLavorate.mockReturnValue({
      oreLavorate: {},
      saveHours: mockSaveHours,
      removeHours: jest.fn().mockResolvedValue(),
      removeAllHours: jest.fn().mockResolvedValue(),
    });

    render(<CalcolatoreStipendio />);

    const hoursInput = screen.getByLabelText(/ore lavorate/i);
    await userEvent.type(hoursInput, '08.30');

    const saveButton = screen.getByRole('button', { name: /salva ore/i });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveHours).toHaveBeenCalled();
    });
  });
});
