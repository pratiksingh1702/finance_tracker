'use strict';

const { Joi } = require('./base.validator');

const dateRangeSchema = Joi.object({
  from: Joi.date().iso(),
  to:   Joi.date().iso().min(Joi.ref('from')).messages({
    'date.min': '"to" must be greater than or equal to "from"',
  }),
}).unknown(true);

module.exports = { dateRangeSchema };
