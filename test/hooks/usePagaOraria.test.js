import { renderHook, waitFor, act } from '@testing-library/react';
import { usePagaOraria } from '../../src/hooks/usePagaOraria';
import * as database from '../../src/db/database';

jest.mock('../../src/db/database');

describe('usePagaOraria', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    database.loadPagaOraria.mockResolvedValue(10);
    database.savePagaOraria.mockResolvedValue();
  });

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

  it('should load pagaOraria from database on mount', async () => {
    database.loadPagaOraria.mockResolvedValue(12.5);
    const { result } = renderHook(() => usePagaOraria());

    await waitFor(() => {
      expect(database.loadPagaOraria).toHaveBeenCalled();
    });
  });

  it('should save pagaOraria when it changes', async () => {
    const { result } = renderHook(() => usePagaOraria());

    act(() => {
      result.current[1](15.5);
    });

    await waitFor(() => {
      expect(database.savePagaOraria).toHaveBeenCalledWith(15.5);
    });
  });

  it('should return setter function that updates the value', () => {
    const { result } = renderHook(() => usePagaOraria());

    act(() => {
      result.current[1](20);
    });

    expect(result.current[0]).toBe(20);
  });
});
