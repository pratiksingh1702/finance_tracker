'use strict';

const { authorize } = require('../../middlewares/authorize.middleware');

const canReadTransaction   = authorize('read',   'Transaction');
const canCreateTransaction = authorize('create', 'Transaction');
const canUpdateTransaction = authorize('update', 'Transaction');
const canDeleteTransaction = authorize('delete', 'Transaction');

const canReadCategory   = authorize('read',   'Category');
const canCreateCategory = authorize('create', 'Category');
const canUpdateCategory = authorize('update', 'Category');
const canDeleteCategory = authorize('delete', 'Category');

module.exports = {
  canReadTransaction,
  canCreateTransaction,
  canUpdateTransaction,
  canDeleteTransaction,
  canReadCategory,
  canCreateCategory,
  canUpdateCategory,
  canDeleteCategory,
};
