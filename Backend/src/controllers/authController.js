const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// ======================================
// ALLOWED LANGUAGES
// ======================================

const allowedLanguages = ["English", "Hindi"];

// ======================================
// ALLOWED SOCIAL PROVIDERS
// ======================================

const allowedProviders = ["google", "facebook"];

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
// GENERATE JWT
// ======================================

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId: userId.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

// ======================================
// REGISTER
// ======================================

const register = async (req, res) => {
  try {
    const { name, email, password, language = "English" } = req.body || {};

    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    // --------------------------------------
    // NORMALIZE EMAIL
    // --------------------------------------

    const normalizedEmail = email.trim().toLowerCase();

    // --------------------------------------
    // CHECK USER
    // --------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // --------------------------------------
    // PASSWORD
    // --------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // --------------------------------------
    // PROFILE IMAGE
    // --------------------------------------

    let profileImage = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      profileImage = result.secure_url;
    }

    // --------------------------------------
    // CREATE USER
    // --------------------------------------

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      profileImage,
      language,
      provider: "email",
    });

    // --------------------------------------
    // TOKEN
    // --------------------------------------

    const token = generateToken(user._id);

    // --------------------------------------
    // RESPONSE
    // --------------------------------------

    return res.status(201).json({
      success: true,
      message: "Registration successful",

      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        language: user.language,
        provider: user.provider,
      },

      token,
    });
  } catch (error) {
    console.error("❌ Register Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ======================================
// LOGIN
// ======================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // --------------------------------------
    // VALIDATION
    // --------------------------------------

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // --------------------------------------
    // FIND USER
    // --------------------------------------

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // --------------------------------------
    // SOCIAL USER
    // --------------------------------------

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "This account uses social login",
      });
    }

    // --------------------------------------
    // PASSWORD CHECK
    // --------------------------------------

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // --------------------------------------
    // TOKEN
    // --------------------------------------

    const token = generateToken(user._id);

    // --------------------------------------
    // RESPONSE
    // --------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        language: user.language || "English",
        provider: user.provider || "email",
      },

      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ======================================
// GOOGLE / FACEBOOK LOGIN
// ======================================

const socialLogin = async (req, res) => {
  try {
    const {
      firebaseUid,
      name,
      email,
      profileImage,
      provider,
      language = "English",
    } = req.body || {};

    console.log("🔥 SOCIAL LOGIN REQUEST:", {
      firebaseUid,
      name,
      email,
      provider,
      language,
    });

    // ======================================
    // VALIDATION
    // ======================================

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Firebase UID is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!allowedProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        message: "Provider must be google or facebook",
      });
    }

    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    // ======================================
    // NORMALIZE EMAIL
    // ======================================

    const normalizedEmail = email.trim().toLowerCase();

    // ======================================
    // FIND BY FIREBASE UID FIRST
    // ======================================

    let user = await User.findOne({
      firebaseUid,
    });

    // ======================================
    // IF NOT FOUND → FIND BY EMAIL
    // ======================================

    if (!user) {
      user = await User.findOne({
        email: normalizedEmail,
      });
    }

    // ======================================
    // CREATE USER
    // ======================================

    if (!user) {
      user = await User.create({
        name: name?.trim() || "User",

        email: normalizedEmail,

        password: null,

        firebaseUid,

        provider,

        googleId: provider === "google" ? firebaseUid : null,

        facebookId: provider === "facebook" ? firebaseUid : null,

        profileImage: profileImage || null,

        language,
      });

      console.log("🔥 NEW SOCIAL USER CREATED:", user._id.toString());
    }

    // ======================================
    // EXISTING USER
    // ======================================
    else {
      if (name?.trim()) {
        user.name = name.trim();
      }

      // Firebase UID
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
      }

      // Profile image
      if (profileImage) {
        user.profileImage = profileImage;
      }

      // Language
      user.language = language;

      // Google
      if (provider === "google" && !user.googleId) {
        user.googleId = firebaseUid;
      }

      // Facebook
      if (provider === "facebook" && !user.facebookId) {
        user.facebookId = firebaseUid;
      }

      // Provider
      if (user.provider === "email") {
        user.provider = provider;
      }

      await user.save();

      console.log("🔥 EXISTING SOCIAL USER:", user._id.toString());
    }

    // ======================================
    // JWT
    // ======================================

    const token = generateToken(user._id);

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,

      message: "Social login successful",

      user: {
        id: user._id.toString(),

        name: user.name,

        email: user.email,

        profileImage: user.profileImage,

        language: user.language || "English",

        firebaseUid: user.firebaseUid,

        provider: user.provider,
      },

      token,
    });
  } catch (error) {
    console.error("❌ Social Login Error:", error);

    // ======================================
    // DUPLICATE KEY
    // ======================================

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Social login failed",
      error: error.message,
    });
  }
};

// ======================================
// EXPORT
// ======================================

module.exports = {
  register,
  login,
  socialLogin,
};
