const express = require("express");

const quoteController = require("../controllers/quoteController");

console.log("QUOTE CONTROLLER:", quoteController);

const router = express.Router();

router.post("/", quoteController.createQuote);

router.get("/", quoteController.getQuotes);

router.get("/:id", quoteController.getQuote);

module.exports = router;
