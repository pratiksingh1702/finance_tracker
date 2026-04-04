
'use strict';

const { authorize } = require('../../middlewares/authorize.middleware');

// Viewers, Analysts, and Admins can all read analytics
const canReadAnalytics   = authorize('read',   'Analytics');
const canExportAnalytics = authorize('export', 'Analytics');

module.exports = { canReadAnalytics, canExportAnalytics };
