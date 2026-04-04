'use strict';

const { Joi } = require('../../../validators/base.validator');
const { ROLE_VALUES } = require('../models/role.model');

const updateUserSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(100),
  isActive: Joi.boolean(),
  role:     Joi.string().valid(...ROLE_VALUES),
}).min(1); // at least one field required

module.exports = { updateUserSchema };
