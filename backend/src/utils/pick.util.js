'use strict';

/**
 * Return a shallow copy of `obj` containing only the whitelisted keys.
 * Useful for stripping unknown fields before persisting.
 *
 * @param {object}   obj
 * @param {string[]} keys
 * @returns {object}
 */
const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});

module.exports = { pick };
