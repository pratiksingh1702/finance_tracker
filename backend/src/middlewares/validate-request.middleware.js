'use strict';

const { validate } = require('../validators/base.validator');

/**
 * Factory that returns a middleware validating part of the request
 * against a Joi schema.
 *
 * @param {Joi.Schema} schema
 * @param {'body'|'query'|'params'} [source='body']
 * @returns {Function} Express middleware
 *
 * Usage:
 *   router.post('/', validateRequest(createTransactionSchema), controller.create);
 *   router.get('/', validateRequest(filterSchema, 'query'), controller.list);
 */
const validateRequest = (schema, source = 'body') => (req, _res, next) => {
  try {
    req[source] = validate(schema, req[source]);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validateRequest;
