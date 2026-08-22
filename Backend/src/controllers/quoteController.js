const mongoose = require("mongoose");

const Quote = require("../models/Quotes");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const cloudinary = require("../config/cloudinary");

// Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "QuotesCreator/quotes",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(fileBuffer);
  });
};

// ======================================
// Search Quotes
// ======================================

const searchQuotes = async (req, res) => {
  try {
    const { q } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchText = q.trim();

    const searchFilter = {
      $or: [
        {
          text: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          author: {
            $regex: searchText,
            $options: "i",
          },
        },
      ],
    };

    const total = await Quote.countDocuments(searchFilter);

    const quotes = await Quote.find(searchFilter)
      .populate("categoryId", "name image")
      .populate("subcategoryId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      query: searchText,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search quotes",
      error: error.message,
    });
  }
};
// ======================================
// Latest Quotes
// ======================================

const getLatestQuotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const total = await Quote.countDocuments();

    const quotes = await Quote.find()
      .populate("categoryId", "name image")
      .populate("subcategoryId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get latest quotes",
      error: error.message,
    });
  }
};

const getPopularQuotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const total = await Quote.countDocuments();

    const quotes = await Quote.find()
      .populate("categoryId", "name image")
      .populate("subcategoryId", "name image")
      .sort({
        views: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get popular quotes",
      error: error.message,
    });
  }
};

// ======================================
// Create Quote
// ======================================
const createQuote = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("CONTENT TYPE:", req.headers["content-type"]);

    const {
      userId,
      categoryId,
      subcategoryId,
      text,
      author,
      image,
      isDraft,
      source,
    } = req.body || {};

    const quote = await Quote.create({
      userId,
      categoryId,
      subcategoryId,
      text,
      author,
      image,
      isDraft: isDraft ?? false,
      source: source ?? "user",
    });

    res.status(201).json({
      success: true,
      message: "Quote created successfully",
      quote,
    });
  } catch (error) {
    console.error("Create Quote Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This quote already exists in this subcategory",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create quote",
      error: error.message,
    });
  }
};
// ======================================
// Get All Quotes
// Pagination
// ======================================

const getQuotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const total = await Quote.countDocuments();

    const quotes = await Quote.find()
      .populate("categoryId", "name image")
      .populate("subcategoryId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get quotes",
      error: error.message,
    });
  }
};

// ======================================
// Get Single Quote
// ======================================

const getQuote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid quote ID",
      });
    }

    const quote = await Quote.findById(id)
      .populate("categoryId", "name image")
      .populate("subcategoryId", "name image");

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get quote",
      error: error.message,
    });
  }
};

// ======================================
// Get Quotes By Category
// ======================================

const getQuotesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const total = await Quote.countDocuments({
      categoryId,
    });

    const quotes = await Quote.find({
      categoryId,
    })
      .populate("subcategoryId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get category quotes",
      error: error.message,
    });
  }
};

// ======================================
// Get Quotes By Subcategory
// ======================================

const getQuotesBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res.status(400).json({
        message: "Invalid subcategory ID",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const total = await Quote.countDocuments({
      subcategoryId,
    });

    const quotes = await Quote.find({
      subcategoryId,
    })
      .populate("categoryId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get subcategory quotes",
      error: error.message,
    });
  }
};
const getDailyQuote = async (req, res) => {
  try {
    const count = await Quote.countDocuments();

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: "No quotes available",
      });
    }

    // Random quote
    const randomIndex = Math.floor(Math.random() * count);

    const quote = await Quote.findOne()
      .populate("categoryId", "name image")
      .populate("subcategoryId", "name image")
      .skip(randomIndex);

    res.status(200).json({
      success: true,
      quote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get daily quote",
      error: error.message,
    });
  }
};
// ======================================
// Update Quote
// ======================================

const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const { categoryId, subcategoryId, text, author } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid quote ID",
      });
    }

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }

      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      quote.categoryId = categoryId;
    }

    if (subcategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(400).json({
          message: "Invalid subcategory ID",
        });
      }

      const subcategory = await Subcategory.findById(subcategoryId);

      if (!subcategory) {
        return res.status(404).json({
          message: "Subcategory not found",
        });
      }

      const finalCategoryId = categoryId || quote.categoryId;

      if (subcategory.categoryId.toString() !== finalCategoryId.toString()) {
        return res.status(400).json({
          message: "Subcategory does not belong to this category",
        });
      }

      quote.subcategoryId = subcategoryId;
    }

    if (text !== undefined) {
      if (!text.trim()) {
        return res.status(400).json({
          message: "Quote text cannot be empty",
        });
      }

      quote.text = text.trim();
    }

    if (author !== undefined) {
      quote.author = author.trim() || "Unknown";
    }

    // New image
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      quote.image = result.secure_url;
    }

    await quote.save();

    res.status(200).json({
      message: "Quote updated successfully",
      quote,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Quote already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update quote",
      error: error.message,
    });
  }
};

// ======================================
// Delete Quote
// ======================================

const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid quote ID",
      });
    }

    const quote = await Quote.findByIdAndDelete(id);

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    res.status(200).json({
      message: "Quote deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete quote",
      error: error.message,
    });
  }
};
module.exports = {
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
};
