'use strict';

const BaseRepository = require('../../repositories/base.repository');
const User           = require('./models/user.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find a user by email, optionally including the password field.
   */
  async findByEmail(email, withPassword = false) {
    let query = this.model.findOne({ email, deletedAt: null });
    if (withPassword) {
      query = query.select('+password');
    }
    return query.lean().exec();
  }

  /**
   * Find all non-deleted users with optional filter.
   */
  async findAllActive({ filter = {}, sort, skip, limit } = {}) {
    return this.findMany({
      filter: { ...filter, deletedAt: null },
      sort,
      skip,
      limit,
    });
  }

  /**
   * Count non-deleted users matching a filter.
   */
  async countActive(filter = {}) {
    return this.count({ ...filter, deletedAt: null });
  }

  /**
   * Soft-delete a user.
   */
  async softDelete(id, deletedBy) {
    return this.updateById(id, { deletedAt: new Date(), deletedBy });
  }
}

module.exports = new UserRepository();
