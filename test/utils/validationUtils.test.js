import { isValidTimeFormat } from '../../src/utils/validationUtils';

describe('validationUtils', () => {
  describe('isValidTimeFormat', () => {
    it('should validate correct time formats', () => {
      expect(isValidTimeFormat('08.30')).toBe(true);
      expect(isValidTimeFormat('08.00')).toBe(true);
      expect(isValidTimeFormat('12.15')).toBe(true);
      expect(isValidTimeFormat('00.00')).toBe(true);
      expect(isValidTimeFormat('23.59')).toBe(true);
      expect(isValidTimeFormat('9.30')).toBe(true);
      expect(isValidTimeFormat('09.5')).toBe(false); // missing leading zero in minutes
    });

    it('should reject invalid time formats', () => {
      expect(isValidTimeFormat('24.00')).toBe(false); // hours > 23
      expect(isValidTimeFormat('08.60')).toBe(false); // minutes > 59
      expect(isValidTimeFormat('25.00')).toBe(false); // hours > 23
      expect(isValidTimeFormat('08.99')).toBe(false); // minutes > 59
      expect(isValidTimeFormat('8:30')).toBe(false); // wrong separator
      expect(isValidTimeFormat('08-30')).toBe(false); // wrong separator
      expect(isValidTimeFormat('0830')).toBe(false); // missing separator
      expect(isValidTimeFormat('abc.def')).toBe(false); // non-numeric
      expect(isValidTimeFormat('')).toBe(false); // empty string
    });

    it('should handle edge cases', () => {
      expect(isValidTimeFormat('00.00')).toBe(true);
      expect(isValidTimeFormat('23.59')).toBe(true);
      expect(isValidTimeFormat('0.0')).toBe(false); // missing leading zeros
      expect(isValidTimeFormat('00.0')).toBe(false); // missing leading zero in minutes
    });

    it('should reject null and undefined', () => {
      expect(isValidTimeFormat(null)).toBe(false);
      expect(isValidTimeFormat(undefined)).toBe(false);
    });
  });
});
