const mongoose = require("mongoose");

const stickerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["popular", "emoji", "shape", "quote"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Sticker = mongoose.model("Sticker", stickerSchema);

module.exports = Sticker;