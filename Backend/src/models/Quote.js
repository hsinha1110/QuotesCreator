const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      default: null,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      default: "Unknown",
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    language: {
      type: String,
      enum: ["English", "Hindi"],
      default: "Hindi",
    },

    translations: {
      type: Map,
      of: String,
      default: {},
    },

    // ==========================================
    // ENGAGEMENT
    // ==========================================

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // STATUS
    // ==========================================

    isDraft: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    source: {
      type: String,
      enum: ["admin", "user", "ai"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// INDEXES
// ==========================================

quoteSchema.index({
  categoryId: 1,
});

quoteSchema.index({
  subcategoryId: 1,
});

quoteSchema.index({
  categoryId: 1,
  subcategoryId: 1,
});

quoteSchema.index({
  language: 1,
});

// Latest
quoteSchema.index({
  language: 1,
  createdAt: -1,
});

// Popular
quoteSchema.index({
  language: 1,
  likes: -1,
});

module.exports = mongoose.model("Quote", quoteSchema);
