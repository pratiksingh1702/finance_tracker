'use strict';

const { Joi }                = require('../../validators/base.validator');
const { email, password }    = require('../../validators/common.validator');
const { loginSchema }        = require('./dto/login.dto');
const { refreshTokenSchema } = require('./dto/refresh-token.dto');
const validateRequest        = require('../../middlewares/validate-request.middleware');

const registerSchema = Joi.object({
  name:     Joi.string().trim().min(2).max(100).required(),
  email:    email.required(),
  password: password.required(),
});

const validateRegister     = validateRequest(registerSchema,     'body');
const validateLogin        = validateRequest(loginSchema,        'body');
const validateRefreshToken = validateRequest(refreshTokenSchema, 'body');

module.exports = { validateRegister, validateLogin, validateRefreshToken };
