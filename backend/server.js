'use strict';

const app     = require('./app');
const config  = require('./src/config');
const db      = require('./src/database/connection');
const logger  = require('./src/logs/logger');

let server;

/**
 * Bootstraps the application.
 * Connects to the database and starts the Express server.
 */
const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await db.connect();

    // 2. Start Express listener
    server = app.listen(config.app.port, () => {
      logger.info(`
        🚀 Server is running!
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Environment: ${config.app.env}
        Port:        ${config.app.port}
        API URL:     ${config.app.apiUrl}
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `);
    });

    // ── Graceful Shutdown ───────────────────────────────────────────────────────────
    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed.');
          db.disconnect().then(() => {
            logger.info('DB disconnected. Exiting process...');
            process.exit(0);
          });
        });
      } else {
        process.exit(0);
      }
    };

    const unexpectedErrorHandler = (error) => {
      logger.error('Unexpected error encountered:', error);
      exitHandler();
    };

    process.on('uncaughtException',  unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);
    process.on('SIGTERM',            exitHandler);
    process.on('SIGINT',             exitHandler);

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Fire it up
startServer();
