'use strict';

const userRepository  = require('../../user/user.repository');
const passwordService = require('../../../services/password.service');
const ApiError        = require('../../../utils/api-error.util');

/**
 * Local (email + password) authentication strategy.
 * Looks up the user by email and verifies the password hash.
 *
 * @param {string} email
 * @param {string} plainPassword
 * @returns {Promise<object>} user document (without password)
 */
const localStrategy = async (email, plainPassword) => {
  const user = await userRepository.findByEmail(email, true); // +password

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  if (!user.isActive || user.deletedAt) {
    throw ApiError.unauthorized('Your account is inactive. Please contact an administrator.');
  }

  const passwordMatch = await passwordService.verify(plainPassword, user.password);
  if (!passwordMatch) {
    throw ApiError.unauthorized('Invalid email or password.');
  }

  const { password: _pw, ...safeUser } = user;
  return safeUser;
};

module.exports = { localStrategy };
