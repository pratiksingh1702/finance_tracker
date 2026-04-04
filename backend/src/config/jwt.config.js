'use strict';

require('dotenv').config();

const jwtConfig = {
  accessSecret:  process.env.JWT_ACCESS_SECRET || 'your-access-secret-key-change-me',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-me',
  accessExpiry:  process.env.JWT_ACCESS_EXPIRY || '10d',
  refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
};

module.exports = jwtConfig;
