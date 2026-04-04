'use strict';

const router = require('express').Router();

const authRoutes      = require('./auth.routes');
const userRoutes      = require('./user.routes');
const financeRoutes   = require('./finance.routes');
const analyticsRoutes = require('./analytics.routes');

// ── Health check ──────────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.status(200).json({
    success:   true,
    message:   'API is healthy.',
    version:   'v1',
    timestamp: new Date().toISOString(),
  });
});

// ── Mount module routers ──────────────────────────────────────────────────────
router.use('/auth',        authRoutes);
router.use('/users',       userRoutes);
router.use('/analytics',   analyticsRoutes);

// Finance module exposes both /transactions and /categories
router.use('/',            financeRoutes);

module.exports = router;
