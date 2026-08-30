const mongoose = require("mongoose");

const quoteLikeSchema = new mongoose.Schema(
  {
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Same user same quote ko ek hi baar like kar sake
quoteLikeSchema.index({ quoteId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("QuoteLike", quoteLikeSchema);
