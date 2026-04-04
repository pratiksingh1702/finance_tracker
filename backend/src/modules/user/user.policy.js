
'use strict';

const { authorize, authorizeAdmin } = require('../../middlewares/authorize.middleware');

const canReadUser    = authorize('read',   'User');
const canCreateUser  = authorizeAdmin;          // only admins create users
const canUpdateUser  = authorizeAdmin;
const canDeleteUser  = authorizeAdmin;
const canManageUsers = authorizeAdmin;

module.exports = { canReadUser, canCreateUser, canUpdateUser, canDeleteUser, canManageUsers };
