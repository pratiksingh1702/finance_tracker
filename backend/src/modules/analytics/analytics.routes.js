
'use strict';

const router       = require('express').Router();
const controller   = require('./analytics.controller');
const authenticate = require('../../middlewares/authenticate.middleware');
const validateRequest = require('../../middlewares/validate-request.middleware');
const { canReadAnalytics } = require('./analytics.policy');
const { summaryQuerySchema } = require('./dto/summary-query.dto');
const { trendQuerySchema }   = require('./dto/trend-query.dto');

// All analytics routes require authentication
router.use(authenticate);
router.use(canReadAnalytics);

/**
 * @swagger
 * /analytics/dashboard:
 *   get:
 *     summary: Full dashboard snapshot
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 */
router.get('/dashboard',       controller.getDashboard);

/**
 * @swagger
 * /analytics/summary:
 *   get:
 *     summary: Overall financial summary
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Financial summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Summary'
 */
router.get('/summary',         validateRequest(summaryQuerySchema, 'query'), controller.getSummary);

/**
 * @swagger
 * /analytics/categories:
 *   get:
 *     summary: Category-level breakdown
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown
 */
router.get('/categories',      validateRequest(summaryQuerySchema, 'query'), controller.getCategoryBreakdown);

/**
 * @swagger
 * /analytics/trends/monthly:
 *   get:
 *     summary: Monthly income vs expense trends
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trends
 */
router.get('/trends/monthly',  validateRequest(trendQuerySchema,   'query'), controller.getMonthlyTrends);

/**
 * @swagger
 * /analytics/trends/weekly:
 *   get:
 *     summary: Weekly income vs expense trends
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly trends
 */
router.get('/trends/weekly',   validateRequest(trendQuerySchema,   'query'), controller.getWeeklyTrends);

/**
 * @swagger
 * /analytics/recent:
 *   get:
 *     summary: Recent activity feed
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent transactions
 */
router.get('/recent',          controller.getRecentActivity);

module.exports = router;
