'use strict';

/**
 * Utility functions for date manipulation and formatting.
 */

/**
 * Format a date as YYYY-MM-DD.
 * @param {Date|string} date
 * @returns {string}
 */
const formatToISODate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Get the start of the current month.
 * @returns {Date}
 */
const getStartOfMonth = () => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get the end of the current month.
 * @returns {Date}
 */
const getEndOfMonth = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Calculate the number of days between two dates.
 * @param {Date|string} date1
 * @param {Date|string} date2
 * @returns {number}
 */
const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = {
  formatToISODate,
  getStartOfMonth,
  getEndOfMonth,
  daysBetween,
};
