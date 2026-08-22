const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

favoriteSchema.index({ userId: 1, quoteId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
