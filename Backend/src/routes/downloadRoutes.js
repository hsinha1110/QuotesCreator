const express = require("express");

const router = express.Router();

const {
  addDownload,
  getDownloads,
  removeDownload,
} = require("../controllers/downloadController");

// Add download
router.post("/", addDownload);

// Get user downloads
router.get("/user/:userId", getDownloads);

// Remove download
router.delete("/", removeDownload);

module.exports = router;
