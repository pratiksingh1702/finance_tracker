'use strict';

const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config');

/**
 * Generate an access token.
 * @param {object} payload - { id, role, email }
 * @returns {string}
 */
const generateAccessToken = (payload) =>
  jwt.sign(payload, jwtConfig.accessSecret, { expiresIn: jwtConfig.accessExpiry });

/**
 * Generate a refresh token.
 * @param {object} payload
 * @returns {string}
 */
const generateRefreshToken = (payload) =>
  jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiry });

/**
 * Verify an access token.
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyAccessToken = (token) => jwt.verify(token, jwtConfig.accessSecret);

/**
 * Verify a refresh token.
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyRefreshToken = (token) => jwt.verify(token, jwtConfig.refreshSecret);

/**
 * Generate both tokens at once and return them with expiry info.
 * @param {object} payload
 * @returns {{ accessToken, refreshToken, expiresIn }}
 */
const generateTokenPair = (payload) => ({
  accessToken:  generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
  expiresIn:    jwtConfig.accessExpiry,
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
};
