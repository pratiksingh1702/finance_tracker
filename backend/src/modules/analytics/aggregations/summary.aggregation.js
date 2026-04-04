
'use strict';

/**
 * Summary Aggregation
 * Returns total income, total expenses, and net balance
 * for a given date range and optional filters.
 *
 * @param {object} matchStage - Mongoose match conditions (pre-built)
 * @returns {Array} MongoDB aggregation pipeline
 */
const summaryPipeline = (matchStage = {}) => [
  // Stage 1: Filter out soft-deleted and apply date/type filters
  {
    $match: {
      deletedAt: null,
      status: 'completed',
      ...matchStage,
    },
  },

  // Stage 2: Group all docs into a single summary document
  {
    $group: {
      _id: null,

      totalIncome: {
        $sum: {
          $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
        },
      },

      totalExpenses: {
        $sum: {
          $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0],
        },
      },

      transactionCount: { $sum: 1 },

      incomeCount: {
        $sum: {
          $cond: [{ $eq: ['$type', 'income'] }, 1, 0],
        },
      },

      expenseCount: {
        $sum: {
          $cond: [{ $eq: ['$type', 'expense'] }, 1, 0],
        },
      },

      avgTransactionAmount: { $avg: '$amount' },
      maxTransaction:       { $max: '$amount' },
      minTransaction:       { $min: '$amount' },
    },
  },

  // Stage 3: Project a clean shape with derived fields
  {
    $project: {
      _id:                 0,
      totalIncome:         { $round: ['$totalIncome',   2] },
      totalExpenses:       { $round: ['$totalExpenses', 2] },
      netBalance:          { $round: [{ $subtract: ['$totalIncome', '$totalExpenses'] }, 2] },
      transactionCount:    1,
      incomeCount:         1,
      expenseCount:        1,
      avgTransactionAmount:{ $round: ['$avgTransactionAmount', 2] },
      maxTransaction:      { $round: ['$maxTransaction', 2] },
      minTransaction:      { $round: ['$minTransaction', 2] },
      savingsRate: {
        $cond: [
          { $gt: ['$totalIncome', 0] },
          {
            $round: [
              {
                $multiply: [
                  { $divide: [{ $subtract: ['$totalIncome', '$totalExpenses'] }, '$totalIncome'] },
                  100,
                ],
              },
              2,
            ],
          },
          0,
        ],
      },
    },
  },
];

module.exports = { summaryPipeline };
