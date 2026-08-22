const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    quotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Same user ke liye same collection name duplicate nahi hoga
collectionSchema.index(
  {
    userId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

const Collection = mongoose.model("Collection", collectionSchema);

module.exports = Collection;
