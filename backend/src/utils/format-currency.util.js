'use strict';

/**
 * Format a number as a currency string.
 * @param {number} amount
 * @param {string} [currency='USD']
 * @param {string} [locale='en-US']
 * @returns {string}
 */
const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Round a number to 2 decimal places (safe for financial math).
 * @param {number} amount
 * @returns {number}
 */
const roundAmount = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;

module.exports = { formatCurrency, roundAmount };
