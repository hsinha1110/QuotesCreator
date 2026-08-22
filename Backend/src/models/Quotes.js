const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      trim: true,
      default: "Unknown",
    },

    image: {
      type: String,
      default: null,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Quote = mongoose.model("Quote", quoteSchema);

module.exports = Quote;
