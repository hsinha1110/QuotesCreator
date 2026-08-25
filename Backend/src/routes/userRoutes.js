const express = require("express");

const router = express.Router();

const {
  getUsers,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

const upload = require("../middleware/upload");

// ======================================
// ADMIN - GET ALL USERS
// ======================================

router.get("/", getUsers);

router.get("/:id", getProfile);
// ======================================
// GET SINGLE USER
// ======================================

router.get("/:id", getProfile);

// ======================================
// UPDATE PROFILE
// ======================================

router.put("/:id", upload.single("profileImage"), updateProfile);

// ======================================
// CHANGE PASSWORD
// ======================================

router.put("/:id/password", changePassword);

// ======================================
// DELETE USER
// ======================================

router.delete("/:id", deleteAccount);

module.exports = router;
