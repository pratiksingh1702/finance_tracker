'use strict';

/**
 * Standardized API response helpers.
 * Ensures consistent JSON structure across all endpoints.
 */

/**
 * Send a success response.
 * @param {object} res - Express response object
 * @param {object} options - Response options
 * @param {any} options.data - Payload to send
 * @param {string} options.message - Success message
 * @param {number} [options.statusCode=200] - HTTP status code
 * @param {object} [options.meta] - Pagination or other metadata
 */
const sendSuccess = (res, { data = null, message = 'Success', statusCode = 200, meta = null }) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response.
 * @param {object} res - Express response object
 * @param {object} options - Error options
 * @param {string} options.message - Error message
 * @param {number} [options.statusCode=500] - HTTP status code
 * @param {string} [options.stack] - Error stack trace (optional, for development)
 */
const sendError = (res, { message = 'Internal Server Error', statusCode = 500, stack = null }) => {
  const response = {
    success: false,
    message,
  };

  if (stack && process.env.NODE_ENV === 'development') {
    response.stack = stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
};
