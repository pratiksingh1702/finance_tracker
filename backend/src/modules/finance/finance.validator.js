'use strict';

const { Joi }             = require('../../validators/base.validator');
const { createTransactionSchema }  = require('./dto/create-transaction.dto');
const { updateTransactionSchema }  = require('./dto/update-transaction.dto');
const { filterTransactionSchema }  = require('./dto/filter-transaction.dto');
const validateRequest              = require('../../middlewares/validate-request.middleware');

// ── Category DTOs inline (simple enough not to need own files) ────────────────
const createCategorySchema = Joi.object({
  name:        Joi.string().trim().min(1).max(50).required(),
  description: Joi.string().trim().max(200).allow('', null),
  color:       Joi.string().pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).default('#6B7280'),
  icon:        Joi.string().trim().max(30).default('tag'),
});

const updateCategorySchema = Joi.object({
  name:        Joi.string().trim().min(1).max(50),
  description: Joi.string().trim().max(200).allow('', null),
  color:       Joi.string().pattern(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
  icon:        Joi.string().trim().max(30),
  isActive:    Joi.boolean(),
}).min(1);

// ── Exported middleware ───────────────────────────────────────────────────────
const validateCreateTransaction  = validateRequest(createTransactionSchema,  'body');
const validateUpdateTransaction  = validateRequest(updateTransactionSchema,  'body');
const validateFilterTransactions = validateRequest(filterTransactionSchema, 'query');
const validateCreateCategory     = validateRequest(createCategorySchema,  'body');
const validateUpdateCategory     = validateRequest(updateCategorySchema,  'body');

module.exports = {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateFilterTransactions,
  validateCreateCategory,
  validateUpdateCategory,
};
