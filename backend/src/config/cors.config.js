'use strict';

const appConfig = require('./app.config');

const corsOptions = {
  origin: [appConfig.clientUrl, 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

module.exports = corsOptions;
