'use strict';

const { Joi }      = require('../../../validators/base.validator');
const { objectId } = require('../../../validators/common.validator');
const { TRANSACTION_TYPES, TRANSACTION_STATUSES } = require('../models/transaction.model');

const filterTransactionSchema = Joi.object({
  // Filters
  type:     Joi.string().valid(...TRANSACTION_TYPES).empty(''),
  category: objectId.allow(null, '').empty(''),
  status:   Joi.string().valid(...TRANSACTION_STATUSES).empty(''),

  from:     Joi.date().iso().empty(''),
  to:       Joi.date().iso().min(Joi.ref('from')).empty(''),

  minAmount:Joi.number().min(0).empty(''),
  maxAmount:Joi.number().greater(Joi.ref('minAmount')).empty(''),

  search:   Joi.string().trim().max(100).empty(''),
  tags:     Joi.string().trim().empty(''),

  // Pagination
  page:      Joi.number().integer().min(1).default(1),
  limit:     Joi.number().integer().min(1).max(100).default(20),
  sortBy:    Joi.string().valid('date','amount','title','createdAt').default('date'),
  sortOrder: Joi.string().valid('asc','desc').default('desc'),
}).unknown(false);
module.exports = { filterTransactionSchema };
