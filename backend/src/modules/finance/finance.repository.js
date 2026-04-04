'use strict';

const BaseRepository        = require('../../repositories/base.repository');
const { Transaction }       = require('./models/transaction.model');
const Category              = require('./models/category.model');

class TransactionRepository extends BaseRepository {
  constructor() {
    super(Transaction);
  }

  async findAllWithCategory({ filter, sort, skip, limit }) {
    return this.findMany({
      filter,
      sort,
      skip,
      limit,
      populate: [{ path: 'category', select: 'name color icon' }],
    });
  }

  async findByIdWithCategory(id) {
    return this.findById(id, {
      populate: [{ path: 'category', select: 'name color icon' }],
    });
  }

  async countActive(filter = {}) {
    return this.count({ ...filter, deletedAt: null });
  }

  async softDelete(id, deletedBy) {
    return this.updateById(id, { deletedAt: new Date(), deletedBy });
  }
}

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  async findAllActive({ filter = {}, sort, skip, limit } = {}) {
    return this.findMany({
      filter: { ...filter, deletedAt: null },
      sort,
      skip,
      limit,
    });
  }

  async countActive(filter = {}) {
    return this.count({ ...filter, deletedAt: null });
  }

  async softDelete(id, deletedBy) {
    return this.updateById(id, { deletedAt: new Date(), deletedBy });
  }
}

module.exports = {
  transactionRepository: new TransactionRepository(),
  categoryRepository:    new CategoryRepository(),
};
