const mongoose = require("mongoose");
const Category = require("../models/Category");
const Quote = require("../models/Quote");

// ======================================================
// ALLOWED LANGUAGES
// ======================================================

const ALLOWED_LANGUAGES = ["English", "Hindi"];

const DEFAULT_LANGUAGE = "Hindi";

// ======================================================
// NORMALIZE LANGUAGE
// ======================================================

const normalizeLanguage = (language) => {
  if (!language) {
    return DEFAULT_LANGUAGE;
  }

  const value = String(language).trim();

  // Case-insensitive support
  const found = ALLOWED_LANGUAGES.find(
    (item) => item.toLowerCase() === value.toLowerCase(),
  );

  return found || DEFAULT_LANGUAGE;
};

// ======================================================
// GET TRANSLATION VALUE
// ======================================================

const getCategoriesWithQuoteCount = async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "quotes",
          localField: "_id",
          foreignField: "categoryId",
          as: "quotes",
        },
      },
      {
        $addFields: {
          quoteCount: { $size: "$quotes" },
        },
      },
      {
        $project: {
          quotes: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Quote Count Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get category quote count",
      error: error.message,
    });
  }
};
const getTranslation = (translations, language) => {
  if (!translations) {
    return "";
  }

  // Mongoose Map
  if (typeof translations.get === "function") {
    return translations.get(language) || "";
  }

  // Normal object
  return translations[language] || "";
};

// ======================================================
// GET LOCALIZED CATEGORY NAME
// ======================================================

const getLocalizedName = (category, language) => {
  const selectedLanguage = normalizeLanguage(language);

  const translatedName = getTranslation(
    category.translations,
    selectedLanguage,
  );

  if (translatedName) {
    return translatedName;
  }

  // Fallback to canonical name
  return category.name;
};

// ======================================================
// CLEAN TRANSLATIONS
// ONLY ENGLISH + HINDI
// ======================================================

const cleanTranslations = (translations) => {
  if (!translations) {
    return {};
  }

  let parsedTranslations;

  try {
    parsedTranslations =
      typeof translations === "string"
        ? JSON.parse(translations)
        : translations;
  } catch (error) {
    throw new Error("Invalid translations JSON");
  }

  if (
    typeof parsedTranslations !== "object" ||
    Array.isArray(parsedTranslations) ||
    parsedTranslations === null
  ) {
    throw new Error("Translations must be an object");
  }

  const cleaned = {};

  // ------------------------------------------
  // English
  // ------------------------------------------

  if (
    parsedTranslations.English !== undefined &&
    parsedTranslations.English !== null &&
    String(parsedTranslations.English).trim() !== ""
  ) {
    cleaned.English = String(parsedTranslations.English).trim();
  }

  // ------------------------------------------
  // Hindi
  // ------------------------------------------

  if (
    parsedTranslations.Hindi !== undefined &&
    parsedTranslations.Hindi !== null &&
    String(parsedTranslations.Hindi).trim() !== ""
  ) {
    cleaned.Hindi = String(parsedTranslations.Hindi).trim();
  }

  return cleaned;
};

// ======================================================
// CREATE CATEGORY
// POST /api/categories
// ======================================================

const createCategory = async (req, res) => {
  try {
    const { name, translations } = req.body;

    // ------------------------------------------
    // Validate name
    // ------------------------------------------

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const categoryName = String(name).trim();

    // ------------------------------------------
    // Clean translations
    // ------------------------------------------

    let parsedTranslations;

    try {
      parsedTranslations = cleanTranslations(translations);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // ------------------------------------------
    // English translation fallback
    // ------------------------------------------

    if (!parsedTranslations.English) {
      parsedTranslations.English = categoryName;
    }

    // ------------------------------------------
    // Hindi fallback
    //
    // If Hindi is not supplied, keep English
    // as fallback rather than storing undefined.
    // ------------------------------------------

    if (!parsedTranslations.Hindi) {
      parsedTranslations.Hindi = categoryName;
    }

    // ------------------------------------------
    // Duplicate check
    // ------------------------------------------

    const existing = await Category.findOne({
      name: {
        $regex: `^${escapeRegex(categoryName)}$`,
        $options: "i",
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    // ------------------------------------------
    // Create
    // ------------------------------------------

    const category = await Category.create({
      name: categoryName,

      image: null,

      translations: parsedTranslations,
    });

    return res.status(201).json({
      success: true,

      message: "Category created successfully",

      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to create category",

      error: error.message,
    });
  }
};

// ======================================================
// GET ALL CATEGORIES
//
// GET /api/categories
// GET /api/categories?page=1&limit=10
// GET /api/categories?page=1&limit=10&language=Hindi
// GET /api/categories?page=1&limit=10&language=English
// ======================================================
// ==========================================
// GET SINGLE CATEGORY
// ==========================================

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { language = "English" } = req.query;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // Find category
    const category = await Category.findById(id).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ==========================================
    // QUOTE COUNT
    // ==========================================

    const quoteCount = await Quote.countDocuments({
      categoryId: category._id,
      isActive: true,
      isDraft: false,
    });

    // ==========================================
    // DISPLAY NAME
    // ==========================================

    const languageKey = language === "Hindi" ? "Hindi" : "English";

    const translations = category.translations || {};

    const displayName =
      translations[languageKey] || translations.English || category.name;

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      category: {
        _id: category._id,

        name: category.name,

        displayName,

        displayLanguage: language,

        image: category.image || null,

        translations,

        quoteCount,

        createdAt: category.createdAt,

        updatedAt: category.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get category",
      error: error.message,
    });
  }
};
const getCategories = async (req, res) => {
  try {
    let { page = 1, limit = 10, language = "English" } = req.query;

    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);

    const skip = (page - 1) * limit;

    const total = await Category.countDocuments();

    const categories = await Category.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const categoryIds = categories.map((category) => category._id);

    // ==========================================
    // GET QUOTE COUNTS
    // ==========================================

    const quoteCounts = await Quote.aggregate([
      {
        $match: {
          categoryId: {
            $in: categoryIds,
          },
          isActive: true,
          isDraft: false,
        },
      },

      {
        $group: {
          _id: "$categoryId",
          quoteCount: {
            $sum: 1,
          },
        },
      },
    ]);

    // ==========================================
    // MAP COUNTS
    // ==========================================

    const countMap = new Map();

    quoteCounts.forEach((item) => {
      countMap.set(String(item._id), item.quoteCount);
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    const formattedCategories = categories.map((category) => {
      const languageKey = language === "Hindi" ? "Hindi" : "English";

      const displayName =
        category.translations?.[languageKey] ||
        category.translations?.English ||
        category.name;

      return {
        _id: category._id,

        name: category.name,

        displayName,

        displayLanguage: language,

        image: category.image || null,

        translations: category.translations || {},

        quoteCount: countMap.get(String(category._id)) || 0,

        createdAt: category.createdAt,

        updatedAt: category.updatedAt,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,

      page,

      limit,

      total,

      totalPages,

      hasNextPage: page < totalPages,

      hasPreviousPage: page > 1,

      language,

      categories: formattedCategories,
    });
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE CATEGORY
//
// PUT /api/categories/:id
// ======================================================

const updateCategory = async (req, res) => {
  try {
    const { name, translations } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,

        message: "Category not found",
      });
    }

    // ------------------------------------------
    // Update name
    // ------------------------------------------

    if (name !== undefined) {
      const categoryName = String(name).trim();

      if (!categoryName) {
        return res.status(400).json({
          success: false,

          message: "Category name cannot be empty",
        });
      }

      // Check duplicate
      const duplicate = await Category.findOne({
        name: {
          $regex: `^${escapeRegex(categoryName)}$`,
          $options: "i",
        },

        _id: {
          $ne: req.params.id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,

          message: "Category already exists",
        });
      }

      category.name = categoryName;
    }

    // ------------------------------------------
    // Update translations
    // ------------------------------------------

    if (translations !== undefined) {
      let parsedTranslations;

      try {
        parsedTranslations = cleanTranslations(translations);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      // English fallback
      if (!parsedTranslations.English) {
        parsedTranslations.English = category.name;
      }

      // Hindi fallback
      if (!parsedTranslations.Hindi) {
        parsedTranslations.Hindi = category.name;
      }

      category.translations = parsedTranslations;
    }

    // ------------------------------------------
    // If translations were not sent,
    // make sure both languages exist.
    // ------------------------------------------

    if (translations === undefined) {
      const currentEnglish = getTranslation(category.translations, "English");

      const currentHindi = getTranslation(category.translations, "Hindi");

      const updatedTranslations = {};

      updatedTranslations.English = currentEnglish || category.name;

      updatedTranslations.Hindi = currentHindi || category.name;

      category.translations = updatedTranslations;
    }

    // ------------------------------------------
    // Save
    // ------------------------------------------

    await category.save();

    return res.status(200).json({
      success: true,

      message: "Category updated successfully",

      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to update category",

      error: error.message,
    });
  }
};

// ======================================================
// DELETE CATEGORY
//
// DELETE /api/categories/:id
// ======================================================

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,

        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to delete category",

      error: error.message,
    });
  }
};

// ======================================================
// ESCAPE REGEX
// ======================================================

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createCategory,
  getCategory,
  getCategoriesWithQuoteCount,
  getCategories,
  updateCategory,
  deleteCategory,
};
