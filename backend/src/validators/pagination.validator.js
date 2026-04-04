'use strict';

const { Joi } = require('./base.validator');

const paginationSchema = Joi.object({
  page:      Joi.number().integer().min(1).default(1),
  limit:     Joi.number().integer().min(1).max(100).default(20),
  sortBy:    Joi.string().trim().max(50),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
}).unknown(true); // allow other query params alongside pagination

module.exports = { paginationSchema };
