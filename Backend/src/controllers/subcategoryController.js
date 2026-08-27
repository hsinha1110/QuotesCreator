const mongoose = require("mongoose");

const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Quote = require("../models/Quote");

// ======================================================
// ALLOWED LANGUAGES
// ======================================================

const allowedLanguages = ["English", "Hindi"];

const DEFAULT_LANGUAGE = "Hindi";

// ======================================================
// NORMALIZE LANGUAGE
// ======================================================

const normalizeLanguage = (language) => {
  if (!language) {
    return DEFAULT_LANGUAGE;
  }

  const value = String(language).trim();

  const found = allowedLanguages.find(
    (item) => item.toLowerCase() === value.toLowerCase(),
  );

  return found || DEFAULT_LANGUAGE;
};

// ======================================================
// OBJECT ID VALIDATION
// ======================================================

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// ======================================================
// GET TRANSLATION
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
// GET LOCALIZED NAME
// ======================================================

const getLocalizedName = (item, language) => {
  const selectedLanguage = normalizeLanguage(language);

  const selected = getTranslation(item.translations, selectedLanguage);

  if (selected) {
    return selected;
  }

  const english = getTranslation(item.translations, "English");

  if (english) {
    return english;
  }

  return item.name || "";
};

// ======================================================
// GET LOCALIZED DESCRIPTION
// ======================================================

const getLocalizedDescription = (item, language) => {
  const selectedLanguage = normalizeLanguage(language);

  // ------------------------------------------
  // descriptionTranslations
  // ------------------------------------------

  if (item.descriptionTranslations) {
    const selected = getTranslation(
      item.descriptionTranslations,
      selectedLanguage,
    );

    if (selected) {
      return selected;
    }

    const english = getTranslation(item.descriptionTranslations, "English");

    if (english) {
      return english;
    }
  }

  // ------------------------------------------
  // fallback
  // ------------------------------------------

  return item.description || "";
};

// ======================================================
// PARSE TRANSLATIONS
// ======================================================

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

  if (typeof parsed !== "object" || Array.isArray(parsed) || parsed === null) {
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

// ======================================================
// CREATE SUBCATEGORY
// POST /api/subcategories
// ======================================================

const createSubcategory = async (req, res) => {
  try {
    const body = req.body || {};

    const {
      categoryId,
      name,
      description,
      translations,
      descriptionTranslations,
    } = body;

    // ==================================================
    // CATEGORY ID
    // ==================================================

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      });
    }

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid categoryId",
      });
    }

    // ==================================================
    // NAME
    // ==================================================

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Subcategory name is required",
      });
    }

    const cleanName = String(name).trim();

    // ==================================================
    // CATEGORY CHECK
    // ==================================================

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ==================================================
    // NAME TRANSLATIONS
    // ==================================================

    let parsedTranslations = {};

    try {
      parsedTranslations = parseTranslations(translations);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // English fallback
    if (!parsedTranslations.English) {
      parsedTranslations.English = cleanName;
    }

    // Hindi fallback
    if (!parsedTranslations.Hindi) {
      parsedTranslations.Hindi = cleanName;
    }

    // ==================================================
    // DESCRIPTION
    // ==================================================

    const cleanDescription = description ? String(description).trim() : "";

    // ==================================================
    // DESCRIPTION TRANSLATIONS
    // ==================================================

    let parsedDescriptionTranslations = {};

    if (descriptionTranslations) {
      try {
        parsedDescriptionTranslations = parseTranslations(
          descriptionTranslations,
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid descriptionTranslations JSON",
        });
      }
    }

    // English description fallback
    if (!parsedDescriptionTranslations.English && cleanDescription) {
      parsedDescriptionTranslations.English = cleanDescription;
    }

    // Hindi description fallback
    if (!parsedDescriptionTranslations.Hindi && cleanDescription) {
      parsedDescriptionTranslations.Hindi = cleanDescription;
    }

    // ==================================================
    // DUPLICATE CHECK
    // ==================================================

    const existing = await Subcategory.findOne({
      categoryId,
      name: cleanName,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Subcategory already exists in this category",
      });
    }

    // ==================================================
    // CREATE DATA
    // ==================================================

    const subcategoryData = {
      categoryId,

      name: cleanName,

      description: cleanDescription,

      translations: parsedTranslations,
    };

    // Add description translations.
    // If schema has this field it will be stored.
    subcategoryData.descriptionTranslations = parsedDescriptionTranslations;

    // ==================================================
    // CREATE
    // ==================================================

    const subcategory = await Subcategory.create(subcategoryData);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,

      message: "Subcategory created successfully",

      subcategory,
    });
  } catch (error) {
    console.error("Create Subcategory Error:", error);

    // Mongo duplicate index
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Subcategory already exists in this category",
      });
    }

    return res.status(500).json({
      success: false,

      message: "Failed to create subcategory",

      error: error.message,
    });
  }
};

// ======================================================
// GET ALL SUBCATEGORIES
//
// GET /api/subcategories
//
// Examples:
//
// /api/subcategories?page=1&limit=10&language=Hindi
//
// /api/subcategories?categoryId=ID&page=1&limit=10&language=Hindi
//
// ======================================================

const getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.query;

    // ==================================================
    // LANGUAGE
    // ==================================================

    const language = normalizeLanguage(req.query.language);

    // ==================================================
    // PAGINATION
    // ==================================================

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const skip = (page - 1) * limit;

    // ==================================================
    // FILTER
    // ==================================================

    const filter = {};

    // ==================================================
    // CATEGORY FILTER
    // ==================================================

    if (categoryId) {
      if (!isValidObjectId(categoryId)) {
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

      filter.categoryId = categoryId;
    }

    // ==================================================
    // TOTAL
    // ==================================================

    const total = await Subcategory.countDocuments(filter);

    // ==================================================
    // GET DATA
    // ==================================================

    const subcategories = await Subcategory.find(filter)
      .populate("categoryId", "name translations")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // ==================================================
    // LOCALIZED RESULT
    // ==================================================

    const result = subcategories.map((item) => ({
      ...item,

      displayName: getLocalizedName(item, language),

      displayDescription: getLocalizedDescription(item, language),

      displayLanguage: language,
    }));

    // ==================================================
    // PAGINATION
    // ==================================================

    const totalPages = Math.ceil(total / limit);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      categoryId: categoryId || null,

      language,

      page,

      limit,

      total,

      totalPages,

      hasNextPage: page < totalPages,

      hasPreviousPage: page > 1,

      subcategories: result,
    });
  } catch (error) {
    console.error("Get Subcategories Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to get subcategories",

      error: error.message,
    });
  }
};

// ======================================================
// GET SUBCATEGORIES BY CATEGORY
//
// GET /api/subcategories/category/:categoryId
//
// ======================================================

const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // ==================================================
    // CATEGORY ID
    // ==================================================

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid categoryId",
      });
    }

    // ==================================================
    // LANGUAGE
    // ==================================================

    const language = normalizeLanguage(req.query.language);

    // ==================================================
    // PAGINATION
    // ==================================================

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const skip = (page - 1) * limit;

    // ==================================================
    // CATEGORY CHECK
    // ==================================================

    const category = await Category.findById(categoryId).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ==================================================
    // FILTER
    // ==================================================

    const filter = {
      categoryId,
    };

    // ==================================================
    // TOTAL
    // ==================================================

    const total = await Subcategory.countDocuments(filter);

    // ==================================================
    // SUBCATEGORIES
    // ==================================================

    const subcategories = await Subcategory.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // ==================================================
    // RESULT
    // ==================================================

    const result = await Promise.all(
      subcategories.map(async (subcategory) => {
        // ========================================
        // ONLY THIS CATEGORY + SUBCATEGORY
        // ========================================

        const quotes = await Quote.find({
          categoryId: categoryId,

          subcategoryId: subcategory._id,

          isDraft: false,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

        // ========================================
        // LOCALIZED QUOTES
        // ========================================

        const formattedQuotes = quotes.map((quote) => {
          const translations = quote.translations || {};

          const displayText =
            getTranslation(translations, language) || quote.text || "";

          return {
            _id: quote._id,

            qu_text: quote.text,

            displayText,

            author: quote.author || "Unknown",

            language: language,

            categoryId: quote.categoryId,

            subcategoryId: quote.subcategoryId,

            image: quote.image || null,

            translations: {
              English: getTranslation(translations, "English") || null,

              Hindi: getTranslation(translations, "Hindi") || null,
            },

            views: quote.views || 0,
          };
        });

        // ========================================
        // SUBCATEGORY
        // ========================================

        return {
          ...subcategory,

          displayName: getLocalizedName(subcategory, language),

          displayDescription: getLocalizedDescription(subcategory, language),

          displayLanguage: language,

          quotes: formattedQuotes,
        };
      }),
    );

    // ==================================================
    // PAGINATION
    // ==================================================

    const totalPages = Math.ceil(total / limit);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      categoryId,

      language,

      page,

      limit,

      total,

      totalPages,

      hasNextPage: page < totalPages,

      hasPreviousPage: page > 1,

      subcategories: result,
    });
  } catch (error) {
    console.error("Get Subcategories By Category Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to get subcategories",

      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE SUBCATEGORY
//
// GET /api/subcategories/:id?language=Hindi
//
// ======================================================

const getSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    // ==================================================
    // ID
    // ==================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    // ==================================================
    // LANGUAGE
    // ==================================================

    const language = normalizeLanguage(req.query.language);

    // ==================================================
    // GET
    // ==================================================

    const subcategory = await Subcategory.findById(id)
      .populate("categoryId", "name translations")
      .lean();

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      language,

      subcategory: {
        ...subcategory,

        displayName: getLocalizedName(subcategory, language),

        displayDescription: getLocalizedDescription(subcategory, language),

        displayLanguage: language,
      },
    });
  } catch (error) {
    console.error("Get Subcategory Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to get subcategory",

      error: error.message,
    });
  }
};

// ======================================================
// UPDATE SUBCATEGORY
//
// PUT /api/subcategories/:id
//
// ======================================================

const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const body = req.body || {};

    const {
      categoryId,
      name,
      description,
      translations,
      descriptionTranslations,
    } = body;

    // ==================================================
    // ID CHECK
    // ==================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    // ==================================================
    // GET EXISTING
    // ==================================================

    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    // ==================================================
    // CATEGORY
    // ==================================================

    if (categoryId !== undefined) {
      if (!isValidObjectId(categoryId)) {
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

      subcategory.categoryId = categoryId;
    }

    // ==================================================
    // NAME
    // ==================================================

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message: "Subcategory name cannot be empty",
        });
      }

      const duplicate = await Subcategory.findOne({
        categoryId: subcategory.categoryId,

        name: cleanName,

        _id: {
          $ne: id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Subcategory already exists in this category",
        });
      }

      subcategory.name = cleanName;
    }

    // ==================================================
    // DESCRIPTION
    // ==================================================

    if (description !== undefined) {
      subcategory.description = String(description).trim();
    }

    // ==================================================
    // TRANSLATIONS
    // ==================================================

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

      // English fallback
      if (!parsedTranslations.English) {
        parsedTranslations.English = subcategory.name;
      }

      // Hindi fallback
      if (!parsedTranslations.Hindi) {
        parsedTranslations.Hindi = subcategory.name;
      }

      subcategory.translations = parsedTranslations;
    } else {
      // Make sure both exist
      const currentEnglish = getTranslation(
        subcategory.translations,
        "English",
      );

      const currentHindi = getTranslation(subcategory.translations, "Hindi");

      subcategory.translations = {
        English: currentEnglish || subcategory.name,

        Hindi: currentHindi || subcategory.name,
      };
    }

    // ==================================================
    // DESCRIPTION TRANSLATIONS
    // ==================================================

    if (descriptionTranslations !== undefined) {
      let parsedDescriptionTranslations;

      try {
        parsedDescriptionTranslations = parseTranslations(
          descriptionTranslations,
        );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid descriptionTranslations JSON",
        });
      }

      // Fallback
      if (!parsedDescriptionTranslations.English && subcategory.description) {
        parsedDescriptionTranslations.English = subcategory.description;
      }

      if (!parsedDescriptionTranslations.Hindi && subcategory.description) {
        parsedDescriptionTranslations.Hindi = subcategory.description;
      }

      subcategory.descriptionTranslations = parsedDescriptionTranslations;
    }

    // ==================================================
    // SAVE
    // ==================================================

    await subcategory.save();

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message: "Subcategory updated successfully",

      subcategory,
    });
  } catch (error) {
    console.error("Update Subcategory Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Subcategory already exists in this category",
      });
    }

    return res.status(500).json({
      success: false,

      message: "Failed to update subcategory",

      error: error.message,
    });
  }
};

// ======================================================
// DELETE SUBCATEGORY
//
// DELETE /api/subcategories/:id
//
// ======================================================

const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    // ==================================================
    // ID
    // ==================================================

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    // ==================================================
    // DELETE
    // ==================================================

    const subcategory = await Subcategory.findByIdAndDelete(id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    console.error("Delete Subcategory Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to delete subcategory",

      error: error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createSubcategory,

  getSubcategories,

  getSubcategoriesByCategory,

  getSubcategory,

  updateSubcategory,

  deleteSubcategory,
};
