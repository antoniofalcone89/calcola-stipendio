import { renderHook, waitFor, act } from '@testing-library/react';
import { useOreLavorate } from '../../src/hooks/useOreLavorate';
import * as firestore from '../../src/db/firestore';
import { useAuth } from '../../src/contexts/AuthContext';

jest.mock('../../src/config/firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
}));
jest.mock('../../src/db/firestore');
jest.mock('../../src/contexts/AuthContext');

describe('useOreLavorate', () => {
  const mockUser = { uid: 'test-uid' };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ currentUser: null, loading: false });
    
    // Default mocks
    firestore.loadOreLavorateFS.mockResolvedValue({});
    firestore.saveOreLavorateFS.mockResolvedValue();
    firestore.deleteOreLavorateFS.mockResolvedValue();
    firestore.deleteAllOreLavorateFS.mockResolvedValue();
  });

  describe('when user is not logged in', () => {
    it('should set oreLavorate to null when no user is logged in', async () => {
      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false); // loading complete
        expect(result.current.oreLavorate).toBe(null); // oreLavorate is null
      });
      
      expect(firestore.loadOreLavorateFS).not.toHaveBeenCalled();
    });

    it('should not save to Firestore when user is not logged in', async () => {
      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.saveHours('2024-01-15', 8.5);
      });

      expect(firestore.saveOreLavorateFS).not.toHaveBeenCalled();
    });

    it('should not delete from Firestore when user is not logged in', async () => {
      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.removeHours('2024-01-15');
      });

      expect(firestore.deleteOreLavorateFS).not.toHaveBeenCalled();
    });

    it('should not delete all from Firestore when user is not logged in', async () => {
      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.removeAllHours();
      });

      expect(firestore.deleteAllOreLavorateFS).not.toHaveBeenCalled();
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ currentUser: mockUser, loading: false });
    });

    it('should load ore lavorate from Firestore on mount', async () => {
      const mockData = { '2024-01-15': 8.5 };
      firestore.loadOreLavorateFS.mockResolvedValue(mockData);

      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false); // loading complete
        expect(result.current.oreLavorate).toEqual(mockData); // oreLavorate loaded
      });
      
      expect(firestore.loadOreLavorateFS).toHaveBeenCalledWith(mockUser.uid);
    });

    it('should handle Firestore load error gracefully', async () => {
      firestore.loadOreLavorateFS.mockRejectedValue(new Error('Firestore error'));
      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.oreLavorate).toBe(null);
      });
    });

    it('should save hours to Firestore', async () => {
      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.saveHours('2024-01-15', 8.5);
      });

      expect(firestore.saveOreLavorateFS).toHaveBeenCalledWith(mockUser.uid, '2024-01-15', 8.5);
    });

    it('should remove hours from Firestore', async () => {
      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.removeHours('2024-01-15');
      });

      expect(firestore.deleteOreLavorateFS).toHaveBeenCalledWith(mockUser.uid, '2024-01-15');
    });

    it('should remove all hours from Firestore', async () => {
      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.removeAllHours();
      });

      expect(firestore.deleteAllOreLavorateFS).toHaveBeenCalledWith(mockUser.uid);
    });

    it('should handle save error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      firestore.saveOreLavorateFS.mockRejectedValue(new Error('Save error'));
      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.saveHours('2024-01-15', 8.5);
      });

      expect(firestore.saveOreLavorateFS).toHaveBeenCalledWith(mockUser.uid, '2024-01-15', 8.5);
      
      // Restore console.error
      consoleSpy.mockRestore();
    });

    it('should handle delete error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      firestore.deleteOreLavorateFS.mockRejectedValue(new Error('Delete error'));
      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.removeHours('2024-01-15');
      });

      expect(firestore.deleteOreLavorateFS).toHaveBeenCalledWith(mockUser.uid, '2024-01-15');
      
      // Restore console.error
      consoleSpy.mockRestore();
    });
  });

  describe('when auth is loading', () => {
    it('should wait for auth to complete before loading data', async () => {
      useAuth.mockReturnValue({ currentUser: null, loading: true });
      const { result, rerender } = renderHook(() => useOreLavorate());

      // Should be loading while auth is loading
      expect(result.current.loading).toBe(true);

      // Simulate auth completing with user
      useAuth.mockReturnValue({ currentUser: mockUser, loading: false });
      const mockData = { '2024-01-15': 8.5 };
      firestore.loadOreLavorateFS.mockResolvedValue(mockData);
      
      rerender();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.oreLavorate).toEqual(mockData);
      });
    });
  });
});
