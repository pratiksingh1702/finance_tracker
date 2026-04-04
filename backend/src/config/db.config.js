'use strict';

require('dotenv').config();

const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/finance-dashboard',
  options: {
    autoIndex: true,
  },
};

module.exports = dbConfig;
