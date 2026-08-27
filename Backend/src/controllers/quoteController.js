const mongoose = require("mongoose");

const Quote = require("../models/Quote");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");

// ==========================================
// ALLOWED LANGUAGES
// ==========================================

const ALLOWED_LANGUAGES = ["English", "Hindi"];

const DEFAULT_LANGUAGE = "Hindi";

// ==========================================
// NORMALIZE LANGUAGE
// ==========================================

const normalizeLanguage = (language) => {
  if (!language) {
    return DEFAULT_LANGUAGE;
  }

  const selectedLanguage = String(language).trim();

  if (ALLOWED_LANGUAGES.includes(selectedLanguage)) {
    return selectedLanguage;
  }

  return DEFAULT_LANGUAGE;
};

// ==========================================
// PARSE TRANSLATIONS
// ONLY ENGLISH + HINDI
// ==========================================

const parseTranslations = (translations) => {
  if (!translations) {
    return {};
  }

  let parsed;

  try {
    parsed =
      typeof translations === "string"
        ? JSON.parse(translations)
        : translations;
  } catch (error) {
    throw new Error("Invalid translations JSON");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Translations must be an object");
  }

  return {
    English:
      parsed.English !== undefined && parsed.English !== null
        ? String(parsed.English).trim()
        : "",

    Hindi:
      parsed.Hindi !== undefined && parsed.Hindi !== null
        ? String(parsed.Hindi).trim()
        : "",
  };
};

// ==========================================
// GET LOCALIZED TEXT
// ==========================================

const getLocalizedText = (quote, language) => {
  const selectedLanguage = normalizeLanguage(language);

  return quote.translations?.[selectedLanguage] || quote.text || "";
};

// ==========================================
// VALIDATE CATEGORY + SUBCATEGORY
// ==========================================

const validateCategoryAndSubcategory = async (categoryId, subcategoryId) => {
  // ========================================
  // CATEGORY
  // ========================================

  if (!categoryId) {
    throw new Error("categoryId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid categoryId");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  // ========================================
  // SUBCATEGORY
  // ========================================

  let subcategory = null;

  if (subcategoryId) {
    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
      throw new Error("Invalid subcategoryId");
    }

    subcategory = await Subcategory.findById(subcategoryId);

    if (!subcategory) {
      throw new Error("Subcategory not found");
    }

    // ======================================
    // VERY IMPORTANT
    // SUBCATEGORY MUST BELONG TO CATEGORY
    // ======================================

    if (String(subcategory.categoryId) !== String(categoryId)) {
      throw new Error("Subcategory does not belong to selected category");
    }
  }

  return {
    category,
    subcategory,
  };
};

// ==========================================
// CREATE QUOTE
// ==========================================

const createQuote = async (req, res) => {
  try {
    const body = req.body || {};

    const { categoryId, subcategoryId, text, author, language, translations } =
      body;

    // ========================================
    // TEXT VALIDATION
    // ========================================

    if (!text || !String(text).trim()) {
      return res.status(400).json({
        success: false,
        message: "Quote text is required",
      });
    }

    // ========================================
    // LANGUAGE
    // ========================================

    const finalLanguage = normalizeLanguage(language);

    // ========================================
    // CATEGORY + SUBCATEGORY
    // ========================================

    let relation;

    try {
      relation = await validateCategoryAndSubcategory(
        categoryId,
        subcategoryId,
      );
    } catch (error) {
      const message = error.message;

      if (message === "Category not found") {
        return res.status(404).json({
          success: false,
          message,
        });
      }

      if (message === "Subcategory not found") {
        return res.status(404).json({
          success: false,
          message,
        });
      }

      return res.status(400).json({
        success: false,
        message,
      });
    }

    // ========================================
    // TRANSLATIONS
    // ========================================

    let parsedTranslations = {};

    try {
      parsedTranslations = parseTranslations(translations);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // ========================================
    // ADD CURRENT TEXT TO CORRESPONDING
    // LANGUAGE IF MISSING
    // ========================================

    const cleanText = String(text).trim();

    if (!parsedTranslations[finalLanguage]) {
      parsedTranslations[finalLanguage] = cleanText;
    }

    // ========================================
    // ENGLISH FALLBACK
    // ========================================

    if (!parsedTranslations.English) {
      parsedTranslations.English = finalLanguage === "English" ? cleanText : "";
    }

    // ========================================
    // HINDI FALLBACK
    // ========================================

    if (!parsedTranslations.Hindi) {
      parsedTranslations.Hindi = finalLanguage === "Hindi" ? cleanText : "";
    }

    // ========================================
    // CREATE
    // ========================================

    const quote = await Quote.create({
      categoryId: relation.category._id,

      subcategoryId: relation.subcategory?._id || null,

      text: cleanText,

      author:
        author && String(author).trim() ? String(author).trim() : "Unknown",

      image: null,

      language: finalLanguage,

      translations: parsedTranslations,

      views: 0,

      isDraft: false,

      source: "admin",
    });

    // ========================================
    // RESPONSE
    // ========================================

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
    const { categoryId, subcategoryId } = req.query;

    const language = normalizeLanguage(req.query.language);

    // ========================================
    // PAGINATION
    // ========================================

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const skip = (page - 1) * limit;

    // ========================================
    // CATEGORY CHECK
    // ========================================

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

    // ========================================
    // SUBCATEGORY CHECK
    // ========================================

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

      // ======================================
      // IF BOTH PROVIDED
      // CHECK RELATION
      // ======================================

      if (categoryId && String(subcategory.categoryId) !== String(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Subcategory does not belong to selected category",
        });
      }
    }

    // ========================================
    // FILTER
    // ========================================

    const filter = {
      isDraft: false,
    };

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    if (subcategoryId) {
      filter.subcategoryId = subcategoryId;
    }

    // ========================================
    // TOTAL
    // ========================================

    const total = await Quote.countDocuments(filter);

    // ========================================
    // GET QUOTES
    // ========================================

    const quotes = await Quote.find(filter)
      .populate("categoryId", "name translations")
      .populate("subcategoryId", "name translations")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // ========================================
    // LOCALIZED RESPONSE
    // ========================================

    const result = quotes.map((quote) => {
      const displayText = getLocalizedText(quote, language);

      return {
        ...quote,

        // Selected language quote
        text: displayText,

        displayText,

        displayLanguage: language,

        // Only English + Hindi
        translations: {
          English: quote.translations?.English || null,

          Hindi: quote.translations?.Hindi || null,
        },
      };
    });

    // ========================================
    // RESPONSE
    // ========================================

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

    const language = normalizeLanguage(req.query.language);

    // ========================================
    // ID CHECK
    // ========================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    // ========================================
    // GET QUOTE
    // ========================================

    const quote = await Quote.findById(id)
      .populate("categoryId", "name translations")
      .populate("subcategoryId", "name translations")
      .lean();

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // ========================================
    // LOCALIZED TEXT
    // ========================================

    const displayText = getLocalizedText(quote, language);

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      language,

      quote: {
        ...quote,

        text: displayText,

        displayText,

        displayLanguage: language,

        translations: {
          English: quote.translations?.English || null,

          Hindi: quote.translations?.Hindi || null,
        },
      },
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
// UPDATE QUOTE
// ==========================================

const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;

    // ========================================
    // ID CHECK
    // ========================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    // ========================================
    // FIND QUOTE
    // ========================================

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    const body = req.body || {};

    const {
      categoryId,
      subcategoryId,
      text,
      author,
      language,
      translations,
      isDraft,
      source,
    } = body;

    // ========================================
    // CATEGORY
    // ========================================

    if (categoryId !== undefined) {
      if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
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

      quote.categoryId = categoryId;
    }

    // ========================================
    // SUBCATEGORY
    // ========================================

    if (subcategoryId !== undefined) {
      if (subcategoryId === null || subcategoryId === "") {
        quote.subcategoryId = null;
      } else {
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

        const selectedCategoryId =
          categoryId !== undefined ? categoryId : quote.categoryId;

        if (
          selectedCategoryId &&
          String(subcategory.categoryId) !== String(selectedCategoryId)
        ) {
          return res.status(400).json({
            success: false,
            message: "Subcategory does not belong to selected category",
          });
        }

        quote.subcategoryId = subcategoryId;
      }
    }

    // ========================================
    // TEXT
    // ========================================

    if (text !== undefined) {
      if (typeof text !== "string" || !text.trim()) {
        return res.status(400).json({
          success: false,
          message: "Quote text is required",
        });
      }

      quote.text = text.trim();
    }

    // ========================================
    // AUTHOR
    // ========================================

    if (author !== undefined) {
      quote.author = String(author).trim() || "Unknown";
    }

    // ========================================
    // LANGUAGE
    // ========================================

    if (language !== undefined) {
      if (!ALLOWED_LANGUAGES.includes(language)) {
        return res.status(400).json({
          success: false,
          message: "Language must be English or Hindi",
        });
      }

      quote.language = language;
    }

    // ========================================
    // TRANSLATIONS
    // ========================================

    if (translations !== undefined) {
      let parsedTranslations;

      try {
        parsedTranslations = parseTranslations(translations);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      // ======================================
      // CURRENT LANGUAGE
      // ======================================

      const currentLanguage = quote.language || DEFAULT_LANGUAGE;

      // If current language translation missing
      if (!parsedTranslations[currentLanguage] && quote.text) {
        parsedTranslations[currentLanguage] = quote.text;
      }

      quote.translations = parsedTranslations;
    }

    // ========================================
    // DRAFT
    // ========================================

    if (isDraft !== undefined) {
      quote.isDraft = isDraft === true || isDraft === "true";
    }

    // ========================================
    // SOURCE
    // ========================================

    if (source !== undefined) {
      const allowedSources = ["admin", "user", "ai"];

      if (!allowedSources.includes(source)) {
        return res.status(400).json({
          success: false,
          message: "Source must be admin, user or ai",
        });
      }

      quote.source = source;
    }

    // ========================================
    // SAVE
    // ========================================

    await quote.save();

    // ========================================
    // UPDATED QUOTE
    // ========================================

    const updatedQuote = await Quote.findById(quote._id)
      .populate("categoryId", "name translations")
      .populate("subcategoryId", "name translations")
      .lean();

    const displayLanguage = normalizeLanguage(
      req.query.language || quote.language,
    );

    const displayText = getLocalizedText(updatedQuote, displayLanguage);

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      message: "Quote updated successfully",

      quote: {
        ...updatedQuote,

        text: displayText,

        displayText,

        displayLanguage,

        translations: {
          English: updatedQuote.translations?.English || null,

          Hindi: updatedQuote.translations?.Hindi || null,
        },
      },
    });
  } catch (error) {
    console.error("Update Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update quote",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE QUOTE
// ==========================================

const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;

    // ========================================
    // ID CHECK
    // ========================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    // ========================================
    // FIND
    // ========================================

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // ========================================
    // DELETE
    // ========================================

    await Quote.findByIdAndDelete(id);

    // ========================================
    // RESPONSE
    // ========================================

    return res.status(200).json({
      success: true,

      message: "Quote deleted successfully",

      quoteId: id,
    });
  } catch (error) {
    console.error("Delete Quote Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete quote",
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
  updateQuote,
  deleteQuote,
};
