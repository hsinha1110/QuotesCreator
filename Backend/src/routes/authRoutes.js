const express = require("express");

const router = express.Router();

const {
  register,
  login,
  socialLogin,
} = require("../controllers/authController");

const imageUpload = require("../middleware/imageUpload");

// ======================================
// REGISTER
// ======================================

router.post("/register", imageUpload.single("profileImage"), register);

// ======================================
// LOGIN
// ======================================

router.post("/login", login);

// ======================================
// GOOGLE / FACEBOOK LOGIN
// ======================================

router.post("/social-login", socialLogin);

module.exports = router;
