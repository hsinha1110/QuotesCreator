const express = require("express");

const router = express.Router();

const {
  createQuote,
  getQuotes,
  getQuote,
  getDailyQuote,
  getQuotesByCategory,
  getQuotesBySubcategory,
  updateQuote,
  deleteQuote,
  searchQuotes,
  getLatestQuotes,
  getPopularQuotes,
} = require("../controllers/quoteController");

const upload = require("../middleware/upload");

// ======================================
// CREATE QUOTE
// ======================================

router.post(
  "/",
  upload.single("image"),
  createQuote
);

// ======================================
// GET ALL QUOTES
// ======================================

router.get("/", getQuotes);

// ======================================
// SEARCH
// ======================================

router.get("/search", searchQuotes);

// ======================================
// LATEST
// ======================================

router.get("/latest", getLatestQuotes);

// ======================================
// POPULAR
// ======================================

router.get("/popular", getPopularQuotes);

// ======================================
// DAILY
// ======================================

router.get("/daily", getDailyQuote);

// ======================================
// CATEGORY
// ======================================

router.get(
  "/category/:categoryId",
  getQuotesByCategory
);

// ======================================
// SUBCATEGORY
// ======================================

router.get(
  "/subcategory/:subcategoryId",
  getQuotesBySubcategory
);

// ======================================
// GET SINGLE
// ======================================

router.get("/:id", getQuote);

// ======================================
// UPDATE
// ======================================

router.put(
  "/:id",
  upload.single("image"),
  updateQuote
);

// ======================================
// DELETE
// ======================================

router.delete("/:id", deleteQuote);

module.exports = router;