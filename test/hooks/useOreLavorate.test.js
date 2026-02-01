import { renderHook, waitFor, act } from '@testing-library/react';
import { useOreLavorate } from '../../src/hooks/useOreLavorate';
import * as database from '../../src/db/database';

jest.mock('../../src/db/database');

describe('useOreLavorate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    database.loadOreLavorate.mockResolvedValue({});
    database.saveOreLavorate.mockResolvedValue();
    database.deleteOreLavorate.mockResolvedValue();
    database.deleteAllOreLavorate.mockResolvedValue();
  });

  it('should initialize with empty object', () => {
    const { result } = renderHook(() => useOreLavorate());

    expect(result.current.oreLavorate).toEqual({});
  });

  it('should load ore lavorate from database on mount', async () => {
    const mockData = {
      '2024-01-15': 8.5,
      '2024-01-16': 7.5,
    };
    database.loadOreLavorate.mockResolvedValue(mockData);

    const { result } = renderHook(() => useOreLavorate());

    await waitFor(() => {
      expect(result.current.oreLavorate).toEqual(mockData);
    });
    expect(database.loadOreLavorate).toHaveBeenCalled();
  });

  it('should save hours for a date', async () => {
    // Mock loadOreLavorate to return empty initially, then the saved data won't be overwritten
    database.loadOreLavorate.mockResolvedValueOnce({});
    const { result } = renderHook(() => useOreLavorate());

    // Wait for initial load to complete
    await waitFor(() => {
      expect(database.loadOreLavorate).toHaveBeenCalled();
    });

    await act(async () => {
      await result.current.saveHours('2024-01-15', 8.5);
    });

    expect(result.current.oreLavorate).toEqual({
      '2024-01-15': 8.5,
    });
    expect(database.saveOreLavorate).toHaveBeenCalledWith('2024-01-15', 8.5);
  });

  it('should update existing hours for a date', async () => {
    database.loadOreLavorate.mockResolvedValueOnce({});
    const { result } = renderHook(() => useOreLavorate());

    await waitFor(() => {
      expect(database.loadOreLavorate).toHaveBeenCalled();
    });

    await act(async () => {
      await result.current.saveHours('2024-01-15', 8.5);
    });

    expect(result.current.oreLavorate['2024-01-15']).toBe(8.5);

    await act(async () => {
      await result.current.saveHours('2024-01-15', 9.0);
    });

    expect(result.current.oreLavorate).toEqual({
      '2024-01-15': 9.0,
    });
  });

  it('should remove hours for a specific date', async () => {
    database.loadOreLavorate.mockResolvedValueOnce({});
    const { result } = renderHook(() => useOreLavorate());

    await waitFor(() => {
      expect(database.loadOreLavorate).toHaveBeenCalled();
    });

    await act(async () => {
      await result.current.saveHours('2024-01-15', 8.5);
    });

    await act(async () => {
      await result.current.saveHours('2024-01-16', 7.5);
    });

    expect(result.current.oreLavorate).toHaveProperty('2024-01-15');
    expect(result.current.oreLavorate).toHaveProperty('2024-01-16');

    await act(async () => {
      await result.current.removeHours('2024-01-15');
    });

    expect(result.current.oreLavorate).toEqual({
      '2024-01-16': 7.5,
    });
    expect(database.deleteOreLavorate).toHaveBeenCalledWith('2024-01-15');
  });

  it('should remove all hours', async () => {
    const { result } = renderHook(() => useOreLavorate());

    await act(async () => {
      await result.current.saveHours('2024-01-15', 8.5);
    });

    await act(async () => {
      await result.current.saveHours('2024-01-16', 7.5);
    });

    expect(Object.keys(result.current.oreLavorate).length).toBeGreaterThan(0);

    await act(async () => {
      await result.current.removeAllHours();
    });

    expect(result.current.oreLavorate).toEqual({});
    expect(database.deleteAllOreLavorate).toHaveBeenCalled();
  });
});
