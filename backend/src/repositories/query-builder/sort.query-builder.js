'use strict';

const SORT_DIRECTION_MAP = { asc: 1, desc: -1, '1': 1, '-1': -1 };
const DEFAULT_SORT = { createdAt: -1 };

/**
 * Parse sort params from req.query into a Mongoose sort object.
 *
 * Accepts:
 *   ?sortBy=amount&sortOrder=asc   → { amount: 1 }
 *   ?sortBy=-createdAt             → { createdAt: -1 }
 *
 * @param {object}   query         - req.query
 * @param {string[]} allowedFields - whitelist of sortable field names
 * @returns {object} Mongoose sort object
 */
const buildSort = (query, allowedFields = []) => {
  const { sortBy, sortOrder = 'desc' } = query;

  if (!sortBy) {
    return DEFAULT_SORT;
  }

  // Handle "-field" notation
  let field     = sortBy;
  let direction = SORT_DIRECTION_MAP[sortOrder] ?? -1;

  if (sortBy.startsWith('-')) {
    field     = sortBy.slice(1);
    direction = -1;
  }

  if (allowedFields.length && !allowedFields.includes(field)) {
    return DEFAULT_SORT;
  }

  return { [field]: direction };
};

module.exports = { buildSort };
