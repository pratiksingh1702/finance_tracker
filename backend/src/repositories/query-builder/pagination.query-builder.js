'use strict';

const { parsePagination } = require('../../utils/paginate.util');

/**
 * Parse pagination params from req.query and return
 * page / limit / skip values ready for Mongoose.
 *
 * @param {object} query - req.query
 * @returns {{ page: number, limit: number, skip: number }}
 */
const buildPagination = (query = {}) => parsePagination(query);

module.exports = { buildPagination };
