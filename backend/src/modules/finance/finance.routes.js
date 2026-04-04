
'use strict';

const router       = require('express').Router();
const controller   = require('./finance.controller');
const authenticate = require('../../middlewares/authenticate.middleware');
const auditLog     = require('../../middlewares/audit-log.middleware');

const {
  validateCreateTransaction,
  validateUpdateTransaction,
  validateFilterTransactions,
  validateCreateCategory,
  validateUpdateCategory,
} = require('./finance.validator');

const {
  canReadTransaction,
  canCreateTransaction,
  canUpdateTransaction,
  canDeleteTransaction,
  canReadCategory,
  canCreateCategory,
  canUpdateCategory,
  canDeleteCategory,
} = require('./finance.policy');

// All finance routes require authentication
router.use(authenticate);

// ── Transactions ───────────────────────────────────────────────────────────────
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: List transactions with filters
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get(
  '/transactions',
  canReadTransaction,
  validateFilterTransactions,
  controller.listTransactions,
);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details
 */
router.get(
  '/transactions/:id',
  canReadTransaction,
  controller.getTransactionById,
);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created
 */
router.post(
  '/transactions',
  canCreateTransaction,
  validateCreateTransaction,
  auditLog('CREATE_TRANSACTION', 'Transaction'),
  controller.createTransaction,
);

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     summary: Update transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *         description: Transaction updated
 */
router.patch(
  '/transactions/:id',
  canUpdateTransaction,
  validateUpdateTransaction,
  auditLog('UPDATE_TRANSACTION', 'Transaction'),
  controller.updateTransaction,
);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted
 */
router.delete(
  '/transactions/:id',
  canDeleteTransaction,
  auditLog('DELETE_TRANSACTION', 'Transaction'),
  controller.deleteTransaction,
);

// ── Categories ─────────────────────────────────────────────────────────────────
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get(
  '/categories',
  canReadCategory,
  controller.listCategories,
);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 */
router.get(
  '/categories/:id',
  canReadCategory,
  controller.getCategoryById,
);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create new category (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created
 */
router.post(
  '/categories',
  canCreateCategory,
  validateCreateCategory,
  auditLog('CREATE_CATEGORY', 'Category'),
  controller.createCategory,
);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update category (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated
 */
router.patch(
  '/categories/:id',
  canUpdateCategory,
  validateUpdateCategory,
  auditLog('UPDATE_CATEGORY', 'Category'),
  controller.updateCategory,
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category (Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete(
  '/categories/:id',
  canDeleteCategory,
  auditLog('DELETE_CATEGORY', 'Category'),
  controller.deleteCategory,
);

module.exports = router;
