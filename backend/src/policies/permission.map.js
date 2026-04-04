'use strict';

/**
 * Permission Map
 * Defines what each role is allowed to do.
 *
 * Shape: { [role]: { [resource]: string[] } }
 *
 * Actions: 'read' | 'create' | 'update' | 'delete' | 'manage' (all)
 */
const PERMISSIONS = {
  viewer: {
    Transaction: ['read'],
    Category:    ['read'],
    Analytics:   ['read'],
    User:        [],
  },

  analyst: {
    Transaction: ['read'],
    Category:    ['read'],
    Analytics:   ['read', 'export'],
    User:        ['read'],
  },

  admin: {
    Transaction: ['read', 'create', 'update', 'delete'],
    Category:    ['read', 'create', 'update', 'delete'],
    Analytics:   ['read', 'export'],
    User:        ['read', 'create', 'update', 'delete', 'manage'],
  },
};

module.exports = PERMISSIONS;
