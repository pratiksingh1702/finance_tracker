'use strict';

const auditService = require('../services/audit.service');

/**
 * Factory that produces an audit-logging middleware for a given action/resource.
 * Runs *after* the response is sent so it never delays the client.
 *
 * @param {string} action   - e.g. 'CREATE_TRANSACTION'
 * @param {string} resource - e.g. 'Transaction'
 * @returns {Function} Express middleware
 *
 * Usage:
 *   router.post('/', auditLog('CREATE_TRANSACTION', 'Transaction'), controller.create);
 */
const auditLog = (action, resource) => (req, res, next) => {
  // Hook into the response finish event — fires after data is flushed
  res.on('finish', () => {
    // Only log mutating operations that succeed
    if (res.statusCode >= 200 && res.statusCode < 300) {
      auditService.log({
        action,
        resource,
        resourceId: req.params?.id ?? null,
        actor:      req.user
          ? { id: req.user.id, email: req.user.email, role: req.user.role }
          : null,
        ip:        req.ip,
        userAgent: req.headers['user-agent'],
      });
    }
  });

  next();
};

module.exports = auditLog;
