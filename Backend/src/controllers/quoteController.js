const mongoose = require("mongoose");

const Quote = require("../models/Quote");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");

// ==========================================
// CREATE QUOTE
// ==========================================

const createQuote = async (req, res) => {
  try {
    const body = req.body || {};

    const { categoryId, subcategoryId, text, author, language, translations } =
      body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Quote text is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid categoryId",
      });
    }

    // ======================================
    // CATEGORY CHECK
    // ======================================

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ======================================
    // SUBCATEGORY CHECK
    // ======================================

    if (subcategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategoryId",
        });
      }

      const subcategory = await Subcategory.findById(subcategoryId);

      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found",
        });
      }

      // VERY IMPORTANT
      // Subcategory must belong
      // to selected category.

      if (String(subcategory.categoryId) !== String(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Subcategory does not belong to selected category",
        });
      }
    }

    // ======================================
    // TRANSLATIONS
    // ======================================

    let parsedTranslations = {};

    if (translations) {
      try {
        parsedTranslations =
          typeof translations === "string"
            ? JSON.parse(translations)
            : translations;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid translations JSON",
        });
      }
    }

    // ======================================
    // CREATE
    // ======================================

    const quote = await Quote.create({
      categoryId,

      subcategoryId: subcategoryId || null,

      text: text.trim(),

      author: author?.trim() || "Unknown",

      image: null,

      language: language || "Hindi",

      translations: parsedTranslations,

      views: 0,

      isDraft: false,

      source: "admin",
    });

    return res.status(201).json({
      success: true,

      message: "Quote created successfully",

      quote,
    });
  } catch (error) {
    console.error("Create Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create quote",
      error: error.message,
    });
  }
};

// ==========================================
// GET QUOTES
// ==========================================

const getQuotes = async (req, res) => {
  try {
    const { categoryId, subcategoryId, language = "Hindi" } = req.query;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const skip = (page - 1) * limit;

    // ======================================
    // CATEGORY
    // ======================================

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid categoryId",
        });
      }

      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    // ======================================
    // SUBCATEGORY
    // ======================================

    if (subcategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategoryId",
        });
      }

      const subcategory = await Subcategory.findById(subcategoryId);

      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found",
        });
      }

      // ====================================
      // CATEGORY + SUBCATEGORY MUST MATCH
      // ====================================

      if (categoryId && String(subcategory.categoryId) !== String(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Subcategory does not belong to selected category",
        });
      }
    }

    // ======================================
    // FILTER
    // ======================================

    const filter = {
      isDraft: false,
    };

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (subcategoryId) {
      filter.subcategoryId = subcategoryId;
    }

    // ======================================
    // TOTAL
    // ======================================

    const total = await Quote.countDocuments(filter);

    // ======================================
    // DATA
    // ======================================

    const quotes = await Quote.find(filter)
      .populate("categoryId", "name translations")
      .populate("subcategoryId", "name translations")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // ======================================
    // LANGUAGE
    // ======================================

    const result = quotes.map((quote) => {
      let displayText = quote.text;

      if (language === "English") {
        displayText = quote.translations?.English || quote.text;
      }

      return {
        ...quote,

        text: displayText,

        displayLanguage: language,
      };
    });

    return res.status(200).json({
      success: true,

      categoryId: categoryId || null,

      subcategoryId: subcategoryId || null,

      language,

      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),

      quotes: result,
    });
  } catch (error) {
    console.error("Get Quotes Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get quotes",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE QUOTE
// ==========================================

const getQuote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    const quote = await Quote.findById(id)
      .populate("categoryId")
      .populate("subcategoryId")
      .lean();

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
    console.error("Get Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get quote",
      error: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createQuote,
  getQuotes,
  getQuote,
};
