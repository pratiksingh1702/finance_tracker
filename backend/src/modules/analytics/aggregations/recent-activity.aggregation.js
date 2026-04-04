
'use strict';

/**
 * Recent Activity Aggregation
 * Returns the N most recent completed transactions with category info.
 *
 * @param {object} matchStage
 * @param {number} [limit=10]
 * @returns {Array} pipeline
 */
const recentActivityPipeline = (matchStage = {}, limit = 10) => [
  {
    $match: {
      deletedAt: null,
      status:    'completed',
      ...matchStage,
    },
  },

  { $sort: { date: -1 } },

  { $limit: limit },

  {
    $lookup: {
      from:         'categories',
      localField:   'category',
      foreignField: '_id',
      as:           'categoryInfo',
    },
  },

  {
    $unwind: {
      path:                       '$categoryInfo',
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $lookup: {
      from:         'users',
      localField:   'createdBy',
      foreignField: '_id',
      as:           'createdByInfo',
    },
  },

  {
    $unwind: {
      path:                       '$createdByInfo',
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $project: {
      _id:      1,
      title:    1,
      amount:   { $round: ['$amount', 2] },
      type:     1,
      status:   1,
      date:     1,
      notes:    1,
      tags:     1,
      category: {
        id:    '$categoryInfo._id',
        name:  { $ifNull: ['$categoryInfo.name',  'Uncategorised'] },
        color: { $ifNull: ['$categoryInfo.color', '#6B7280'] },
        icon:  { $ifNull: ['$categoryInfo.icon',  'tag'] },
      },
      createdBy: {
        id:    '$createdByInfo._id',
        name:  '$createdByInfo.name',
        email: '$createdByInfo.email',
      },
      createdAt: 1,
    },
  },
];

module.exports = { recentActivityPipeline };
