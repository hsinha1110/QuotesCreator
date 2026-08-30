const mongoose = require("mongoose");

const notificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    fcmToken: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    platform: {
      type: String,
      enum: ["android", "ios"],
      required: true,
    },

    language: {
      type: String,
      enum: ["English", "Hindi"],
      default: "English",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

notificationTokenSchema.index({
  userId: 1,
  isActive: 1,
});

module.exports =
  mongoose.models.NotificationToken ||
  mongoose.model("NotificationToken", notificationTokenSchema);
