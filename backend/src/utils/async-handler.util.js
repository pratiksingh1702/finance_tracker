'use strict';

/**
 * Higher-order function to wrap async Express route handlers.
 * Catches rejected promises and passes them to the next error-handling middleware.
 *
 * @param {function} fn - The async route handler function.
 * @returns {function} Wrapped Express middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
