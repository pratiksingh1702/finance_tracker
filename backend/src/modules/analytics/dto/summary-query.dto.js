
'use strict';

const { Joi } = require('../../../validators/base.validator');

const summaryQuerySchema = Joi.object({
  from:     Joi.date().iso(),
  to:       Joi.date().iso().min(Joi.ref('from')),
  type:     Joi.string().valid('income', 'expense'),
  category: Joi.string().pattern(/^[a-f\d]{24}$/i),
}).unknown(false);

module.exports = { summaryQuerySchema };
