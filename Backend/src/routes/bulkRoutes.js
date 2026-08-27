const express = require("express");
const multer = require("multer");

const { bulkUploadQuotes } = require("../controllers/bulkController");

const router = express.Router();

// ======================================
// MULTER CONFIG
// ======================================

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    const isCSV =
      file.mimetype === "text/csv" ||
      file.originalname.toLowerCase().endsWith(".csv");

    if (!isCSV) {
      return cb(new Error("Only CSV files are allowed"));
    }

    cb(null, true);
  },
});

// ======================================
// BULK QUOTES UPLOAD
// ======================================

router.post("/quotes/bulk-upload", upload.single("file"), bulkUploadQuotes);

module.exports = router;
