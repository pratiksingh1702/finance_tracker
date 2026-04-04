'use strict';

/**
 * Parse and normalise pagination params from a query string.
 * @param {object} query - req.query
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePagination = (query = {}) => {
  const page  = Math.max(1, parseInt(query.page,  10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { parsePagination };
