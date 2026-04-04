'use strict';

const User = require('../../modules/user/models/user.model');
const { ROLES } = require('../../modules/user/models/role.model');
const passwordService = require('../../services/password.service');
const logger = require('../../logs/logger');

/**
 * Seeder for initial users.
 * Creates an admin and a regular viewer.
 *
 * @returns {Promise<object>} Map of created user IDs for other seeders to use.
 */
const seed = async () => {
  try {
    const adminPassword = await passwordService.hash('admin123');
    const viewerPassword = await passwordService.hash('viewer123');

    const admin = await User.create({
      name:     'Admin User',
      email:    'admin@finance-dashboard.com',
      password: adminPassword,
      role:     ROLES.ADMIN,
      isActive: true,
    });

    const viewer = await User.create({
      name:     'John Viewer',
      email:    'john@finance-dashboard.com',
      password: viewerPassword,
      role:     ROLES.VIEWER,
      isActive: true,
    });

    logger.info('Users seeded: admin, viewer.');

    return { admin, viewer };
  } catch (error) {
    logger.error('Failed to seed users:', error);
    throw error;
  }
};

module.exports = { seed };
