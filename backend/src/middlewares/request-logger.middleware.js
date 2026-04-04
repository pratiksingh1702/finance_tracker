'use strict';

const morgan = require('morgan');
const logger = require('../logs/logger');

// Pipe morgan output into Winston
const stream = {
  write: (message) => logger.http(message.trim()),
};

const skip = () => process.env.NODE_ENV === 'test';

const requestLogger = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);

module.exports = requestLogger;
