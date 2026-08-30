const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "daily_quote",
        "new_quote",
        "new_template",
        "announcement",
        "general",
      ],
      default: "general",
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  userId: 1,
  createdAt: -1,
});

notificationSchema.index({
  userId: 1,
  isRead: 1,
});

module.exports =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
