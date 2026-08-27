const express = require("express");

const router = express.Router();

// ======================================
// QUOTE CONTROLLER
// ======================================

const quoteController = require("../controllers/quoteController");

// ======================================
// BULK CONTROLLER
// ======================================

const { bulkUploadQuotes } = require("../controllers/bulkController");

// ======================================
// MULTER UPLOAD
// ======================================

const upload = require("../middleware/upload");

// ======================================
// GET ALL QUOTES
// ======================================

router.get("/", quoteController.getQuotes);

// ======================================
// BULK CSV UPLOAD
// ======================================
// POST /api/quotes/bulk-upload

router.post("/bulk-upload", upload.single("file"), bulkUploadQuotes);

// ======================================
// GET SINGLE QUOTE
// ======================================

router.get("/:id", quoteController.getQuote);

// ======================================
// CREATE QUOTE
// ======================================

router.post("/", quoteController.createQuote);

// ======================================
// UPDATE QUOTE
// ======================================

router.put("/:id", quoteController.updateQuote);

// ======================================
// DELETE QUOTE
// ======================================

router.delete("/:id", quoteController.deleteQuote);

// ======================================
// EXPORT
// ======================================

module.exports = router;
