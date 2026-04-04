'use strict';

/**
 * BaseRepository
 * Generic data-access layer that every module repository extends.
 * Encapsulates all Mongoose calls so services stay DB-agnostic.
 */
class BaseRepository {
  /**
   * @param {mongoose.Model} model
   */
  constructor(model) {
    this.model = model;
  }

  // ── Create ──────────────────────────────────────────────────────────────────

  async create(data) {
    const doc = new this.model(data);
    return doc.save();
  }

  async createMany(dataArray) {
    return this.model.insertMany(dataArray, { ordered: false });
  }

  // ── Read ────────────────────────────────────────────────────────────────────

  async findById(id, options = {}) {
    let query = this.model.findById(id);
    if (options.select)   { query = query.select(options.select); }
    if (options.populate) { options.populate.forEach((p) => { query = query.populate(p); }); }
    return query.lean(options.lean ?? true).exec();
  }

  async findOne(filter, options = {}) {
    let query = this.model.findOne(filter);
    if (options.select)   { query = query.select(options.select); }
    if (options.populate) { options.populate.forEach((p) => { query = query.populate(p); }); }
    return query.lean(options.lean ?? true).exec();
  }

  /**
   * Find many documents with full query options.
   * @param {object} opts
   * @param {object}   opts.filter
   * @param {object}   [opts.sort]
   * @param {number}   [opts.skip]
   * @param {number}   [opts.limit]
   * @param {string}   [opts.select]
   * @param {Array}    [opts.populate]
   * @returns {Promise<Array>}
   */
  async findMany({ filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 20, select = null, populate = [] } = {}) {
    let query = this.model.find(filter).sort(sort).skip(skip).limit(limit);
    if (select)              { query = query.select(select); }
    if (populate.length > 0) { populate.forEach((p) => { query = query.populate(p); }); }
    return query.lean().exec();
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  // ── Update ──────────────────────────────────────────────────────────────────

  async updateById(id, update, options = {}) {
    return this.model
      .findByIdAndUpdate(id, update, { new: true, runValidators: true, ...options })
      .lean()
      .exec();
  }

  async updateOne(filter, update, options = {}) {
    return this.model
      .findOneAndUpdate(filter, update, { new: true, runValidators: true, ...options })
      .lean()
      .exec();
  }

  async updateMany(filter, update) {
    return this.model.updateMany(filter, update);
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  /** Hard delete */
  async deleteById(id) {
    return this.model.findByIdAndDelete(id).lean().exec();
  }

  /** Soft delete — sets deletedAt timestamp */
  async softDeleteById(id, deletedBy = null) {
    return this.updateById(id, {
      deletedAt: new Date(),
      ...(deletedBy && { deletedBy }),
    });
  }

  // ── Aggregation ─────────────────────────────────────────────────────────────

  async aggregate(pipeline) {
    return this.model.aggregate(pipeline);
  }

  // ── Existence ───────────────────────────────────────────────────────────────

  async exists(filter) {
    const result = await this.model.exists(filter);
    return Boolean(result);
  }
}

module.exports = BaseRepository;
