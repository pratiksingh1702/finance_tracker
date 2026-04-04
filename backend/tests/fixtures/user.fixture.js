'use strict';

const mongoose = require('mongoose');
const passwordService = require('../../src/services/password.service');
const { ROLES } = require('../../src/modules/user/models/role.model');

const password = 'password123';
const hashedPassword = passwordService.hash(password);

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  name: 'User One',
  email: 'user1@example.com',
  password,
  role: ROLES.VIEWER,
  isActive: true,
};

const adminUser = {
  _id: new mongoose.Types.ObjectId(),
  name: 'Admin User',
  email: 'admin@example.com',
  password,
  role: ROLES.ADMIN,
  isActive: true,
};

module.exports = {
  userOne,
  adminUser,
  password,
  hashedPassword,
};
