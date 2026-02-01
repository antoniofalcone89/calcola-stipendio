import { renderHook, waitFor, act } from '@testing-library/react';
import { useOreLavorate } from '../../src/hooks/useOreLavorate';
import * as database from '../../src/db/local-storage-manager';
import * as firestore from '../../src/db/firestore';
import { useAuth } from '../../src/contexts/AuthContext';

jest.mock('../../src/config/firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
}));
jest.mock('../../src/db/local-storage-manager');
jest.mock('../../src/db/firestore');
jest.mock('../../src/contexts/AuthContext');

describe('useOreLavorate', () => {
  const mockUser = { uid: 'test-uid' };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ currentUser: null });
    
    // Default mocks
    database.loadOreLavorate.mockResolvedValue({});
    database.saveOreLavorate.mockResolvedValue();
    database.deleteOreLavorate.mockResolvedValue();
    database.deleteAllOreLavorate.mockResolvedValue();

    firestore.loadOreLavorateFS.mockResolvedValue({});
    firestore.saveOreLavorateFS.mockResolvedValue();
    firestore.deleteOreLavorateFS.mockResolvedValue();
    firestore.deleteAllOreLavorateFS.mockResolvedValue();
  });

  describe('when user is not logged in (Local DB)', () => {
    it('should initialize with empty object', () => {
      const { result } = renderHook(() => useOreLavorate());
      expect(result.current.oreLavorate).toEqual({});
    });

    it('should load ore lavorate from local database on mount', async () => {
      const mockData = { '2024-01-15': 8.5 };
      database.loadOreLavorate.mockResolvedValue(mockData);

      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.oreLavorate).toEqual(mockData);
      });
      expect(database.loadOreLavorate).toHaveBeenCalled();
      expect(firestore.loadOreLavorateFS).not.toHaveBeenCalled();
    });

    it('should save hours to local database', async () => {
      const { result } = renderHook(() => useOreLavorate());

      await act(async () => {
        await result.current.saveHours('2024-01-15', 8.5);
      });

      expect(database.saveOreLavorate).toHaveBeenCalledWith('2024-01-15', 8.5);
      expect(firestore.saveOreLavorateFS).not.toHaveBeenCalled();
    });

    it('should remove hours from local database', async () => {
      const { result } = renderHook(() => useOreLavorate());
      
      await act(async () => {
        await result.current.saveHours('2024-01-15', 8.5);
        await result.current.removeHours('2024-01-15');
      });

      expect(database.deleteOreLavorate).toHaveBeenCalledWith('2024-01-15');
      expect(firestore.deleteOreLavorateFS).not.toHaveBeenCalled();
    });

    it('should remove all hours from local database', async () => {
      const { result } = renderHook(() => useOreLavorate());
      
      await act(async () => {
        await result.current.removeAllHours();
      });

      expect(database.deleteAllOreLavorate).toHaveBeenCalled();
      expect(firestore.deleteAllOreLavorateFS).not.toHaveBeenCalled();
    });
  });

  describe('when user is logged in (Firestore)', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ currentUser: mockUser });
    });

    it('should load ore lavorate from Firestore on mount', async () => {
      const mockData = { '2024-01-15': 8.5 };
      firestore.loadOreLavorateFS.mockResolvedValue(mockData);

      const { result } = renderHook(() => useOreLavorate());

      await waitFor(() => {
        expect(result.current.oreLavorate).toEqual(mockData);
      });
      expect(firestore.loadOreLavorateFS).toHaveBeenCalledWith(mockUser.uid);
      expect(database.loadOreLavorate).not.toHaveBeenCalled();
    });

    it('should save hours to Firestore', async () => {
      const { result } = renderHook(() => useOreLavorate());

      await act(async () => {
        await result.current.saveHours('2024-01-15', 8.5);
      });

      expect(firestore.saveOreLavorateFS).toHaveBeenCalledWith(mockUser.uid, '2024-01-15', 8.5);
      expect(database.saveOreLavorate).not.toHaveBeenCalled();
    });

    it('should remove hours from Firestore', async () => {
      const { result } = renderHook(() => useOreLavorate());
      
      await act(async () => {
        await result.current.removeHours('2024-01-15');
      });

      expect(firestore.deleteOreLavorateFS).toHaveBeenCalledWith(mockUser.uid, '2024-01-15');
      expect(database.deleteOreLavorate).not.toHaveBeenCalled();
    });

    it('should remove all hours from Firestore', async () => {
      const { result } = renderHook(() => useOreLavorate());
      
      await act(async () => {
        await result.current.removeAllHours();
      });

      expect(firestore.deleteAllOreLavorateFS).toHaveBeenCalledWith(mockUser.uid);
      expect(database.deleteAllOreLavorate).not.toHaveBeenCalled();
    });
  });
});
