import { renderHook, waitFor, act } from '@testing-library/react';
import { usePagaOraria } from '../../src/hooks/usePagaOraria';
import * as database from '../../src/db/local-storage-manager';
import * as firestore from '../../src/db/firestore';
import { useAuth } from '../../src/contexts/AuthContext';

jest.mock('../../src/db/local-storage-manager');
jest.mock('../../src/db/firestore');
jest.mock('../../src/contexts/AuthContext');
jest.mock('../../src/config/firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
}));

describe('usePagaOraria', () => {
  const mockUser = { uid: 'test-uid' };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    useAuth.mockReturnValue({ currentUser: null });
    
    // Default mocks
    database.loadPagaOraria.mockResolvedValue(10);
    database.savePagaOraria.mockResolvedValue();
    firestore.loadPagaOrariaFS.mockResolvedValue(10);
    firestore.savePagaOrariaFS.mockResolvedValue();
  });

  describe('when user is not logged in (Local DB)', () => {
    it('should initialize with default value of 10 when localStorage is empty', () => {
      localStorage.removeItem('pagaOraria');
      const { result } = renderHook(() => usePagaOraria());
      expect(result.current[0]).toBe(10);
    });

    it('should initialize with value from localStorage', () => {
      localStorage.setItem('pagaOraria', '15.5');
      const { result } = renderHook(() => usePagaOraria());
      expect(result.current[0]).toBe(15.5);
    });

    it('should load pagaOraria from local database on mount', async () => {
      database.loadPagaOraria.mockResolvedValue(12.5);
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current[0]).toBe(12.5);
      });
      expect(database.loadPagaOraria).toHaveBeenCalled();
      expect(firestore.loadPagaOrariaFS).not.toHaveBeenCalled();
    });

    it('should save pagaOraria when it changes', async () => {
      const { result } = renderHook(() => usePagaOraria());

      // Wait for initial load to complete
      await waitFor(() => {
        expect(database.loadPagaOraria).toHaveBeenCalled();
      });

      act(() => {
        result.current[1](15.5);
      });

      await waitFor(() => {
        expect(database.savePagaOraria).toHaveBeenCalledWith(15.5);
      });
      expect(firestore.savePagaOrariaFS).not.toHaveBeenCalled();
    });
  });

  describe('when user is logged in (Firestore)', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ currentUser: mockUser });
    });

    it('should load pagaOraria from Firestore on mount', async () => {
      firestore.loadPagaOrariaFS.mockResolvedValue(12.5);
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current[0]).toBe(12.5);
      });
      expect(firestore.loadPagaOrariaFS).toHaveBeenCalledWith(mockUser.uid);
      expect(database.loadPagaOraria).not.toHaveBeenCalled();
    });

    it('should save pagaOraria to Firestore when it changes', async () => {
      const { result } = renderHook(() => usePagaOraria());

      // Wait for initial load
      await waitFor(() => {
        expect(firestore.loadPagaOrariaFS).toHaveBeenCalled();
      });

      act(() => {
        result.current[1](15.5);
      });

      await waitFor(() => {
        expect(firestore.savePagaOrariaFS).toHaveBeenCalledWith(mockUser.uid, 15.5);
      });
      expect(database.savePagaOraria).not.toHaveBeenCalled();
    });
  });
});
