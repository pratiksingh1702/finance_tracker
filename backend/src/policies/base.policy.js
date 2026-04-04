'use strict';

const PERMISSIONS = require('./permission.map');

/**
 * PolicyContext
 * Returned by can(user) — provides a fluent `.do(action).on(resource)` API.
 *
 * Usage:
 *   can(req.user).do('create').on('Transaction')  → boolean
 */
class PolicyContext {
  constructor(user) {
    this._user   = user;
    this._action = null;
  }

  do(action) {
    this._action = action;
    return this;
  }

  on(resource) {
    const { role } = this._user;
    const rolePerms = PERMISSIONS[role];

    if (!rolePerms) {
      return false;
    }

    const resourcePerms = rolePerms[resource];

    if (!resourcePerms) {
      return false;
    }

    return resourcePerms.includes(this._action) || resourcePerms.includes('manage');
  }
}

/**
 * Factory function — the public API for the policy system.
 * @param {object} user - req.user (must have .role)
 * @returns {PolicyContext}
 */
const can = (user) => new PolicyContext(user);

module.exports = { can };
