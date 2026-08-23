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

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profileImage: {
      type: String,
      default: null,
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
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
