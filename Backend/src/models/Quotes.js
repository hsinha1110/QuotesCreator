const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    // Quote kis user ne create kiya
    // Admin/AI quotes ke liye null ho sakta hai
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
      ref: "Subcategory", // ✅ FIX
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
