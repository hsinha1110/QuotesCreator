const mongoose = require("mongoose");

const Quote = require("../models/Quote");

// =====================================================
// GET ALL QUOTES
// GET /api/quotes
// =====================================================

const getQuotes = async (req, res) => {
  try {
    const {
      language = "English",
      categoryId,
      subcategoryId,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const filter = {
      isActive: { $ne: false },
    };

    // -----------------------------------------------
    // LANGUAGE
    // -----------------------------------------------

    if (language) {
      filter.language = language;
    }

    // -----------------------------------------------
    // CATEGORY
    // -----------------------------------------------

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      filter.categoryId = categoryId;
    }

    // -----------------------------------------------
    // SUBCATEGORY
    // -----------------------------------------------

    if (subcategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID",
        });
      }

      filter.subcategoryId = subcategoryId;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [quotes, total] = await Promise.all([
      Quote.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Quote.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      quotes,
    });
  } catch (error) {
    console.error("❌ Get Quotes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get quotes",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE QUOTE
// GET /api/quotes/:id
// =====================================================

const getQuote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    const quote = await Quote.findOne({
      _id: id,
      isActive: { $ne: false },
    }).lean();

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    return res.status(200).json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error("❌ Get Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get quote",
      error: error.message,
    });
  }
};

// =====================================================
// GET DAILY QUOTE
// GET /api/quotes/daily?language=English
// =====================================================

const getDailyQuote = async (req, res) => {
  try {
    const language = req.query.language || "English";

    console.log("🔥 GET DAILY QUOTE");
    console.log("Language:", language);

    const filter = {
      language,
      isActive: { $ne: false },
    };

    // -------------------------------------------------
    // First try today's quote
    // -------------------------------------------------

    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    let quote = await Quote.findOne({
      ...filter,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    // -------------------------------------------------
    // If today's quote doesn't exist,
    // return latest quote
    // -------------------------------------------------

    if (!quote) {
      quote = await Quote.findOne(filter).sort({ createdAt: -1 }).lean();
    }

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "No daily quote found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Daily quote fetched successfully",
      quote,
    });
  } catch (error) {
    console.error("❌ Get Daily Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get daily quote",
      error: error.message,
    });
  }
};

// =====================================================
// GET LATEST QUOTES
// GET /api/quotes/latest?language=English&page=1&limit=10
// =====================================================

const getLatestQuotes = async (req, res) => {
  try {
    const {
      language = "English",
      page = 1,
      limit = 10,
      categoryId,
      subcategoryId,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const filter = {
      language,
      isActive: { $ne: false },
    };

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      filter.categoryId = categoryId;
    }

    if (subcategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID",
        });
      }

      filter.subcategoryId = subcategoryId;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [quotes, total] = await Promise.all([
      Quote.find(filter)
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Quote.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Latest quotes fetched successfully",
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      quotes,
    });
  } catch (error) {
    console.error("❌ Get Latest Quotes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get latest quotes",
      error: error.message,
    });
  }
};
// =====================================================
// GET POPULAR QUOTES
// GET /api/quotes/popular?language=English&page=1&limit=10
// =====================================================

const getPopularQuotes = async (req, res) => {
  try {
    const {
      language = "English",
      page = 1,
      limit = 10,
      categoryId,
      subcategoryId,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const filter = {
      language,
      isActive: true,
      isDraft: false,
    };

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      filter.categoryId = categoryId;
    }

    if (subcategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID",
        });
      }

      filter.subcategoryId = subcategoryId;
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [quotes, total] = await Promise.all([
      Quote.find(filter)
        .sort({
          likes: -1,
          views: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Quote.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: "Popular quotes fetched successfully",
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      quotes,
    });
  } catch (error) {
    console.error("❌ Get Popular Quotes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get popular quotes",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE QUOTE
// POST /api/quotes
// =====================================================

const createQuote = async (req, res) => {
  try {
    console.log("🔥 CREATE QUOTE BODY:", req.body);

    const {
      quote,
      text,
      author,
      language = "English",
      categoryId,
      subcategoryId,
      image,
      isActive = true,
    } = req.body || {};

    const quoteText = quote || text;

    if (!quoteText || !String(quoteText).trim()) {
      return res.status(400).json({
        success: false,
        message: "Quote text is required",
      });
    }

    const newQuote = await Quote.create({
      quote: String(quoteText).trim(),
      text: String(quoteText).trim(),
      author: author ? String(author).trim() : "",
      language,
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      image: image || "",
      isActive,
      likes: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Quote created successfully",
      quote: newQuote,
    });
  } catch (error) {
    console.error("❌ Create Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create quote",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE QUOTE
// PUT /api/quotes/:id
// =====================================================

const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    const updateData = { ...req.body };

    // Keep quote/text synchronized
    if (updateData.quote && !updateData.text) {
      updateData.text = updateData.quote;
    }

    if (updateData.text && !updateData.quote) {
      updateData.quote = updateData.text;
    }

    const quote = await Quote.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quote updated successfully",
      quote,
    });
  } catch (error) {
    console.error("❌ Update Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update quote",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE QUOTE
// DELETE /api/quotes/:id
// =====================================================

const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    const quote = await Quote.findByIdAndDelete(id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete quote",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getQuotes,
  getQuote,
  getDailyQuote,
  getLatestQuotes,
  getPopularQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
};
