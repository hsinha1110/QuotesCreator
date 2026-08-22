const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
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

// Same user same quote ka duplicate download record nahi
downloadSchema.index(
  {
    userId: 1,
    quoteId: 1,
  },
  {
    unique: true,
  },
);

const Download = mongoose.model("Download", downloadSchema);

module.exports = Download;
