'use strict';

const { Joi }        = require('../../../validators/base.validator');
const { objectId }   = require('../../../validators/common.validator');
const { TRANSACTION_TYPES, TRANSACTION_STATUSES } = require('../models/transaction.model');

const createTransactionSchema = Joi.object({
  title:    Joi.string().trim().min(1).max(150).required(),
  amount:   Joi.number().positive().precision(2).required(),
  type:     Joi.string().valid(...TRANSACTION_TYPES).required(),
  category: objectId.required(),
  date:     Joi.date().iso().default(() => new Date()),
  notes:    Joi.string().trim().max(500).allow('', null),
  status:   Joi.string().valid(...TRANSACTION_STATUSES).default('completed'),
  tags:     Joi.array().items(Joi.string().trim().max(30)).default([]),
});

module.exports = { createTransactionSchema };
