/**
 * Converts a time string (HH.mm) to decimal hours
 * @param {string} timeString - Time in format HH.mm
 * @returns {number} Decimal hours
 */
export const convertTimeToHours = (timeString) => {
  if (!timeString) return 0;
  if (timeString.includes('.') || timeString.includes(',')) {
    const [hoursStr, minutesStr] = timeString.replace(',', '.').split('.');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    return (Number.isFinite(hours) ? hours : 0) + (Number.isFinite(minutes) ? minutes : 0) / 60;
  }
  const hoursOnly = parseInt(timeString, 10);
  return Number.isFinite(hoursOnly) ? hoursOnly : 0;
};

/**
 * Groups worked hours by month
 * @param {Object} oreLavorate - Map of date strings to hours
 * @returns {Object} Map of "YYYY-MM" keys to { totalHours, days }
 */
export const groupByMonth = (oreLavorate) => {
  const months = {};
  Object.entries(oreLavorate || {}).forEach(([date, hours]) => {
    const month = date.slice(0, 7);
    if (!months[month]) {
      months[month] = { totalHours: 0, days: {} };
    }
    months[month].totalHours += hours;
    months[month].days[date] = hours;
  });
  return months;
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
