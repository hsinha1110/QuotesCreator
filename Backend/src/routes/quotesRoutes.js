const express = require("express");

const userController = require("../controllers/userController");
const quoteController = require("../controllers/quoteController");
console.log("QUOTE CONTROLLER:", quoteController);
const {
  likeQuote,
  unlikeQuote,
} = require("../controllers/quoteLikeController");

const { bulkUploadQuotes } = require("../controllers/bulkController");

const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload");

const router = express.Router();

// =====================================================
// DAILY
// GET /api/users/daily
// =====================================================

router.get("/daily", quoteController.getDailyQuote);

// =====================================================
// LATEST
// GET /api/users/latest
// =====================================================

router.get("/latest", quoteController.getLatestQuotes);

// =====================================================
// POPULAR
// GET /api/users/popular
// =====================================================

router.get("/popular", quoteController.getPopularQuotes);

// =====================================================
// RECENT QUOTES
// IMPORTANT: MUST BE BEFORE /:id
// =====================================================

// =====================================================
// RECENT QUOTES
// =====================================================

// GET /api/users/recent-quotes
router.get("/recent-quotes", verifyToken, userController.getRecentQuotes);

// POST /api/users/recent-quotes
router.post("/recent-quotes", verifyToken, userController.saveRecentQuote);

// DELETE /api/users/recent-quotes/:quoteId
router.delete("/:id", verifyToken, quoteController.deleteQuote);
// =====================================================
// ALL QUOTES
// GET /api/users
// =====================================================

router.get("/", quoteController.getQuotes);

// =====================================================
// BULK UPLOAD
// POST /api/users/bulk-upload
// =====================================================

router.post("/bulk-upload", upload.single("file"), bulkUploadQuotes);

// =====================================================
// CREATE QUOTE
// POST /api/users
// =====================================================

router.post("/", quoteController.createQuote);

// =====================================================
// LIKE
// POST /api/users/:id/like

router.post("/:id/like", verifyToken, likeQuote);

// =====================================================
// UNLIKE
// DELETE /api/users/:id/like
// =====================================================

router.delete("/:id/like", verifyToken, unlikeQuote);

// =====================================================
// SINGLE QUOTE
// IMPORTANT: KEEP LAST
// GET /api/users/:id
// =====================================================

router.get("/:id", quoteController.getQuote);

// =====================================================
// UPDATE
// PUT /api/users/:id
// =====================================================

router.put("/:id", quoteController.updateQuote);

// =====================================================
// DELETE
// DELETE /api/users/:id
// =====================================================

router.delete("/:id", quoteController.deleteQuote);

module.exports = router;
