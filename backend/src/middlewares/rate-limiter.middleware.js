'use strict';

const rateLimit          = require('express-rate-limit');
const { rateLimit: cfg } = require('../config');

/**
 * Default rate limiter — applied globally.
 */
const globalLimiter = rateLimit({
  windowMs:        cfg.windowMs,
  max:             cfg.max,
  standardHeaders: cfg.standardHeaders,
  legacyHeaders:   cfg.legacyHeaders,
  message:         cfg.message,
});

/**
 * Strict rate limiter for auth endpoints (login/register).
 */
const authLimiter = rateLimit({
  windowMs:        cfg.auth.windowMs,
  max:             cfg.auth.max,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         cfg.auth.message,
});

module.exports = { globalLimiter, authLimiter };
