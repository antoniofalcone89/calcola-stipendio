import { convertTimeToHours, formatTimeFromHours } from '../../src/utils/timeUtils';

describe('timeUtils', () => {
  describe('convertTimeToHours', () => {
    it('should convert time string to decimal hours correctly', () => {
      expect(convertTimeToHours('08.30')).toBe(8.5);
      expect(convertTimeToHours('08.00')).toBe(8);
      expect(convertTimeToHours('12.15')).toBe(12.25);
      expect(convertTimeToHours('00.30')).toBe(0.5);
      expect(convertTimeToHours('23.45')).toBe(23.75);
    });

    it('should return 0 for empty or null input', () => {
      expect(convertTimeToHours('')).toBe(0);
      expect(convertTimeToHours(null)).toBe(0);
      expect(convertTimeToHours(undefined)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(convertTimeToHours('00.00')).toBe(0);
      expect(convertTimeToHours('24.00')).toBe(24);
    });
  });

  describe('formatTimeFromHours', () => {
    it('should format decimal hours to time string correctly', () => {
      expect(formatTimeFromHours(8.5)).toBe('08.30');
      expect(formatTimeFromHours(8)).toBe('08.00');
      expect(formatTimeFromHours(12.25)).toBe('12.15');
      expect(formatTimeFromHours(0.5)).toBe('00.30');
      expect(formatTimeFromHours(23.75)).toBe('23.45');
    });

    it('should handle zero hours', () => {
      expect(formatTimeFromHours(0)).toBe('00.00');
    });

    it('should pad hours and minutes with zeros', () => {
      expect(formatTimeFromHours(1.5)).toBe('01.30');
      expect(formatTimeFromHours(5.05)).toBe('05.03');
    });

    it('should round minutes correctly', () => {
      expect(formatTimeFromHours(8.166666)).toBe('08.10');
      expect(formatTimeFromHours(8.833333)).toBe('08.50');
    });

    it('should handle large hours', () => {
      expect(formatTimeFromHours(100.5)).toBe('100.30');
    });
  });

  describe('round-trip conversion', () => {
    it('should convert and format back correctly', () => {
      const testCases = ['08.30', '12.15', '00.30', '23.45', '08.00'];
      testCases.forEach(timeString => {
        const hours = convertTimeToHours(timeString);
        const formatted = formatTimeFromHours(hours);
        expect(formatted).toBe(timeString);
      });
    });
  });
});
