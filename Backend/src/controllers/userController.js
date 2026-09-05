const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Quote = require("../models/Quote");
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
const saveRecentQuote = async (req, res) => {
  try {
    console.log("=================================");
    console.log("🔥 SAVE RECENT QUOTE");

    console.log("🔥 req.user:", req.user);
    console.log("🔥 req.body:", req.body);

    const userId = req.user?.userId || req.user?.id || req.user?._id;

    const { quoteId } = req.body || {};

    console.log("🔥 USER ID:", userId);
    console.log("🔥 QUOTE ID:", quoteId);

    // -----------------------------
    // USER ID VALIDATION
    // -----------------------------

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // -----------------------------
    // QUOTE ID VALIDATION
    // -----------------------------

    if (!quoteId) {
      return res.status(400).json({
        success: false,
        message: "Quote ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(quoteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    // -----------------------------
    // FIND QUOTE
    // -----------------------------

    const quote = await Quote.findById(quoteId);

    console.log("🔥 QUOTE FOUND:", !!quote);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // -----------------------------
    // FIND USER
    // -----------------------------

    const user = await User.findById(userId);

    console.log("🔥 USER FOUND:", user ? user._id.toString() : null);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------
    // INITIALIZE RECENT QUOTES
    // -----------------------------

    if (!Array.isArray(user.recentQuotes)) {
      user.recentQuotes = [];
    }

    // -----------------------------
    // REMOVE DUPLICATE
    // -----------------------------

    user.recentQuotes = user.recentQuotes.filter(
      (id) => id.toString() !== quoteId.toString(),
    );

    // -----------------------------
    // ADD LATEST QUOTE
    // -----------------------------

    user.recentQuotes.unshift(quote._id);

    // -----------------------------
    // KEEP LAST 10
    // -----------------------------

    user.recentQuotes = user.recentQuotes.slice(0, 10);

    // -----------------------------
    // SAVE USER
    // -----------------------------

    await user.save();

    console.log("✅ RECENT QUOTES SAVED:", user.recentQuotes);

    return res.status(200).json({
      success: true,
      message: "Recent quote saved successfully",
      recentQuotes: user.recentQuotes,
    });
  } catch (error) {
    console.error("❌ SAVE RECENT QUOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save recent quote",
      error: error.message,
    });
  }
};
// ======================================
// GET RECENT QUOTES
// GET /api/users/recent-quotes
// ======================================
// ======================================
// GET RECENT QUOTES
// GET /api/users/recent-quotes
// ======================================
const getRecentQuotes = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    // LANGUAGE
    const language =
      String(req.query.language || "English").toLowerCase() === "hindi"
        ? "Hindi"
        : "English";

    console.log("🌐 RECENT QUOTES LANGUAGE:", language);

    const user = await User.findById(userId).populate({
      path: "recentQuotes",
      match: {
        isActive: { $ne: false },
        isDraft: false,
      },
      select:
        "_id text author language image categoryId subcategoryId translations likes views createdAt",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const recentQuotes = (user.recentQuotes || []).map((quote) => {
      const quoteObject = quote.toObject ? quote.toObject() : quote;

      const translations = quoteObject.translations || {};

      let displayText = quoteObject.text || "";

      if (language === "Hindi" && translations.Hindi) {
        displayText = translations.Hindi;
      }

      if (language === "English" && translations.English) {
        displayText = translations.English;
      }

      return {
        ...quoteObject,
        displayText,
        displayLanguage: language,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Recent quotes fetched successfully",
      language,
      recentQuotes,
    });
  } catch (error) {
    console.error("❌ GET RECENT QUOTES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent quotes",
      error: error.message,
    });
  }
};
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

// ======================================
// SAVE RECENT QUOTE
// POST /api/users/recent-quotes
// ======================================

// ======================================
// GET RECENT QUOTES
// GET /api/users/recent-quotes
// ======================================

// ======================================
// DELETE RECENT QUOTE
// DELETE /api/users/recent-quotes/:quoteId
// ======================================

const deleteRecentQuote = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { quoteId } = req.params;

    console.log("DELETE RECENT QUOTE USER ID:", userId);
    console.log("DELETE RECENT QUOTE ID:", quoteId);

    // Validate user ID
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Validate quote ID
    if (!quoteId) {
      return res.status(400).json({
        success: false,
        message: "Quote ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(quoteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.recentQuotes = (user.recentQuotes || []).filter(
      (id) => id.toString() !== quoteId.toString(),
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Recent quote deleted successfully",
      recentQuotes: user.recentQuotes,
    });
  } catch (error) {
    console.error("Delete Recent Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete recent quote",
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
  saveRecentQuote,
  getRecentQuotes,
  deleteRecentQuote,
};
