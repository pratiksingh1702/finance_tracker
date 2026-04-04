
'use strict';

const logger = require('../logs/logger');

/**
 * Log an audit event.
 * All write actions (create/update/delete) pass through here so there
 * is a durable record of who did what and when.
 *
 * @param {object} opts
 * @param {string}      opts.action     - e.g. 'CREATE_TRANSACTION'
 * @param {string}      opts.resource   - e.g. 'Transaction'
 * @param {string}      [opts.resourceId]
 * @param {object}      [opts.actor]    - { id, email, role }
 * @param {object}      [opts.before]   - State before mutation
 * @param {object}      [opts.after]    - State after mutation
 * @param {string}      [opts.ip]
 * @param {string}      [opts.userAgent]
 */
const log = ({
  action,
  resource,
  resourceId = null,
  actor = null,
  before = null,
  after = null,
  ip = null,
  userAgent = null,
}) => {
  const entry = {
    timestamp:  new Date().toISOString(),
    action,
    resource,
    resourceId,
    actor,
    changes: {
      before,
      after,
    },
    meta: { ip, userAgent },
  };

  logger.audit(`AUDIT: ${action} on ${resource}`, entry);
};

module.exports = { log };
