
'use strict';

const BaseRepository          = require('../../repositories/base.repository');
const { Transaction }         = require('../finance/models/transaction.model');
const { summaryPipeline }     = require('./aggregations/summary.aggregation');
const { categoryTotalsPipeline } = require('./aggregations/category-totals.aggregation');
const { monthlyTrendsPipeline, weeklyTrendsPipeline } = require('./aggregations/trends.aggregation');
const { recentActivityPipeline } = require('./aggregations/recent-activity.aggregation');

class AnalyticsRepository extends BaseRepository {
  constructor() {
    super(Transaction);
  }

  async getSummary(matchStage) {
    const result = await this.aggregate(summaryPipeline(matchStage));
    // Returns array with 0 or 1 element
    return result[0] || {
      totalIncome:          0,
      totalExpenses:        0,
      netBalance:           0,
      transactionCount:     0,
      incomeCount:          0,
      expenseCount:         0,
      avgTransactionAmount: 0,
      maxTransaction:       0,
      minTransaction:       0,
      savingsRate:          0,
    };
  }

  async getCategoryTotals(matchStage) {
    return this.aggregate(categoryTotalsPipeline(matchStage));
  }

  async getMonthlyTrends(matchStage, months) {
    return this.aggregate(monthlyTrendsPipeline(matchStage, months));
  }

  async getWeeklyTrends(matchStage, weeks) {
    return this.aggregate(weeklyTrendsPipeline(matchStage, weeks));
  }

  async getRecentActivity(matchStage, limit) {
    return this.aggregate(recentActivityPipeline(matchStage, limit));
  }
}

module.exports = new AnalyticsRepository();
