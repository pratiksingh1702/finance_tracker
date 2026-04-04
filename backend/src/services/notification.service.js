'use strict';

const logger = require('../logs/logger');

/**
 * Notification service — stub for email / push / webhook notifications.
 * Replace the logger calls with a real provider (SendGrid, SES, etc.)
 * without touching any business logic.
 */

/**
 * Send a welcome email after registration.
 * @param {object} user - { email, name }
 */
const sendWelcome = async (user) => {
  logger.info(`[Notification] Welcome email → ${user.email}`);
  // await emailProvider.send({ to: user.email, template: 'welcome', data: user });
};

/**
 * Send a password-reset link.
 * @param {object} opts
 * @param {string} opts.email
 * @param {string} opts.resetLink
 */
const sendPasswordReset = async ({ email, resetLink }) => {
  logger.info(`[Notification] Password reset email → ${email}`);
  // await emailProvider.send({ to: email, template: 'password-reset', data: { resetLink } });
};

/**
 * Notify admins when a new user is created.
 * @param {object} newUser
 */
const notifyAdminUserCreated = async (newUser) => {
  logger.info(`[Notification] Admin alerted: new user ${newUser.email} created.`);
};

module.exports = { sendWelcome, sendPasswordReset, notifyAdminUserCreated };
