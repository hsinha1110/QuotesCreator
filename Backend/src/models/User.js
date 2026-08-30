const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ==========================================
    // PASSWORD
    // ==========================================

    password: {
      type: String,
      minlength: 6,
      default: null,
    },

    // ==========================================
    // SOCIAL LOGIN
    // ==========================================

    firebaseUid: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },

    provider: {
      type: String,
      enum: ["email", "google", "facebook"],
      default: "email",
    },

    googleId: {
      type: String,
      default: null,
    },

    facebookId: {
      type: String,
      default: null,
    },

    // ==========================================
    // PROFILE
    // ==========================================

    profileImage: {
      type: String,
      default: null,
    },

    // ==========================================
    // LANGUAGE
    // ==========================================

    language: {
      type: String,
      enum: [
        "English",
        "Hindi",
      ],
      default: "English",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
