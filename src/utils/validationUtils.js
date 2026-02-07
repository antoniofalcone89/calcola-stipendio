/**
 * Validates if a string matches the time format HH.mm
 * @param {string} time - Time string to validate
 * @returns {boolean} True if valid format
 */
export const isValidTimeFormat = (time) => {
  return /^([0-1]?[0-9]|2[0-3])([.,][0-5][0-9])?$/.test(time);
};
