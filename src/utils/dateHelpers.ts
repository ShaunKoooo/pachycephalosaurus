/**
 * Get local date string in YYYY-MM-DD format
 * This ensures the date is in local timezone, not UTC
 */
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in local timezone as YYYY-MM-DD string
 */
export const getTodayString = (): string => {
  return getLocalDateString(new Date());
};
