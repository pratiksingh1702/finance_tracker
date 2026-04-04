
'use strict';

const mongoose = require('mongoose');
const { ROLE_VALUES } = require('./role.model');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required.'],
      trim:     true,
      minlength: [2, 'Name must be at least 2 characters.'],
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },

    email: {
      type:      String,
      required:  [true, 'Email is required.'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email.'],
    },

    password: {
      type:     String,
      required: [true, 'Password is required.'],
      minlength: [8, 'Password must be at least 8 characters.'],
      select:   false, // never returned in queries unless explicitly selected
    },

    role: {
      type:    String,
      enum:    ROLE_VALUES,
      default: 'viewer',
    },

    isActive: {
      type:    Boolean,
      default: true,
    },

    // Soft-delete support
    deletedAt: {
      type:    Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
    },

    lastLoginAt: {
      type: Date,
    },

    // Audit trail
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

// ── Indexes ────────────────────────────────────────────────────────────────────
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ deletedAt: 1 }); // filter soft-deleted

// ── Query helpers ──────────────────────────────────────────────────────────────

/** Only return documents that haven't been soft-deleted */
userSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, deletedAt: null });
};

// ── Virtual ────────────────────────────────────────────────────────────────────
userSchema.virtual('isDeleted').get(function () {
  return this.deletedAt !== null;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
