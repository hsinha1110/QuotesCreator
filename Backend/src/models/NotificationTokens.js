const mongoose = require("mongoose");

const notificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fcmToken: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("NotificationToken", notificationTokenSchema);
