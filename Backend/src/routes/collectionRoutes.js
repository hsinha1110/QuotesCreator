const express = require("express");

const router = express.Router();

const {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
  addQuoteToCollection,
  removeQuoteFromCollection,
} = require("../controllers/collectionController");

// ===============================
// CREATE COLLECTION
// ===============================
router.post("/", createCollection);

// ===============================
// GET USER COLLECTIONS
// ===============================
router.get("/user/:userId", getCollections);

// ===============================
// ADD QUOTE TO COLLECTION
// ===============================
router.post("/:collectionId/quotes/:quoteId", addQuoteToCollection);

// ===============================
// REMOVE QUOTE FROM COLLECTION
// ===============================
router.delete("/:collectionId/quotes/:quoteId", removeQuoteFromCollection);

// ===============================
// GET SINGLE COLLECTION
// IMPORTANT: KEEP AFTER /user/:userId
// ===============================
router.get("/:id", getCollection);

// ===============================
// UPDATE COLLECTION
// ===============================
router.put("/:id", updateCollection);

// ===============================
// DELETE COLLECTION
// ===============================
router.delete("/:id", deleteCollection);

module.exports = router;
