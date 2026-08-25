const Category = require("../models/Category");
const Quote = require("../models/Quote");

// ==========================================
// ALLOWED LANGUAGES
// ==========================================

const allowedLanguages = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Portuguese",
  "Italian",
];

// ==========================================
// GET LOCALIZED NAME
// ==========================================

const getLocalizedName = (item, language) => {
  const translations = item.translations || {};

  if (language === "English") {
    return translations.English || item.name;
  }

  if (language === "Hindi") {
    return translations.Hindi || item.name;
  }

  return translations[language] || item.name;
};

// ==========================================
// CREATE
// ==========================================

const createCategory = async (req, res) => {
  try {
    const { name, description, translations } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

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

    const existing = await Category.findOne({
      name: name.trim(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),

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

// ==========================================
// GET ALL
// ==========================================
const getCategories = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const language = req.query.language || "Hindi";

    const skip = (page - 1) * limit;

    // ================================
    // TOTAL CATEGORIES
    // ================================

    const total = await Category.countDocuments();

    // ================================
    // CATEGORIES
    // ================================

    const categories = await Category.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // ================================
    // ADD QUOTES
    // ================================

    const categoriesWithQuotes = await Promise.all(
      categories.map(async (category) => {
        const quotes = await Quote.find({
          categoryId: category._id,
          isDraft: false,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

        const formattedQuotes = quotes.map((quote) => ({
          _id: quote._id,

          // ORIGINAL QUOTE
          qu_text: quote.text,

          author: quote.author,

          language: quote.language,

          // LANGUAGE DISPLAY
          displayText:
            language === "English"
              ? quote.translations?.English || quote.text
              : quote.text,
        }));

        return {
          ...category,

          displayName: category.translations?.[language] || category.name,

          displayLanguage: language,

          quotes: formattedQuotes,
        };
      }),
    );

    // ================================
    // RESPONSE
    // ================================

    return res.status(200).json({
      success: true,

      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),

      language,

      categories: categoriesWithQuotes,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get categories",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE
// ==========================================

const getCategory = async (req, res) => {
  try {
    let language = req.query.language || "Hindi";

    if (!allowedLanguages.includes(language)) {
      language = "Hindi";
    }

    const category = await Category.findById(req.params.id).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.name = getLocalizedName(category, language);

    category.language = language;

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get category",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE
// ==========================================

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

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category name cannot be empty",
        });
      }

      const duplicate = await Category.findOne({
        name: name.trim(),
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

      category.name = name.trim();
    }

    if (translations) {
      let parsed;

      try {
        parsed =
          typeof translations === "string"
            ? JSON.parse(translations)
            : translations;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid translations JSON",
        });
      }

      category.translations = parsed;
    }

    // Image intentionally ignored

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

// ==========================================
// DELETE
// ==========================================

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

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
