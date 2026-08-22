const express = require("express");

const router = express.Router();

const { generateQuote } = require("../controllers/aiController");

router.post("/generate", generateQuote);

module.exports = router;
