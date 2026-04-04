'use strict';

const Joi = require('joi');
const ApiError = require('../utils/api-error.util');

/**
 * Run a Joi schema against a data object.
 * Returns the validated (and coerced) value, or throws an ApiError.
 *
 * @param {Joi.Schema} schema
 * @param {object}     data
 * @param {object}     [options] - Joi validation options
 * @returns {object} validated value
 * @throws {ApiError} 422 with field-level errors
 */
const validate = (schema, data, options = {}) => {
  const joiOptions = {
    abortEarly: false,  // collect all errors
    stripUnknown: true, // drop undeclared fields
    ...options,
  };

  const { error, value } = schema.validate(data, joiOptions);

  if (error) {
    const errors = error.details.map((d) => ({
      field:   d.path.join('.'),
      message: d.message.replace(/['"]/g, ''),
    }));
    throw ApiError.unprocessable('Validation failed.', errors);
  }

  return value;
};

module.exports = { validate, Joi };
