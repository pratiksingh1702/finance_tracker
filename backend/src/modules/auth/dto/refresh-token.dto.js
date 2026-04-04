'use strict';

const { Joi } = require('../../../validators/base.validator');

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { refreshTokenSchema };
