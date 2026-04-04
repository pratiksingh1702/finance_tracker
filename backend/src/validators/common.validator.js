'use strict';

const { Joi } = require('./base.validator');

/** Reusable Joi schemas shared across modules */

const objectId = Joi.string()
  .pattern(/^[a-f\d]{24}$/i)
  .messages({ 'string.pattern.base': '{{#label}} must be a valid MongoDB ObjectId' });

const email = Joi.string().email().lowercase().trim();

const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .messages({
    'string.pattern.base':
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  });

const paginationSchema = Joi.object({
  page:      Joi.number().integer().min(1).default(1),
  limit:     Joi.number().integer().min(1).max(100).default(20),
  sortBy:    Joi.string().max(50),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = { objectId, email, password, paginationSchema };
