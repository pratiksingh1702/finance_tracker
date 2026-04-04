'use strict';

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Category name is required.'],
      trim:      true,
      unique:    true,
      maxlength: [50, 'Category name cannot exceed 50 characters.'],
    },

    description: {
      type:      String,
      trim:      true,
      maxlength: [200, 'Description cannot exceed 200 characters.'],
    },

    color: {
      type:    String,
      default: '#6B7280',
      match:   [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Color must be a valid hex code.'],
    },

    icon: {
      type:    String,
      default: 'tag',
    },

    isActive: {
      type:    Boolean,
      default: true,
    },

    // Soft delete
    deletedAt: { type: Date, default: null },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  },
);

categorySchema.index({ isActive: 1 });
categorySchema.index({ deletedAt: 1 });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
