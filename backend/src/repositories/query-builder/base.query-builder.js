'use strict';

/**
 * BaseQueryBuilder
 * Fluent builder that accumulates Mongoose query options
 * and resolves them when .build() is called.
 */
class BaseQueryBuilder {
  constructor() {
    this._filter = {};
    this._sort   = { createdAt: -1 };
    this._skip   = 0;
    this._limit  = 20;
    this._select = null;
    this._populate = [];
  }

  /**
   * Merge additional filter conditions.
   * @param {object} conditions
   * @returns {this}
   */
  where(conditions) {
    Object.assign(this._filter, conditions);
    return this;
  }

  /**
   * Set sort order.
   * @param {object|string} sort - e.g. { createdAt: -1 } or '-createdAt'
   * @returns {this}
   */
  sort(sort) {
    if (typeof sort === 'string') {
      const direction = sort.startsWith('-') ? -1 : 1;
      const field     = sort.replace(/^-/, '');
      this._sort = { [field]: direction };
    } else {
      this._sort = sort;
    }
    return this;
  }

  /**
   * Set skip offset.
   * @param {number} skip
   * @returns {this}
   */
  skip(skip) {
    this._skip = skip;
    return this;
  }

  /**
   * Set result limit.
   * @param {number} limit
   * @returns {this}
   */
  limit(limit) {
    this._limit = limit;
    return this;
  }

  /**
   * Select specific fields.
   * @param {string} fields - space-separated field names
   * @returns {this}
   */
  select(fields) {
    this._select = fields;
    return this;
  }

  /**
   * Populate a relation.
   * @param {string|object} path
   * @returns {this}
   */
  populate(path) {
    this._populate.push(path);
    return this;
  }

  /**
   * Return the accumulated query options.
   * @returns {{ filter, sort, skip, limit, select, populate }}
   */
  build() {
    return {
      filter:   this._filter,
      sort:     this._sort,
      skip:     this._skip,
      limit:    this._limit,
      select:   this._select,
      populate: this._populate,
    };
  }
}

module.exports = BaseQueryBuilder;
