
'use strict';

/**
 * Trends Aggregations
 * Monthly and weekly income vs expense breakdown.
 */

/**
 * Monthly trends pipeline.
 * Groups transactions by year-month and computes income/expense totals.
 *
 * @param {object} matchStage
 * @param {number} [months=12] - How many months back to show
 * @returns {Array} pipeline
 */
const monthlyTrendsPipeline = (matchStage = {}, months = 12) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  return [
    {
      $match: {
        deletedAt: null,
        status:    'completed',
        date:      { $gte: since },
        ...matchStage,
      },
    },

    {
      $group: {
        _id: {
          year:  { $year:  '$date' },
          month: { $month: '$date' },
        },
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'income']  }, '$amount', 0] },
        },
        totalExpenses: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
        },
        transactionCount: { $sum: 1 },
      },
    },

    {
      $addFields: {
        net:           { $subtract: ['$totalIncome', '$totalExpenses'] },
        totalIncome:   { $round: ['$totalIncome',   2] },
        totalExpenses: { $round: ['$totalExpenses', 2] },
        // Build a sortable date string: "2024-03"
        period: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' },
              ],
            },
          ],
        },
      },
    },

    { $sort: { '_id.year': 1, '_id.month': 1 } },

    {
      $project: {
        _id:              0,
        year:             '$_id.year',
        month:            '$_id.month',
        period:           1,
        totalIncome:      1,
        totalExpenses:    1,
        net:              { $round: ['$net', 2] },
        transactionCount: 1,
      },
    },
  ];
};

/**
 * Weekly trends pipeline.
 * Groups transactions by ISO year-week.
 *
 * @param {object} matchStage
 * @param {number} [weeks=12]
 * @returns {Array} pipeline
 */
const weeklyTrendsPipeline = (matchStage = {}, weeks = 12) => {
  const since = new Date();
  since.setDate(since.getDate() - weeks * 7);

  return [
    {
      $match: {
        deletedAt: null,
        status:    'completed',
        date:      { $gte: since },
        ...matchStage,
      },
    },

    {
      $group: {
        _id: {
          year: { $isoWeekYear: '$date' },
          week: { $isoWeek:     '$date' },
        },
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$type', 'income']  }, '$amount', 0] },
        },
        totalExpenses: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
        },
        transactionCount: { $sum: 1 },
      },
    },

    {
      $addFields: {
        net:           { $subtract: ['$totalIncome', '$totalExpenses'] },
        totalIncome:   { $round: ['$totalIncome',   2] },
        totalExpenses: { $round: ['$totalExpenses', 2] },
        period: {
          $concat: [
            { $toString: '$_id.year' },
            '-W',
            {
              $cond: [
                { $lt: ['$_id.week', 10] },
                { $concat: ['0', { $toString: '$_id.week' }] },
                { $toString: '$_id.week' },
              ],
            },
          ],
        },
      },
    },

    { $sort: { '_id.year': 1, '_id.week': 1 } },

    {
      $project: {
        _id:              0,
        year:             '$_id.year',
        week:             '$_id.week',
        period:           1,
        totalIncome:      1,
        totalExpenses:    1,
        net:              { $round: ['$net', 2] },
        transactionCount: 1,
      },
    },
  ];
};

module.exports = { monthlyTrendsPipeline, weeklyTrendsPipeline };
