import { 
  saveOreLavorateFS, 
  loadOreLavorateFS, 
  deleteOreLavorateFS, 
  deleteAllOreLavorateFS, 
  savePagaOrariaFS, 
  loadPagaOrariaFS 
} from '../../src/db/firestore';
import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  writeBatch 
} from 'firebase/firestore';

// Mock Firebase functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  deleteDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  writeBatch: jest.fn(),
  getFirestore: jest.fn(),
}));

jest.mock('../../src/config/firebase', () => ({
  db: {},
}));

describe('Firestore Operations', () => {
  const mockUserId = 'test-user-id';
  const mockDate = '2024-01-01';
  const mockHours = 8;
  const mockPagaOraria = 15;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveOreLavorateFS', () => {
    it('should save work hours to Firestore', async () => {
      const mockDocRef = { id: 'doc-ref' };
      doc.mockReturnValue(mockDocRef);

      await saveOreLavorateFS(mockUserId, mockDate, mockHours);

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', mockUserId, 'oreLavorate', mockDate);
      expect(setDoc).toHaveBeenCalledWith(mockDocRef, { date: mockDate, hours: mockHours });
    });
  });

  describe('loadOreLavorateFS', () => {
    it('should load work hours from Firestore', async () => {
      const mockData = { date: mockDate, hours: mockHours };
      const mockSnapshot = {
        forEach: (callback) => {
          callback({ data: () => mockData });
        },
      };
      getDocs.mockResolvedValue(mockSnapshot);

      const result = await loadOreLavorateFS(mockUserId);

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'users', mockUserId, 'oreLavorate');
      expect(getDocs).toHaveBeenCalled();
      expect(result).toEqual({ [mockDate]: mockHours });
    });

    it('should return empty object if no data found', async () => {
      const mockSnapshot = {
        forEach: () => {},
      };
      getDocs.mockResolvedValue(mockSnapshot);

      const result = await loadOreLavorateFS(mockUserId);

      expect(result).toEqual({});
    });
  });

  describe('deleteOreLavorateFS', () => {
    it('should delete work hours from Firestore', async () => {
      const mockDocRef = { id: 'doc-ref' };
      doc.mockReturnValue(mockDocRef);

      await deleteOreLavorateFS(mockUserId, mockDate);

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', mockUserId, 'oreLavorate', mockDate);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });

  describe('deleteAllOreLavorateFS', () => {
    it('should delete all work hours for user', async () => {
      const mockBatch = {
        delete: jest.fn(),
        commit: jest.fn().mockResolvedValue(),
      };
      writeBatch.mockReturnValue(mockBatch);
      
      const mockDoc = { ref: 'doc-ref' };
      const mockSnapshot = {
        forEach: (callback) => {
          callback(mockDoc);
        },
      };
      getDocs.mockResolvedValue(mockSnapshot);

      await deleteAllOreLavorateFS(mockUserId);

      expect(collection).toHaveBeenCalledWith(expect.anything(), 'users', mockUserId, 'oreLavorate');
      expect(getDocs).toHaveBeenCalled();
      expect(writeBatch).toHaveBeenCalled();
      expect(mockBatch.delete).toHaveBeenCalledWith(mockDoc.ref);
      expect(mockBatch.commit).toHaveBeenCalled();
    });
  });

  describe('savePagaOrariaFS', () => {
    it('should save hourly rate to Firestore', async () => {
      const mockDocRef = { id: 'doc-ref' };
      doc.mockReturnValue(mockDocRef);

      await savePagaOrariaFS(mockUserId, mockPagaOraria);

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', mockUserId);
      expect(setDoc).toHaveBeenCalledWith(mockDocRef, { pagaOraria: mockPagaOraria }, { merge: true });
    });
  });

  describe('loadPagaOrariaFS', () => {
    it('should load hourly rate from Firestore', async () => {
      const mockDocRef = { id: 'doc-ref' };
      const mockDocSnap = {
        exists: () => true,
        data: () => ({ pagaOraria: mockPagaOraria }),
      };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnap);

      const result = await loadPagaOrariaFS(mockUserId);

      expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', mockUserId);
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toBe(mockPagaOraria);
    });

    it('should return default value (10) if document does not exist', async () => {
      const mockDocRef = { id: 'doc-ref' };
      const mockDocSnap = {
        exists: () => false,
      };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnap);

      const result = await loadPagaOrariaFS(mockUserId);

      expect(result).toBe(10);
    });

    it('should return default value (10) if pagaOraria field is missing', async () => {
      const mockDocRef = { id: 'doc-ref' };
      const mockDocSnap = {
        exists: () => true,
        data: () => ({}),
      };
      doc.mockReturnValue(mockDocRef);
      getDoc.mockResolvedValue(mockDocSnap);

      const result = await loadPagaOrariaFS(mockUserId);

      expect(result).toBe(10);
    });
  });
});
