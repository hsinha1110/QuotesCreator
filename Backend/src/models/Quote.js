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
      enum: [
        "English",
        "Hindi",
        "Spanish",
        "French",
        "German",
        "Arabic",
        "Portuguese",
        "Italian",
      ],
      default: "Hindi",
    },

    translations: {
      type: Map,
      of: String,
      default: {},
    },

    views: {
      type: Number,
      default: 0,
    },

    isDraft: {
      type: Boolean,
      default: false,
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

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
