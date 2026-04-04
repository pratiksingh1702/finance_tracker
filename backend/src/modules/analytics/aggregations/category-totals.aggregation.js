
'use strict';

/**
 * Category Totals Aggregation
 * Breaks down income and expenses by category with percentage share.
 *
 * @param {object} matchStage - Pre-built match conditions
 * @returns {Array} MongoDB aggregation pipeline
 */
const categoryTotalsPipeline = (matchStage = {}) => [
  // Stage 1: Filter
  {
    $match: {
      deletedAt: null,
      status:    'completed',
      ...matchStage,
    },
  },

  // Stage 2: Group by category AND type
  {
    $group: {
      _id: {
        category: '$category',
        type:     '$type',
      },
      total: { $sum: '$amount' },
      count: { $sum: 1 },
      avg:   { $avg: '$amount' },
      max:   { $max: '$amount' },
      min:   { $min: '$amount' },
    },
  },

  // Stage 3: Lookup category details
  {
    $lookup: {
      from:         'categories',
      localField:   '_id.category',
      foreignField: '_id',
      as:           'categoryInfo',
    },
  },

  // Stage 4: Unwind category (left join — keep docs even if category deleted)
  {
    $unwind: {
      path:                       '$categoryInfo',
      preserveNullAndEmptyArrays: true,
    },
  },

  // Stage 5: Re-group by category to merge income + expense rows
  {
    $group: {
      _id: '$_id.category',
      categoryName:  { $first: '$categoryInfo.name' },
      categoryColor: { $first: '$categoryInfo.color' },
      categoryIcon:  { $first: '$categoryInfo.icon' },
      totalIncome: {
        $sum: {
          $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
        },
      },
      totalExpenses: {
        $sum: {
          $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
        },
      },
      transactionCount: { $sum: '$count' },
    },
  },

  // Stage 6: Add net per category
  {
    $addFields: {
      net:           { $subtract: ['$totalIncome', '$totalExpenses'] },
      totalIncome:   { $round: ['$totalIncome',   2] },
      totalExpenses: { $round: ['$totalExpenses', 2] },
    },
  },

  // Stage 7: Sort by total expenses descending
  {
    $sort: { totalExpenses: -1 },
  },

  // Stage 8: Final projection
  {
    $project: {
      _id:              0,
      categoryId:       '$_id',
      categoryName:     { $ifNull: ['$categoryName',  'Uncategorised'] },
      categoryColor:    { $ifNull: ['$categoryColor', '#6B7280'] },
      categoryIcon:     { $ifNull: ['$categoryIcon',  'tag'] },
      totalIncome:      1,
      totalExpenses:    1,
      net:              { $round: ['$net', 2] },
      transactionCount: 1,
    },
  },
];

module.exports = { categoryTotalsPipeline };
