'use strict';

const { hashPassword, comparePassword } = require('../utils/hash.util');

/**
 * Hash a plain-text password.
 * @param {string} plain
 * @returns {Promise<string>}
 */
const hash = (plain) => hashPassword(plain);

/**
 * Verify a plain-text password against a stored hash.
 * @param {string} plain
 * @param {string} hashed
 * @returns {Promise<boolean>}
 */
const verify = (plain, hashed) => comparePassword(plain, hashed);

module.exports = { hash, verify };
