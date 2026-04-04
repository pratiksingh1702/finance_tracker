
'use strict';

const { Joi } = require('../../../validators/base.validator');

const trendQuerySchema = Joi.object({
  months:   Joi.number().integer().min(1).max(24).default(12),
  weeks:    Joi.number().integer().min(1).max(52).default(12),
  from:     Joi.date().iso(),
  to:       Joi.date().iso().min(Joi.ref('from')),
  category: Joi.string().pattern(/^[a-f\d]{24}$/i),
}).unknown(false);

module.exports = { trendQuerySchema };
