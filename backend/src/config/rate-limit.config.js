'use strict';

const rateLimitConfig = {
  // Global API limiter
api: {
  windowMs: 15 * 60 * 1000,
  max: 1000, // increased from 100 → 1000
  message: 'Too many requests, try again later.',
  standardHeaders: true,
  legacyHeaders: false,
},
  // Stricter limiter for auth endpoints
auth: {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // increased from 10 → 100
  message: 'Too many authentication attempts, slow down.',
  standardHeaders: true,
  legacyHeaders: false,
},
};

module.exports = rateLimitConfig;
