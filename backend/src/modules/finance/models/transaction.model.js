
'use strict';

const mongoose = require('mongoose');

const TRANSACTION_TYPES = ['income', 'expense'];
const TRANSACTION_STATUSES = ['pending', 'completed', 'cancelled'];

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Title is required.'],
      trim:      true,
      maxlength: [150, 'Title cannot exceed 150 characters.'],
    },

    amount: {
      type:    Number,
      required:[true, 'Amount is required.'],
      min:     [0.01, 'Amount must be greater than 0.'],
    },

    type: {
      type:     String,
      enum:     TRANSACTION_TYPES,
      required: [true, 'Transaction type is required.'],
    },

    category: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Category',
      required: [true, 'Category is required.'],
    },

    date: {
      type:    Date,
      required:[true, 'Date is required.'],
      default: Date.now,
    },

    notes: {
      type:      String,
      trim:      true,
      maxlength: [500, 'Notes cannot exceed 500 characters.'],
    },

    status: {
      type:    String,
      enum:    TRANSACTION_STATUSES,
      default: 'completed',
    },

    tags: [{ type: String, trim: true, maxlength: 30 }],

    // Audit trail
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Soft delete
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

// ── Indexes for common query patterns ─────────────────────────────────────────
transactionSchema.index({ createdBy: 1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ deletedAt: 1 });

// Compound indexes for analytics aggregations
transactionSchema.index({ type: 1, date: -1 });
transactionSchema.index({ category: 1, type: 1 });
transactionSchema.index({ date: -1, type: 1, deletedAt: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = { Transaction, TRANSACTION_TYPES, TRANSACTION_STATUSES };
