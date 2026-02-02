import { renderHook, waitFor, act } from '@testing-library/react';
import { usePagaOraria } from '../../src/hooks/usePagaOraria';
import * as firestore from '../../src/db/firestore';
import { useAuth } from '../../src/contexts/AuthContext';

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
    useAuth.mockReturnValue({ currentUser: null, loading: false });
    
    // Default mocks
    firestore.loadPagaOrariaFS.mockResolvedValue(10);
    firestore.savePagaOrariaFS.mockResolvedValue();
  });

  describe('when user is not logged in', () => {
    it('should set pagaOraria to null when no user is logged in', async () => {
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current[2]).toBe(false); // loading complete
        expect(result.current[0]).toBe(null); // pagaOraria is null
      });
      
      expect(firestore.loadPagaOrariaFS).not.toHaveBeenCalled();
    });

    it('should not save to Firestore when user is not logged in', async () => {
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current[2]).toBe(false);
      });

      act(() => {
        result.current[1](15.5);
      });

      // Should not save since no user is logged in
      expect(firestore.savePagaOrariaFS).not.toHaveBeenCalled();
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ currentUser: mockUser, loading: false });
    });

    it('should load pagaOraria from Firestore on mount', async () => {
      firestore.loadPagaOrariaFS.mockResolvedValue(12.5);
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current[2]).toBe(false); // loading complete
        expect(result.current[0]).toBe(12.5); // pagaOraria loaded
      });
      
      expect(firestore.loadPagaOrariaFS).toHaveBeenCalledWith(mockUser.uid);
    });

    it('should handle Firestore load error gracefully', async () => {
      firestore.loadPagaOrariaFS.mockRejectedValue(new Error('Firestore error'));
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current[2]).toBe(false);
        expect(result.current[0]).toBe(null);
      });
    });

    it('should save pagaOraria to Firestore when it changes', async () => {
      const { result } = renderHook(() => usePagaOraria());

      // Wait for initial load
      await waitFor(() => {
        expect(firestore.loadPagaOrariaFS).toHaveBeenCalled();
        expect(result.current[2]).toBe(false);
      });

      act(() => {
        result.current[1](15.5);
      });

      await waitFor(() => {
        expect(firestore.savePagaOrariaFS).toHaveBeenCalledWith(mockUser.uid, 15.5);
      });
    });

    it('should not save if value is the same as loaded value', async () => {
      firestore.loadPagaOrariaFS.mockResolvedValue(12.5);
      const { result } = renderHook(() => usePagaOraria());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current[0]).toBe(12.5);
        expect(result.current[2]).toBe(false);
      });

      act(() => {
        result.current[1](12.5); // Same value as loaded
      });

      // Should not save since value hasn't changed
      expect(firestore.savePagaOrariaFS).not.toHaveBeenCalledWith(mockUser.uid, 12.5);
    });

    it('should handle save error gracefully', async () => {
      firestore.savePagaOrariaFS.mockRejectedValue(new Error('Save error'));
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current[2]).toBe(false);
      });

      act(() => {
        result.current[1](15.5);
      });

      await waitFor(() => {
        expect(firestore.savePagaOrariaFS).toHaveBeenCalledWith(mockUser.uid, 15.5);
      });
      // Should not throw error
    });
  });

  describe('when auth is loading', () => {
    it('should wait for auth to complete before loading data', async () => {
      useAuth.mockReturnValue({ currentUser: null, loading: true });
      const { result, rerender } = renderHook(() => usePagaOraria());

      // Should be loading while auth is loading
      expect(result.current[2]).toBe(true);

      // Simulate auth completing with user
      useAuth.mockReturnValue({ currentUser: mockUser, loading: false });
      firestore.loadPagaOrariaFS.mockResolvedValue(12.5);
      
      rerender();

      await waitFor(() => {
        expect(result.current[2]).toBe(false);
        expect(result.current[0]).toBe(12.5);
      });
    });
  });
});
