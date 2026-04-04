
'use strict';

const analyticsService = require('./analytics.service');
const asyncHandler     = require('../../utils/async-handler.util');
const { sendSuccess }  = require('../../utils/api-response.util');

/**
 * GET /api/v1/analytics/dashboard
 * Full dashboard snapshot — summary + categories + monthly trends + recent activity.
 * All aggregations run in parallel.
 */
const getDashboard = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDashboard(req.query);
  return sendSuccess(res, {
    data,
    message: 'Dashboard data retrieved successfully.',
  });
});

/**
 * GET /api/v1/analytics/summary
 * Overall financial summary: income, expenses, net balance, averages.
 */
const getSummary = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSummary(req.query);
  return sendSuccess(res, {
    data,
    message: 'Financial summary retrieved successfully.',
  });
});

/**
 * GET /api/v1/analytics/categories
 * Category-level income and expense breakdown with percentage shares.
 */
const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCategoryBreakdown(req.query);
  return sendSuccess(res, {
    data,
    message: 'Category breakdown retrieved successfully.',
  });
});

/**
 * GET /api/v1/analytics/trends/monthly
 * Month-by-month income vs expense with running balance.
 */
const getMonthlyTrends = asyncHandler(async (req, res) => {
  const data = await analyticsService.getMonthlyTrends(req.query);
  return sendSuccess(res, {
    data,
    message: 'Monthly trends retrieved successfully.',
  });
});

/**
 * GET /api/v1/analytics/trends/weekly
 * Week-by-week income vs expense with running balance.
 */
const getWeeklyTrends = asyncHandler(async (req, res) => {
  const data = await analyticsService.getWeeklyTrends(req.query);
  return sendSuccess(res, {
    data,
    message: 'Weekly trends retrieved successfully.',
  });
});

/**
 * GET /api/v1/analytics/recent
 * Most recent N completed transactions with full category context.
 */
const getRecentActivity = asyncHandler(async (req, res) => {
  const data = await analyticsService.getRecentActivity(req.query);
  return sendSuccess(res, {
    data,
    message: 'Recent activity retrieved successfully.',
  });
});

module.exports = {
  getDashboard,
  getSummary,
  getCategoryBreakdown,
  getMonthlyTrends,
  getWeeklyTrends,
  getRecentActivity,
};
