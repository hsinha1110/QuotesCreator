const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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
      default: "English",
    },

    // Different language versions
    translations: {
      type: Map,
      of: String,
      default: {},
    },

    // Popular quotes ke liye
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

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
