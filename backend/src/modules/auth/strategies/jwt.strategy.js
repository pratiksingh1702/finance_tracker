
'use strict';

const { verifyAccessToken } = require('../../../services/token.service');
const ApiError              = require('../../../utils/api-error.util');

/**
 * Extract and verify the Bearer token from the Authorization header.
 * Returns the decoded payload or throws an ApiError.
 *
 * This is a plain function strategy (not Passport) to keep deps minimal.
 *
 * @param {string} authHeader - req.headers.authorization
 * @returns {object} decoded JWT payload { id, email, role }
 */
const jwtStrategy = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No bearer token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    return verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Access token has expired.');
    }
    throw ApiError.unauthorized('Invalid access token.');
  }
};

module.exports = { jwtStrategy };
