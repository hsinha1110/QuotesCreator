const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    fcmToken: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["android", "ios"],
      required: true,
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

notificationSchema.index({ fcmToken: 1 }, { unique: true });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
