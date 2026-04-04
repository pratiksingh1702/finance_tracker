'use strict';

/**
 * Translates flat req.query filter params into a Mongoose-compatible
 * filter object, supporting operators like gte, lte, in, regex, etc.
 */

const ALLOWED_OPERATORS = ['gte', 'gt', 'lte', 'lt', 'ne', 'in', 'nin'];

/**
 * Parse a query string value that may encode a mongo operator.
 * e.g. "gte:100" → { $gte: 100 }
 *      "in:food,travel" → { $in: ['food','travel'] }
 *
 * @param {string} raw
 * @returns {*}
 */
const parseValue = (raw) => {
  if (typeof raw !== 'string') {
    return raw;
  }

  for (const op of ALLOWED_OPERATORS) {
    const prefix = `${op}:`;
    if (raw.startsWith(prefix)) {
      const val = raw.slice(prefix.length);

      if (op === 'in' || op === 'nin') {
        return { [`$${op}`]: val.split(',').map((v) => v.trim()) };
      }

      const numeric = Number(val);
      return { [`$${op}`]: isNaN(numeric) ? val : numeric };
    }
  }

  return raw;
};

/**
 * Build a Mongoose filter from allowed fields in req.query.
 *
 * @param {object}   query         - req.query
 * @param {string[]} allowedFields - whitelist of filterable field names
 * @returns {object} Mongoose filter object
 */
const buildFilter = (query, allowedFields = []) => {
  const filter = {};

  for (const field of allowedFields) {
    if (query[field] === undefined || query[field] === null || query[field] === '') {
      continue;
    }

    const parsed = parseValue(query[field]);

    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      filter[field] = parsed;
    } else {
      filter[field] = parsed;
    }
  }

  return filter;
};

/**
 * Build a date-range filter for a given field.
 *
 * @param {string}      field
 * @param {string|Date} [from]
 * @param {string|Date} [to]
 * @returns {object}
 */
const buildDateRangeFilter = (field, from, to) => {
  const condition = {};

  if (from) {
    condition.$gte = new Date(from);
  }
  if (to) {
    condition.$lte = new Date(to);
  }

  return Object.keys(condition).length ? { [field]: condition } : {};
};

/**
 * Build a text search (case-insensitive regex) filter.
 *
 * @param {string[]} fields - fields to search across
 * @param {string}   term   - search term
 * @returns {object}
 */
const buildSearchFilter = (fields, term) => {
  if (!term || !fields.length) {
    return {};
  }

  const regex = { $regex: term.trim(), $options: 'i' };
  return { $or: fields.map((f) => ({ [f]: regex })) };
};

module.exports = { buildFilter, buildDateRangeFilter, buildSearchFilter };
