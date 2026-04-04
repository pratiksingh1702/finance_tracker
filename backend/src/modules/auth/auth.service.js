'use strict';

const userRepository    = require('../user/user.repository');
const authRepository    = require('./auth.repository');
const passwordService   = require('../../services/password.service');
const tokenService      = require('../../services/token.service');
const notifService      = require('../../services/notification.service');
const auditService      = require('../../services/audit.service');
const ApiError          = require('../../utils/api-error.util');
const { localStrategy } = require('./strategies/local.strategy');

class AuthService {

  /**
   * Register a new user (public self-signup — always a viewer).
   */
  async register(dto, meta = {}) {
    const exists = await userRepository.findByEmail(dto.email);
    if (exists) {
      throw ApiError.conflict(`Email '${dto.email}' is already registered.`);
    }

    const hashed = await passwordService.hash(dto.password);
    const user   = await userRepository.create({
      name:     dto.name,
      email:    dto.email,
      password: hashed,
      role:     'viewer', // self-registered users always start as viewers
    });

    const payload = { id: user._id, email: user.email, role: user.role };
    const tokens  = tokenService.generateTokenPair(payload);

    await notifService.sendWelcome(user);

    auditService.log({
      action:    'REGISTER',
      resource:  'User',
      resourceId: String(user._id),
      after:     { email: user.email, role: user.role },
      ip:        meta.ip,
      userAgent: meta.userAgent,
    });

    return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, ...tokens };
  }

  /**
   * Authenticate with email + password and return token pair.
   */
  async login(email, password, meta = {}) {
    const user = await localStrategy(email, password);

    const payload = { id: user._id, email: user.email, role: user.role };
    const tokens  = tokenService.generateTokenPair(payload);

    await authRepository.recordLogin(user._id);

    auditService.log({
      action:     'LOGIN',
      resource:   'User',
      resourceId: String(user._id),
      actor:      { id: user._id, email: user.email, role: user.role },
      ip:         meta.ip,
      userAgent:  meta.userAgent,
    });

    return {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  }

  /**
   * Issue a new access token from a valid refresh token.
   */
  async refreshTokens(refreshToken) {
    let decoded;
    try {
      decoded = tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token.');
    }

    const user = await userRepository.findById(decoded.id);
    if (!user || !user.isActive || user.deletedAt) {
      throw ApiError.unauthorized('User account not found or inactive.');
    }

    const payload = { id: user._id, email: user.email, role: user.role };
    return tokenService.generateTokenPair(payload);
  }

  /**
   * Return the profile of the currently authenticated user.
   */
  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    return user;
  }
}

module.exports = new AuthService();
