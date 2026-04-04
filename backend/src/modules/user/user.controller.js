'use strict';

const userService    = require('./user.service');
const asyncHandler   = require('../../utils/async-handler.util');
const { sendSuccess } = require('../../utils/api-response.util');

const list = asyncHandler(async (req, res) => {
  const result = await userService.listUsers(req.query);
  return sendSuccess(res, {
    data:    result.data,
    meta:    result.meta,
    message: 'Users retrieved successfully.',
  });
});

const getById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, { data: user, message: 'User retrieved successfully.' });
});

const create = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body, req.user);
  return sendSuccess(res, { data: user, message: 'User created successfully.', statusCode: 201 });
});

const update = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body, req.user);
  return sendSuccess(res, { data: user, message: 'User updated successfully.' });
});

const assignRole = asyncHandler(async (req, res) => {
  const user = await userService.assignRole(req.params.id, req.body.role, req.user);
  return sendSuccess(res, { data: user, message: 'Role assigned successfully.' });
});

const deactivate = asyncHandler(async (req, res) => {
  const user = await userService.deactivateUser(req.params.id, req.user);
  return sendSuccess(res, { data: user, message: 'User deactivated successfully.' });
});

const remove = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user);
  return sendSuccess(res, { data: null, message: 'User deleted successfully.' });
});

module.exports = { list, getById, create, update, assignRole, deactivate, remove };
