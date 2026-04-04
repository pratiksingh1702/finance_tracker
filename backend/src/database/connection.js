'use strict';

const mongoose = require('mongoose');
const { db: dbConfig } = require('../config');
const logger = require('../logs/logger');

let isConnected = false;

const connect = async () => {
  if (isConnected) {
    logger.info('MongoDB already connected.');
    return;
  }

  try {
    const conn = await mongoose.connect(dbConfig.uri, dbConfig.options);
    isConnected = true;
    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB disconnected.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

const disconnect = async () => {
  if (!isConnected) {
    return;
  }
  await mongoose.disconnect();
  isConnected = false;
  logger.info('MongoDB disconnected gracefully.');
};

module.exports = { connect, disconnect };
