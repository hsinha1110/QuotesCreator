const express = require("express");

const router = express.Router();

const {
  getUsers,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

const imageUpload = require("../middleware/imageUpload");
const verifyToken = require("../middleware/verifyToken");
const userController = require("../controllers/userController");
// ======================================
// ADMIN - GET ALL USERS
// ======================================

router.get("/", getUsers);
router.get("/recent-quotes", verifyToken, userController.getRecentQuotes);

router.post("/recent-quotes", verifyToken, userController.saveRecentQuote);

router.delete(
  "/recent-quotes/:quoteId",
  verifyToken,
  userController.deleteRecentQuote,
);
router.get("/:id", getProfile);
// ======================================
// GET SINGLE USER
// ======================================

router.get("/:id", getProfile);

// ======================================
// UPDATE PROFILE
// ======================================

router.put("/:id", imageUpload.single("profileImage"), updateProfile);

// ======================================
// CHANGE PASSWORD
// ======================================

router.put("/:id/password", changePassword);

// ======================================
// DELETE USER
// ======================================

router.delete("/:id", verifyToken, deleteAccount);

module.exports = router;
