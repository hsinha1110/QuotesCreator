const express = require("express");

const router = express.Router();

const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../controllers/favoriteController");

router.post("/", addFavorite);

router.get("/:userId", getFavorites);

router.delete("/", removeFavorite);

module.exports = router;
