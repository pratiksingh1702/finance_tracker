
'use strict';

const { Joi }             = require('../../../validators/base.validator');
const { email, password } = require('../../../validators/common.validator');

const loginSchema = Joi.object({
  email:    email.required(),
  password: Joi.string().required(), // plain—validation done after hash compare
});

module.exports = { loginSchema };
