/**
 * Converts a time string (HH.mm) to decimal hours
 * @param {string} timeString - Time in format HH.mm
 * @returns {number} Decimal hours
 */
export const convertTimeToHours = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(".").map(Number);
  return hours + minutes / 60;
};

/**
 * Formats decimal hours to time string (HH.mm)
 * @param {number} hours - Decimal hours
 * @returns {string} Time string in format HH.mm
 */
export const formatTimeFromHours = (hours) => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours.toString().padStart(2, "0")}.${minutes.toString().padStart(2, "0")}`;
};
