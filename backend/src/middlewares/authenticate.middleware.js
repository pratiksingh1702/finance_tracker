'use strict';

const { verifyAccessToken } = require('../services/token.service');
const ApiError               = require('../utils/api-error.util');
const asyncHandler           = require('../utils/async-handler.util');

/**
 * Authenticate middleware.
 *
 * Reads the Bearer token from the Authorization header, verifies it,
 * and attaches the decoded user payload to `req.user`.
 *
 * Throws 401 if the token is missing, malformed, or expired.
 */
const authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No bearer token provided.');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Access token has expired.');
    }
    throw ApiError.unauthorized('Invalid access token.');
  }

  // Attach minimal user context — services can hydrate further if needed
  req.user = {
    id:    decoded.id,
    email: decoded.email,
    role:  decoded.role,
  };

  next();
});

module.exports = authenticate;
