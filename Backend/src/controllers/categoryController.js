const Category = require("../models/Category");

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

const getCategories = async (req, res) => {
  try {
    // ------------------------------------------
    // Pagination
    // ------------------------------------------

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const skip = (page - 1) * limit;

    // ------------------------------------------
    // Language
    // ------------------------------------------

    const language = normalizeLanguage(req.query.language);

    // ------------------------------------------
    // Total
    // ------------------------------------------

    const total = await Category.countDocuments();

    // ------------------------------------------
    // Get paginated categories
    // ------------------------------------------

    const categories = await Category.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // ------------------------------------------
    // Format categories
    // ------------------------------------------

    const formattedCategories = categories.map((category) => {
      const english = getTranslation(category.translations, "English");

      const hindi = getTranslation(category.translations, "Hindi");

      return {
        _id: category._id,

        // Canonical/original name
        name: category.name,

        // Selected language
        displayName: getLocalizedName(category, language),

        displayLanguage: language,

        image: category.image || null,

        translations: {
          English: english || category.name,

          Hindi: hindi || category.name,
        },

        createdAt: category.createdAt,

        updatedAt: category.updatedAt,
      };
    });

    // ------------------------------------------
    // Pagination information
    // ------------------------------------------

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
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to get categories",

      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE CATEGORY
//
// GET /api/categories/:id
// GET /api/categories/:id?language=Hindi
// GET /api/categories/:id?language=English
// ======================================================

const getCategory = async (req, res) => {
  try {
    const language = normalizeLanguage(req.query.language);

    const category = await Category.findById(req.params.id).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const english = getTranslation(category.translations, "English");

    const hindi = getTranslation(category.translations, "Hindi");

    return res.status(200).json({
      success: true,

      category: {
        _id: category._id,

        name: category.name,

        displayName: getLocalizedName(category, language),

        displayLanguage: language,

        image: category.image || null,

        translations: {
          English: english || category.name,

          Hindi: hindi || category.name,
        },

        createdAt: category.createdAt,

        updatedAt: category.updatedAt,
      },
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
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
