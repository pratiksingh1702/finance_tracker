'use strict';

const authService    = require('./auth.service');
const asyncHandler   = require('../../utils/async-handler.util');
const { sendSuccess } = require('../../utils/api-response.util');

const register = asyncHandler(async (req, res) => {
  const meta   = { ip: req.ip, userAgent: req.headers['user-agent'] };
  const result = await authService.register(req.body, meta);
  return sendSuccess(res, {
    data:       result,
    message:    'Registration successful.',
    statusCode: 201,
  });
});

const login = asyncHandler(async (req, res) => {
  const meta   = { ip: req.ip, userAgent: req.headers['user-agent'] };
  const result = await authService.login(req.body.email, req.body.password, meta);
  return sendSuccess(res, { data: result, message: 'Login successful.' });
});

const refresh = asyncHandler(async (req, res) => {
  const tokens = await authService.refreshTokens(req.body.refreshToken);
  return sendSuccess(res, { data: tokens, message: 'Tokens refreshed.' });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return sendSuccess(res, { data: user, message: 'Profile retrieved.' });
});

module.exports = { register, login, refresh, getMe };
