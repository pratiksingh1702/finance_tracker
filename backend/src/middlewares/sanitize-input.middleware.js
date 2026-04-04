'use strict';

const mongoSanitize = require('express-mongo-sanitize');

/**
 * Sanitize request body, params, and query to prevent NoSQL injection.
 * Strips any keys that start with `$` or contain `.`.
 */
const sanitizeInput = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    // Optionally log sanitization events
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[Sanitize] Removed key "${key}" from ${req.method} ${req.path}`);
    }
  },
});

module.exports = sanitizeInput;
