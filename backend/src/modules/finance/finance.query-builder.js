'use strict';

const { buildDateRangeFilter, buildSearchFilter } = require('../../repositories/query-builder/filter.query-builder');
const { buildSort }       = require('../../repositories/query-builder/sort.query-builder');
const { buildPagination } = require('../../repositories/query-builder/pagination.query-builder');

const SORT_FIELDS = ['date', 'amount', 'title', 'createdAt'];

/**
 * Build a complete Mongoose query plan from validated filter params.
 *
 * @param {object} params - Validated query params (from filterTransactionSchema)
 * @returns {{ filter, sort, skip, limit, page }}
 */
const buildTransactionQuery = (params = {}) => {
  const filter = { deletedAt: null };

  // ── Type & Status ──────────────────────────────────────────────────────────
  if (params.type)     { filter.type   = params.type; }
  if (params.status)   { filter.status = params.status; }
  if (params.category) { filter.category = params.category; }

  // ── Date range ─────────────────────────────────────────────────────────────
  const dateFilter = buildDateRangeFilter('date', params.from, params.to);
  if (Object.keys(dateFilter).length) {
    Object.assign(filter, dateFilter);
  }

  // ── Amount range ───────────────────────────────────────────────────────────
  if (params.minAmount !== undefined || params.maxAmount !== undefined) {
    filter.amount = {};
    if (params.minAmount !== undefined) { filter.amount.$gte = params.minAmount; }
    if (params.maxAmount !== undefined) { filter.amount.$lte = params.maxAmount; }
  }

  // ── Tags ───────────────────────────────────────────────────────────────────
  if (params.tags) {
    const tagList = params.tags.split(',').map((t) => t.trim()).filter(Boolean);
    if (tagList.length) { filter.tags = { $in: tagList }; }
  }

  // ── Full-text search across title and notes ────────────────────────────────
  if (params.search) {
    const searchFilter = buildSearchFilter(['title', 'notes'], params.search);
    if (searchFilter.$or) {
      filter.$or = searchFilter.$or;
    }
  }

  // ── Pagination & Sort ──────────────────────────────────────────────────────
  const { page, limit, skip } = buildPagination(params);
  const sort = buildSort(params, SORT_FIELDS);

  return { filter, sort, skip, limit, page };
};

module.exports = { buildTransactionQuery };
