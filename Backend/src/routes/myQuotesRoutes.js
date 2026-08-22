const express = require("express");

const router = express.Router();
const {
  getMyQuotes,
  getMyDrafts,
  getCreatedQuotes,
  updateMyQuote,
  deleteMyQuote,
} = require("../controllers/myQuotesController");

router.get("/:userId", getMyQuotes);

router.get("/:userId/drafts", getMyDrafts);

router.get("/:userId/created", getCreatedQuotes);

router.delete("/:userId/:quoteId", deleteMyQuote);
router.put("/:userId/:quoteId", updateMyQuote);

module.exports = router;
