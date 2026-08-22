const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

const upload = require("../middleware/upload");

// Get profile
router.get("/:id", getProfile);

// Update profile + image
router.put("/:id", upload.single("profileImage"), updateProfile);

// Change password
router.put("/:id/password", changePassword);

// Delete account
router.delete("/:id", deleteAccount);

module.exports = router;
