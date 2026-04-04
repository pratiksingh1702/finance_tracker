'use strict';

const router = require('express').Router();
const v1Routes = require('./v1');

router.use('/api/v1', v1Routes);

// Root ping
router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Finance Dashboard API',
    docs: '/api/docs',
    health: '/api/v1/health',
  });
});

module.exports = router;
