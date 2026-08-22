const express = require("express");

const router = express.Router();

const {
  getQuotes,
  getQuote,
  getQuotesByCategory,
  getQuotesBySubcategory,
  searchQuotes,
  getLatestQuotes,
  getPopularQuotes,
  getDailyQuote,
} = require("../controllers/quoteController");

const upload = require("../middleware/upload");

// GET ALL
router.get("/", getQuotes);

// SEARCH
router.get("/search", searchQuotes);

// LATEST
router.get("/latest", getLatestQuotes);

// POPULAR
router.get("/popular", getPopularQuotes);

// DAILY ⭐
router.get("/daily", getDailyQuote);

// CATEGORY
router.get("/category/:categoryId", getQuotesByCategory);

// SUBCATEGORY
router.get("/subcategory/:subcategoryId", getQuotesBySubcategory);

// SINGLE QUOTE — ALWAYS LAST
router.get("/:id", getQuote);

module.exports = router;
