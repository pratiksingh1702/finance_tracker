
'use strict';

const analyticsRepository    = require('./analytics.repository');
const { buildDateRangeFilter } = require('../../repositories/query-builder/filter.query-builder');
const mongoose               = require('mongoose');

class AnalyticsService {

  /**
   * Build a base match stage from common query params.
   * Shared across all analytics endpoints for consistent filtering.
   *
   * @param {object} params - Validated query params
   * @returns {object} Mongoose match conditions
   */
  _buildMatchStage(params = {}) {
    const match = {};

    // Date range
    if (params.from || params.to) {
      const dateFilter = buildDateRangeFilter('date', params.from, params.to);
      Object.assign(match, dateFilter);
    }

    // Category filter
    if (params.category) {
      match.category = new mongoose.Types.ObjectId(params.category);
    }

    // Type filter
    if (params.type) {
      match.type = params.type;
    }

    return match;
  }

  /**
   * Overall financial summary — total income, expenses, net balance,
   * transaction counts, averages, and savings rate.
   *
   * @param {object} params - summaryQuerySchema validated params
   */
  async getSummary(params = {}) {
    const matchStage = this._buildMatchStage(params);
    return analyticsRepository.getSummary(matchStage);
  }

  /**
   * Category-level breakdown — how much was spent/earned per category
   * with percentage-of-total contribution.
   *
   * @param {object} params
   */
  async getCategoryBreakdown(params = {}) {
    const matchStage = this._buildMatchStage(params);
    const rows       = await analyticsRepository.getCategoryTotals(matchStage);

    // Compute percentage share of total expenses per category
    const totalExpenses = rows.reduce((sum, r) => sum + r.totalExpenses, 0);
    const totalIncome   = rows.reduce((sum, r) => sum + r.totalIncome,   0);

    return rows.map((row) => ({
      ...row,
      expenseShare: totalExpenses > 0
        ? Math.round((row.totalExpenses / totalExpenses) * 10000) / 100
        : 0,
      incomeShare: totalIncome > 0
        ? Math.round((row.totalIncome / totalIncome) * 10000) / 100
        : 0,
    }));
  }

  /**
   * Monthly income vs expense trends.
   *
   * @param {object} params - trendQuerySchema validated params
   */
  async getMonthlyTrends(params = {}) {
    const matchStage = this._buildMatchStage(params);
    const months     = params.months || 12;
    const data       = await analyticsRepository.getMonthlyTrends(matchStage, months);

    // Enrich with running balance
    let runningBalance = 0;
    return data.map((row) => {
      runningBalance += row.net;
      return { ...row, runningBalance: Math.round(runningBalance * 100) / 100 };
    });
  }

  /**
   * Weekly income vs expense trends.
   *
   * @param {object} params - trendQuerySchema validated params
   */
  async getWeeklyTrends(params = {}) {
    const matchStage = this._buildMatchStage(params);
    const weeks      = params.weeks || 12;
    const data       = await analyticsRepository.getWeeklyTrends(matchStage, weeks);

    let runningBalance = 0;
    return data.map((row) => {
      runningBalance += row.net;
      return { ...row, runningBalance: Math.round(runningBalance * 100) / 100 };
    });
  }

  /**
   * Recent transactions with full category and user context.
   *
   * @param {object} params
   * @param {number} [params.limit=10]
   */
  async getRecentActivity(params = {}) {
    const matchStage = this._buildMatchStage(params);
    const limit      = Math.min(50, Math.max(1, parseInt(params.limit, 10) || 10));
    return analyticsRepository.getRecentActivity(matchStage, limit);
  }

  /**
   * Full dashboard snapshot — all analytics in one call.
   * Runs all aggregations in parallel for performance.
   *
   * @param {object} params
   */
  async getDashboard(params = {}) {
    const matchStage = this._buildMatchStage(params);

    const [summary, categoryBreakdown, monthlyTrends, recentActivity] = await Promise.all([
      analyticsRepository.getSummary(matchStage),
      analyticsRepository.getCategoryTotals(matchStage),
      analyticsRepository.getMonthlyTrends(matchStage, 6),  // last 6 months for dashboard
      analyticsRepository.getRecentActivity(matchStage, 5), // last 5 for dashboard
    ]);

    // Add percentage share to category breakdown
    const totalExpenses = categoryBreakdown.reduce((s, r) => s + r.totalExpenses, 0);
    const enrichedCategories = categoryBreakdown.map((row) => ({
      ...row,
      expenseShare: totalExpenses > 0
        ? Math.round((row.totalExpenses / totalExpenses) * 10000) / 100
        : 0,
    }));

    return {
      summary,
      categoryBreakdown: enrichedCategories,
      monthlyTrends,
      recentActivity,
    };
  }
}

module.exports = new AnalyticsService();
