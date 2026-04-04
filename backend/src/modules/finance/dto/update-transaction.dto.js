'use strict';

const { Joi }      = require('../../../validators/base.validator');
const { objectId } = require('../../../validators/common.validator');
const { TRANSACTION_TYPES, TRANSACTION_STATUSES } = require('../models/transaction.model');

const updateTransactionSchema = Joi.object({
  title:    Joi.string().trim().min(1).max(150),
  amount:   Joi.number().positive().precision(2),
  type:     Joi.string().valid(...TRANSACTION_TYPES),
  category: objectId,
  date:     Joi.date().iso(),
  notes:    Joi.string().trim().max(500).allow('', null),
  status:   Joi.string().valid(...TRANSACTION_STATUSES),
  tags:     Joi.array().items(Joi.string().trim().max(30)),
}).min(1);

module.exports = { updateTransactionSchema };
