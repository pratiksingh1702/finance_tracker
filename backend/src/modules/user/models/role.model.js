
'use strict';

/**
 * Role constants used across the system.
 * Defined here as a single source of truth rather than a DB collection,
 * because roles are fixed and don't require runtime CRUD.
 */
const ROLES = Object.freeze({
  VIEWER:  'viewer',
  ANALYST: 'analyst',
  ADMIN:   'admin',
});

const ROLE_VALUES = Object.values(ROLES);

module.exports = { ROLES, ROLE_VALUES };
