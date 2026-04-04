'use strict';

const logger = require('../../logs/logger');
const { ROLES } = require('../../modules/user/models/role.model');

/**
 * Seeder for roles.
 * Since roles are defined as fixed constants in the code,
 * this seeder primarily ensures the system is aware of them
 * and could be extended if roles were moved to a database collection.
 */
const seed = async () => {
  logger.info(`Roles available in system: ${Object.values(ROLES).join(', ')}`);
  return Object.values(ROLES);
};

module.exports = { seed };
