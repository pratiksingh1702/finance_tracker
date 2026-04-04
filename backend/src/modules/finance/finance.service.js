'use strict';

const { transactionRepository, categoryRepository } = require('./finance.repository');
const { buildTransactionQuery } = require('./finance.query-builder');
const auditService  = require('../../services/audit.service');
const ApiError      = require('../../utils/api-error.util');
const { buildSort } = require('../../repositories/query-builder/sort.query-builder');
const { buildPagination } = require('../../repositories/query-builder/pagination.query-builder');

// ══════════════════════════════════════════════════════════════════════════════
// Transaction Service
// ══════════════════════════════════════════════════════════════════════════════
class TransactionService {

  async create(dto, actor) {
    // Ensure category exists and is active
    const category = await categoryRepository.findById(dto.category);
    if (!category || category.deletedAt) {
      throw ApiError.notFound(`Category '${dto.category}' not found.`);
    }

    const transaction = await transactionRepository.create({
      ...dto,
      createdBy: actor.id,
    });

    auditService.log({
      action:     'CREATE_TRANSACTION',
      resource:   'Transaction',
      resourceId: String(transaction._id),
      actor,
      after:      transaction,
    });

    return transactionRepository.findByIdWithCategory(transaction._id);
  }

  async list(queryParams) {
    const { filter, sort, skip, limit, page } = buildTransactionQuery(queryParams);

    const [data, total] = await Promise.all([
      transactionRepository.findAllWithCategory({ filter, sort, skip, limit }),
      transactionRepository.countActive(filter),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages:  Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async getById(id) {
    const transaction = await transactionRepository.findByIdWithCategory(id);
    if (!transaction || transaction.deletedAt) {
      throw ApiError.notFound('Transaction not found.');
    }
    return transaction;
  }

  async update(id, dto, actor) {
    const existing = await this.getById(id);

    if (dto.category) {
      const category = await categoryRepository.findById(dto.category);
      if (!category || category.deletedAt) {
        throw ApiError.notFound(`Category '${dto.category}' not found.`);
      }
    }

    const updated = await transactionRepository.updateById(id, {
      ...dto,
      updatedBy: actor.id,
    });

    auditService.log({
      action:     'UPDATE_TRANSACTION',
      resource:   'Transaction',
      resourceId: id,
      actor,
      before:     existing,
      after:      updated,
    });

    return transactionRepository.findByIdWithCategory(id);
  }

  async remove(id, actor) {
    await this.getById(id);
    const deleted = await transactionRepository.softDelete(id, actor.id);

    auditService.log({
      action:     'DELETE_TRANSACTION',
      resource:   'Transaction',
      resourceId: id,
      actor,
    });

    return deleted;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Category Service
// ══════════════════════════════════════════════════════════════════════════════
class CategoryService {

  async create(dto, actor) {
    const exists = await categoryRepository.findOne({ name: dto.name, deletedAt: null });
    if (exists) {
      throw ApiError.conflict(`Category '${dto.name}' already exists.`);
    }

    const category = await categoryRepository.create({ ...dto, createdBy: actor.id });

    auditService.log({ action: 'CREATE_CATEGORY', resource: 'Category', resourceId: String(category._id), actor });
    return category;
  }

  async list(query) {
    const { page, limit, skip } = buildPagination(query);
    const sort = buildSort(query, ['name', 'createdAt']);

    const [data, total] = await Promise.all([
      categoryRepository.findAllActive({ sort, skip, limit }),
      categoryRepository.countActive(),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const category = await categoryRepository.findById(id);
    if (!category || category.deletedAt) {
      throw ApiError.notFound('Category not found.');
    }
    return category;
  }

  async update(id, dto, actor) {
    await this.getById(id);

    if (dto.name) {
      const conflict = await categoryRepository.findOne({ name: dto.name, deletedAt: null });
      if (conflict && String(conflict._id) !== id) {
        throw ApiError.conflict(`Category name '${dto.name}' is already taken.`);
      }
    }

    const updated = await categoryRepository.updateById(id, { ...dto, updatedBy: actor.id });
    auditService.log({ action: 'UPDATE_CATEGORY', resource: 'Category', resourceId: id, actor });
    return updated;
  }

  async remove(id, actor) {
    await this.getById(id);
    const deleted = await categoryRepository.softDelete(id, actor.id);
    auditService.log({ action: 'DELETE_CATEGORY', resource: 'Category', resourceId: id, actor });
    return deleted;
  }
}

module.exports = {
  transactionService: new TransactionService(),
  categoryService:    new CategoryService(),
};
