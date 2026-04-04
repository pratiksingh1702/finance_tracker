'use strict';

const { paginationMeta } = require('../utils/api-response.util');
const { parsePagination } = require('../utils/paginate.util');

/**
 * Execute a paginated query against a repository.
 *
 * @param {object}   opts
 * @param {object}   opts.query         - req.query (for page/limit)
 * @param {Function} opts.findFn        - async () => [docs]
 * @param {Function} opts.countFn       - async () => number
 * @returns {Promise<{ data: Array, meta: object }>}
 */
const paginate = async ({ query, findFn, countFn }) => {
  const { page, limit, skip } = parsePagination(query);

  const [data, total] = await Promise.all([findFn({ skip, limit }), countFn()]);

  return {
    data,
    meta: paginationMeta({ total, page, limit }),
  };
};

module.exports = { paginate };
