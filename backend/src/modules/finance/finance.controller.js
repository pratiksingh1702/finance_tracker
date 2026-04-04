
'use strict';

const { transactionService, categoryService } = require('./finance.service');
const asyncHandler    = require('../../utils/async-handler.util');
const { sendSuccess } = require('../../utils/api-response.util');

// ══════════════════════════════════════════════════════════════════════════════
// Transaction Controllers
// ══════════════════════════════════════════════════════════════════════════════

const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.create(req.body, req.user);
  return sendSuccess(res, {
    data:       transaction,
    message:    'Transaction created successfully.',
    statusCode: 201,
  });
});

const listTransactions = asyncHandler(async (req, res) => {
  const result = await transactionService.list(req.query);
  return sendSuccess(res, {
    data:    result.data,
    meta:    result.meta,
    message: 'Transactions retrieved successfully.',
  });
});

const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getById(req.params.id);
  return sendSuccess(res, {
    data:    transaction,
    message: 'Transaction retrieved successfully.',
  });
});

const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionService.update(req.params.id, req.body, req.user);
  return sendSuccess(res, {
    data:    transaction,
    message: 'Transaction updated successfully.',
  });
});

const deleteTransaction = asyncHandler(async (req, res) => {
  await transactionService.remove(req.params.id, req.user);
  return sendSuccess(res, {
    data:    null,
    message: 'Transaction deleted successfully.',
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Category Controllers
// ══════════════════════════════════════════════════════════════════════════════

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body, req.user);
  return sendSuccess(res, {
    data:       category,
    message:    'Category created successfully.',
    statusCode: 201,
  });
});

const listCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.list(req.query);
  return sendSuccess(res, {
    data:    result.data,
    meta:    result.meta,
    message: 'Categories retrieved successfully.',
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  return sendSuccess(res, {
    data:    category,
    message: 'Category retrieved successfully.',
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body, req.user);
  return sendSuccess(res, {
    data:    category,
    message: 'Category updated successfully.',
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.remove(req.params.id, req.user);
  return sendSuccess(res, {
    data:    null,
    message: 'Category deleted successfully.',
  });
});

module.exports = {
  createTransaction,
  listTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
