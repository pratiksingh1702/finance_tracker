'use strict';

const { createUserSchema }  = require('./dto/create-user.dto');
const { updateUserSchema }  = require('./dto/update-user.dto');
const { assignRoleSchema }  = require('./dto/assign-role.dto');
const validateRequest       = require('../../middlewares/validate-request.middleware');

const validateCreateUser = validateRequest(createUserSchema,  'body');
const validateUpdateUser = validateRequest(updateUserSchema,  'body');
const validateAssignRole = validateRequest(assignRoleSchema,  'body');

module.exports = { validateCreateUser, validateUpdateUser, validateAssignRole };
