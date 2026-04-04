'use strict';

const ApiError    = require('../utils/api-error.util');
const { sendError } = require('../utils/api-response.util');
const logger      = require('../logs/logger');

/**
 * Global error-handling middleware.
 * Must be registered *last* in app.js (Express identifies it by the 4-arg signature).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  // Log every error for observability
  logger.error({
    message:    err.message,
    stack:      err.stack,
    path:       req.path,
    method:     req.method,
    statusCode: err.statusCode,
    user:       req.user?.id ?? 'unauthenticated',
  });

  // ── Mongoose / MongoDB errors ────────────────────────────────────────────────
  if (err.name === 'CastError') {
    return sendError(res, { message: `Invalid ${err.path}: ${err.value}`, statusCode: 400 });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {}).join(', ');
    return sendError(res, {
      message:    `Duplicate value for field: ${field}`,
      statusCode: 409,
    });
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field:   e.path,
      message: e.message,
    }));
    return sendError(res, { message: 'Validation failed.', statusCode: 422, errors });
  }

  // ── JWT errors ───────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, { message: 'Invalid token.', statusCode: 401 });
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, { message: 'Token has expired.', statusCode: 401 });
  }

  // ── Operational (ApiError) ───────────────────────────────────────────────────
  if (err instanceof ApiError) {
    return sendError(res, {
      message:    err.message,
      statusCode: err.statusCode,
      errors:     err.errors,
    });
  }

  // ── Unknown / programmer errors ──────────────────────────────────────────────
  const statusCode = err.statusCode || 500;
  const message    =
    process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;

  return sendError(res, { message, statusCode });
};

module.exports = errorHandler;
