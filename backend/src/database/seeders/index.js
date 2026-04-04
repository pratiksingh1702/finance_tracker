'use strict';

const mongoose = require('mongoose');
const config   = require('../../config');
const logger   = require('../../logs/logger');
const userSeeder = require('./user.seeder');
const financeSeeder = require('./finance.seeder');

/**
 * Main seeding script.
 * Drops the existing database (optional) and populates it with fresh data.
 */
const runSeeder = async () => {
  try {
    logger.info('Connecting to database for seeding...');
    await mongoose.connect(config.db.uri, config.db.options);
    logger.info('Connected to MongoDB.');

    // 1. Clean up existing data (optional, but recommended for consistent seeds)
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      await mongoose.connection.collections[collectionName].deleteMany({});
      logger.info(`Cleared collection: ${collectionName}`);
    }

    // 2. Run individual seeders
    logger.info('Starting user seeding...');
    const { admin, viewer } = await userSeeder.seed();
    logger.info('User seeding completed.');

    logger.info('Starting finance seeding...');
    await financeSeeder.seed(admin, viewer);
    logger.info('Finance seeding completed.');

    logger.info('Database seeding finished successfully! 🌱');
    process.exit(0);
  } catch (error) {
    logger.error('Error during seeding:', error);
    process.exit(1);
  }
};

runSeeder();
