'use strict';

const BaseRepository = require('../../repositories/base.repository');
const User           = require('../user/models/user.model');

/**
 * AuthRepository — thin wrapper used only for auth-specific queries
 * (e.g. recording last login timestamp).
 * General user lookups are delegated to userRepository.
 */
class AuthRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async recordLogin(userId) {
    return this.updateById(userId, { lastLoginAt: new Date() });
  }
}

module.exports = new AuthRepository();
