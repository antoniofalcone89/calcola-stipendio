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
        expect(result.current.loading).toBe(false);
        expect(result.current.pagaOraria).toBe(null);
      });

      expect(firestore.loadPagaOrariaFS).not.toHaveBeenCalled();
    });

    it('should not save to Firestore when user is not logged in', async () => {
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setPagaOraria(15.5);
      });

      // setPagaOraria only updates local state, does not auto-save
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
        expect(result.current.loading).toBe(false);
        expect(result.current.pagaOraria).toBe(12.5);
      });

      expect(firestore.loadPagaOrariaFS).toHaveBeenCalledWith(mockUser.uid);
    });

    it('should handle Firestore load error gracefully', async () => {
      firestore.loadPagaOrariaFS.mockRejectedValue(new Error('Firestore error'));
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.pagaOraria).toBe(null);
      });
    });

    it('should save pagaOraria to Firestore when savePagaOraria is called', async () => {
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setPagaOraria(15.5);
      });

      await act(async () => {
        await result.current.savePagaOraria();
      });

      expect(firestore.savePagaOrariaFS).toHaveBeenCalledWith(mockUser.uid, 15.5);
    });

    it('should track hasChanged when value differs from loaded value', async () => {
      firestore.loadPagaOrariaFS.mockResolvedValue(12.5);
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.hasChanged).toBe(false);
      });

      act(() => {
        result.current.setPagaOraria(15.5);
      });

      expect(result.current.hasChanged).toBe(true);
    });

    it('should not mark hasChanged when value equals loaded value', async () => {
      firestore.loadPagaOrariaFS.mockResolvedValue(12.5);
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current.pagaOraria).toBe(12.5);
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setPagaOraria(12.5);
      });

      expect(result.current.hasChanged).toBe(false);
    });

    it('should reset hasChanged after saving', async () => {
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setPagaOraria(15.5);
      });

      expect(result.current.hasChanged).toBe(true);

      await act(async () => {
        await result.current.savePagaOraria();
      });

      expect(result.current.hasChanged).toBe(false);
    });

    it('should handle save error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      firestore.savePagaOrariaFS.mockRejectedValue(new Error('Save error'));
      const { result } = renderHook(() => usePagaOraria());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setPagaOraria(15.5);
      });

      await act(async () => {
        await result.current.savePagaOraria();
      });

      expect(firestore.savePagaOrariaFS).toHaveBeenCalledWith(mockUser.uid, 15.5);
      consoleSpy.mockRestore();
    });
  });

  describe('when auth is loading', () => {
    it('should wait for auth to complete before loading data', async () => {
      useAuth.mockReturnValue({ currentUser: null, loading: true });
      const { result, rerender } = renderHook(() => usePagaOraria());

      // Should be loading while auth is loading
      expect(result.current.loading).toBe(true);

      // Simulate auth completing with user
      useAuth.mockReturnValue({ currentUser: mockUser, loading: false });
      firestore.loadPagaOrariaFS.mockResolvedValue(12.5);

      rerender();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.pagaOraria).toBe(12.5);
      });
    });
  });
});
