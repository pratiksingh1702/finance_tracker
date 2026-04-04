'use strict';

const { can } = require('./base.policy');
const ApiError = require('../utils/api-error.util');

/**
 * Higher-order function that returns an Express middleware which
 * asserts the authenticated user is allowed to perform `action` on `resource`.
 *
 * @param {string} action   - e.g. 'create', 'update', 'delete', 'read'
 * @param {string} resource - e.g. 'Transaction', 'User'
 * @returns {Function} Express middleware
 *
 * @example
 *   router.post('/', requirePermission('create', 'Transaction'), controller.create);
 */
const requirePermission = (action, resource) => (req, _res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required.'));
  }

  if (!can(req.user).do(action).on(resource)) {
    return next(
      ApiError.forbidden(
        `Your role (${req.user.role}) is not permitted to ${action} ${resource}.`,
      ),
    );
  }

  return next();
};

/**
 * Middleware that restricts access to admin-only routes.
 */
const requireAdmin = (req, _res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(ApiError.forbidden('Admin access required.'));
  }
  return next();
};

module.exports = { requirePermission, requireAdmin };
