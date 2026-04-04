'use strict';

const mongoose = require('mongoose');
const config = require('../../src/config');

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(config.db.uri, config.db.options);
  });

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) => {
        await collection.deleteMany();
      })
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
