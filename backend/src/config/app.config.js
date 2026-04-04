'use strict';

require('dotenv').config();

const appConfig = {
  env:      process.env.NODE_ENV || 'development',
  port:     parseInt(process.env.PORT || '3000', 10),
  host:     process.env.HOST || 'localhost',
  apiUrl:   process.env.API_URL || 'http://localhost:3000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

module.exports = appConfig;
