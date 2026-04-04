'use strict';

const app       = require('./app.config');
const db        = require('./db.config');
const jwt       = require('./jwt.config');
const cors      = require('./cors.config');
const rateLimit = require('./rate-limit.config');

module.exports = {
  app,
  db,
  jwt,
  cors,
  rateLimit,
};
