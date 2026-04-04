'use strict';

const ApiError = require('../utils/api-error.util');

/**
 * 404 catch-all — must be registered after all routes.
 */
const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found.`));
};

module.exports = notFound;
