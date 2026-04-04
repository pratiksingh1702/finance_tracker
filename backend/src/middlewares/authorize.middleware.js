'use strict';

const { requirePermission, requireAdmin } = require('../policies/role.policy');

/**
 * Re-export policy-based authorization helpers as Express middleware.
 *
 * Usage in a router:
 *   router.post('/', authorize('create', 'Transaction'), controller.create);
 *   router.delete('/:id', authorizeAdmin, controller.remove);
 */
const authorize      = (action, resource) => requirePermission(action, resource);
const authorizeAdmin = requireAdmin;

module.exports = { authorize, authorizeAdmin };
