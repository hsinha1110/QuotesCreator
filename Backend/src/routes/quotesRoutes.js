const express = require("express");

const router = express.Router();

// ==========================================
// CONTROLLERS
// ==========================================

const quoteController = require("../controllers/quoteController");

const {
  likeQuote,
  unlikeQuote,
} = require("../controllers/quoteLikeController");

const { bulkUploadQuotes } = require("../controllers/bulkController");

// ==========================================
// MIDDLEWARE
// ==========================================

const verifyToken = require("../middleware/verifyToken");

const upload = require("../middleware/upload");

// =====================================================
// DAILY
// =====================================================

router.get("/daily", quoteController.getDailyQuote);

// =====================================================
// LATEST
// IMPORTANT: BEFORE /:id
// =====================================================

router.get("/latest", quoteController.getLatestQuotes);

// =====================================================
// POPULAR
// IMPORTANT: BEFORE /:id
// =====================================================

router.get("/popular", quoteController.getPopularQuotes);

// =====================================================
// ALL
// =====================================================

router.get("/", quoteController.getQuotes);

// =====================================================
// BULK UPLOAD
// =====================================================

router.post("/bulk-upload", upload.single("file"), bulkUploadQuotes);

// =====================================================
// CREATE
// =====================================================

router.post("/", quoteController.createQuote);

// =====================================================
// LIKE
// =====================================================

router.post("/:id/like", verifyToken, likeQuote);

// =====================================================
// UNLIKE
// =====================================================

router.delete("/:id/like", verifyToken, unlikeQuote);

// =====================================================
// SINGLE
// KEEP LAST
// =====================================================

router.get("/:id", quoteController.getQuote);

// =====================================================
// UPDATE
// =====================================================

router.put("/:id", quoteController.updateQuote);

// =====================================================
// DELETE
// =====================================================

router.delete("/:id", quoteController.deleteQuote);

module.exports = router;
