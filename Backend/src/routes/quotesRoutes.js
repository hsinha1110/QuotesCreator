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

router.post("/", createQuote);

router.get("/", getQuotes);
router.get("/search", searchQuotes);
router.get("/latest", getLatestQuotes);
router.get("/popular", getPopularQuotes);
router.get("/daily", getDailyQuote);

router.get("/category/:categoryId", getQuotesByCategory);
router.get("/subcategory/:subcategoryId", getQuotesBySubcategory);

router.get("/:id", getQuote);
router.put("/:id", updateQuote);
router.delete("/:id", deleteQuote);

module.exports = router;
