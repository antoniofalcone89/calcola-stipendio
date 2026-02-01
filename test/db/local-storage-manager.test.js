// Mock Dexie to avoid actual database operations in tests
const mockOreLavorateStore = {
  put: jest.fn().mockResolvedValue(),
  toArray: jest.fn().mockResolvedValue([]),
  delete: jest.fn().mockResolvedValue(),
  clear: jest.fn().mockResolvedValue(),
};

const mockSettings = {
  put: jest.fn().mockResolvedValue(),
  get: jest.fn().mockResolvedValue(null),
};

jest.mock('dexie', () => {
  return jest.fn(() => ({
    version: jest.fn(() => ({
      stores: jest.fn(),
    })),
    get oreLavorateStore() {
      return mockOreLavorateStore;
    },
    get settings() {
      return mockSettings;
    },
  }));
});

import Dexie from 'dexie';
import {
  saveOreLavorate,
  loadOreLavorate,
  savePagaOraria,
  loadPagaOraria,
  deleteOreLavorate,
  deleteAllOreLavorate,
} from '../../src/db/local-storage-manager';

describe('database', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockOreLavorateStore.toArray.mockResolvedValue([]);
    mockSettings.get.mockResolvedValue(null);
  });

  describe('saveOreLavorate', () => {
    it('should save worked hours for a date', async () => {
      await saveOreLavorate('2024-01-15', 8.5);

      expect(mockOreLavorateStore.put).toHaveBeenCalledWith({ date: '2024-01-15', hours: 8.5 });
    });
  });

  describe('loadOreLavorate', () => {
    it('should load all worked hours as an object', async () => {
      const mockData = [
        { date: '2024-01-15', hours: 8.5 },
        { date: '2024-01-16', hours: 7.5 },
      ];
      mockOreLavorateStore.toArray.mockResolvedValue(mockData);

      const result = await loadOreLavorate();

      expect(result).toEqual({
        '2024-01-15': 8.5,
        '2024-01-16': 7.5,
      });
    });

    it('should return empty object when no data exists', async () => {
      mockOreLavorateStore.toArray.mockResolvedValue([]);

      const result = await loadOreLavorate();

      expect(result).toEqual({});
    });
  });

  describe('savePagaOraria', () => {
    it('should save hourly rate to localStorage and database', async () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

      await savePagaOraria(15.5);

      expect(setItemSpy).toHaveBeenCalledWith('pagaOraria', '15.5');
      expect(mockSettings.put).toHaveBeenCalledWith({ id: 1, pagaOraria: 15.5 });
    });
  });

  describe('loadPagaOraria', () => {
    it('should load hourly rate from localStorage if available', async () => {
      localStorage.setItem('pagaOraria', '15.5');

      const result = await loadPagaOraria();

      expect(result).toBe(15.5);
    });

    it('should load from database if localStorage is empty', async () => {
      localStorage.removeItem('pagaOraria');
      mockSettings.get.mockResolvedValue({ id: 1, pagaOraria: 12.5 });

      const result = await loadPagaOraria();

      expect(result).toBe(12.5);
    });

    it('should return default value of 10 if no data exists', async () => {
      localStorage.removeItem('pagaOraria');
      mockSettings.get.mockResolvedValue(null);

      const result = await loadPagaOraria();

      expect(result).toBe(10);
    });
  });

  describe('deleteOreLavorate', () => {
    it('should delete worked hours for a specific date', async () => {
      await deleteOreLavorate('2024-01-15');

      expect(mockOreLavorateStore.delete).toHaveBeenCalledWith('2024-01-15');
    });
  });

  describe('deleteAllOreLavorate', () => {
    it('should clear all worked hours', async () => {
      await deleteAllOreLavorate();

      expect(mockOreLavorateStore.clear).toHaveBeenCalled();
    });
  });
});
