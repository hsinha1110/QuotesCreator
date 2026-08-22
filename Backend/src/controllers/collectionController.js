const mongoose = require("mongoose");

const Collection = require("../models/Collection");
const Quote = require("../models/Quotes");

// ======================================
// CREATE COLLECTION
// ======================================

const createCollection = async (req, res) => {
  try {
    const { userId, name, image } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Collection name is required",
      });
    }

    const existingCollection = await Collection.findOne({
      userId,
      name: name.trim(),
    });

    if (existingCollection) {
      return res.status(409).json({
        message: "Collection already exists",
      });
    }

    const collection = await Collection.create({
      userId,
      name: name.trim(),
      image: image || null,
      quotes: [],
    });

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      collection,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Collection already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create collection",
      error: error.message,
    });
  }
};

// ======================================
// GET USER COLLECTIONS
// ======================================

const getCollections = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const total = await Collection.countDocuments({
      userId,
    });

    const collections = await Collection.find({
      userId,
    })
      .populate("quotes")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get collections",
      error: error.message,
    });
  }
};

// ======================================
// GET SINGLE COLLECTION
// ======================================

const getCollection = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid collection ID",
      });
    }

    const collection = await Collection.findById(id).populate("quotes");

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get collection",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE COLLECTION
// ======================================

const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid collection ID",
      });
    }

    const collection = await Collection.findById(id);

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Collection name cannot be empty",
        });
      }

      collection.name = name.trim();
    }

    if (image !== undefined) {
      collection.image = image;
    }

    await collection.save();

    res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      collection,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Collection already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update collection",
      error: error.message,
    });
  }
};

// ======================================
// DELETE COLLECTION
// ======================================

const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid collection ID",
      });
    }

    const collection = await Collection.findByIdAndDelete(id);

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete collection",
      error: error.message,
    });
  }
};

// ======================================
// ADD QUOTE TO COLLECTION
// ======================================

const addQuoteToCollection = async (req, res) => {
  try {
    const { collectionId, quoteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({
        message: "Invalid collection ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(quoteId)) {
      return res.status(400).json({
        message: "Invalid quote ID",
      });
    }

    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    const alreadyExists = collection.quotes.some(
      (id) => id.toString() === quoteId,
    );

    if (alreadyExists) {
      return res.status(409).json({
        message: "Quote already exists in collection",
      });
    }

    collection.quotes.push(quoteId);

    await collection.save();

    const updatedCollection =
      await Collection.findById(collectionId).populate("quotes");

    res.status(200).json({
      success: true,
      message: "Quote added to collection",
      collection: updatedCollection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add quote to collection",
      error: error.message,
    });
  }
};

// ======================================
// REMOVE QUOTE FROM COLLECTION
// ======================================

const removeQuoteFromCollection = async (req, res) => {
  try {
    const { collectionId, quoteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(collectionId)) {
      return res.status(400).json({
        message: "Invalid collection ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(quoteId)) {
      return res.status(400).json({
        message: "Invalid quote ID",
      });
    }

    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    const quoteExists = collection.quotes.some(
      (id) => id.toString() === quoteId,
    );

    if (!quoteExists) {
      return res.status(404).json({
        message: "Quote not found in collection",
      });
    }

    collection.quotes = collection.quotes.filter(
      (id) => id.toString() !== quoteId,
    );

    await collection.save();

    res.status(200).json({
      success: true,
      message: "Quote removed from collection",
      collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove quote from collection",
      error: error.message,
    });
  }
};

module.exports = {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
  addQuoteToCollection,
  removeQuoteFromCollection,
};
