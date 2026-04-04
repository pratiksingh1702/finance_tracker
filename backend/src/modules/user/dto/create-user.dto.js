'use strict';

const { Joi }  = require('../../../validators/base.validator');
const { email, password } = require('../../../validators/common.validator');
const { ROLE_VALUES }     = require('../models/role.model');

const createUserSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(100).required(),
  email:    email.required(),
  password: password.required(),
  role:     Joi.string().valid(...ROLE_VALUES).default('viewer'),
  isActive: Joi.boolean().default(true),
});

module.exports = { createUserSchema };
