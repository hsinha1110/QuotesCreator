const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// ======================================
// ALLOWED LANGUAGES
// ======================================

const allowedLanguages = ["English", "Hindi"];

// ======================================
// CLOUDINARY UPLOAD
// ======================================

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "QuotesCreator/users",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(fileBuffer);
  });
};

// ======================================
// GET PROFILE
// ======================================

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE PROFILE
// ======================================

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, language } = req.body || {};

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // UPDATE NAME
    // ======================================

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    // ======================================
    // UPDATE EMAIL
    // ======================================

    if (email !== undefined) {
      if (!email.trim()) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      user.email = normalizedEmail;
    }

    // ======================================
    // UPDATE LANGUAGE
    // ======================================

    if (language !== undefined) {
      if (!allowedLanguages.includes(language)) {
        return res.status(400).json({
          success: false,
          message: "Invalid language",
          allowedLanguages,
        });
      }

      user.language = language;
    }

    // ======================================
    // UPDATE PROFILE IMAGE
    // ======================================

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      user.profileImage = result.secure_url;
    }

    // Save
    await user.save();

    // Response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        language: user.language,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// ======================================
// CHANGE PASSWORD
// ======================================

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;

    const { currentPassword, newPassword } = req.body || {};

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Validate passwords
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

// ======================================
// DELETE ACCOUNT
// ======================================

const deleteAccount = async (req, res) => {
  try {
    // JWT middleware se user ID
    const userId = req.user?.userId;

    console.log("DELETE ACCOUNT USER ID:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ======================================
    // DELETE USER
    // ======================================

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};
// ======================================
// GET ALL USERS - ADMIN
// ======================================

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", language = "" } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};

    // Search name/email
    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // Language filter
    if (language.trim()) {
      filter.language = language.trim();
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,

      page: pageNumber,

      limit: limitNumber,

      total,

      totalPages: Math.ceil(total / limitNumber),

      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get users",
      error: error.message,
    });
  }
};
module.exports = {
  getProfile,
  getUsers,
  updateProfile,
  changePassword,
  deleteAccount,
};
