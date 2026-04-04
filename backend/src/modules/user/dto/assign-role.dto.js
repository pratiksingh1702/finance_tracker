'use strict';

const { Joi }         = require('../../../validators/base.validator');
const { ROLE_VALUES } = require('../models/role.model');

const assignRoleSchema = Joi.object({
  role: Joi.string().valid(...ROLE_VALUES).required(),
});

module.exports = { assignRoleSchema };
