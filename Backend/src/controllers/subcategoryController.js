const mongoose = require("mongoose");

const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Quote = require("../models/Quote");

// ==========================================
// CREATE SUBCATEGORY
// ==========================================

const createSubcategory = async (req, res) => {
  try {
    const body = req.body || {};

    const { categoryId, name, description, translations } = body;

    // -------------------------------
    // categoryId
    // -------------------------------

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "categoryId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid categoryId",
      });
    }

    // -------------------------------
    // name
    // -------------------------------

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Subcategory name is required",
      });
    }

    // -------------------------------
    // category check
    // -------------------------------

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // -------------------------------
    // translations
    // -------------------------------

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

    if (
      typeof parsedTranslations !== "object" ||
      Array.isArray(parsedTranslations)
    ) {
      return res.status(400).json({
        success: false,
        message: "Translations must be an object",
      });
    }

    // -------------------------------
    // duplicate
    // -------------------------------

    const existing = await Subcategory.findOne({
      categoryId,
      name: String(name).trim(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Subcategory already exists in this category",
      });
    }

    // -------------------------------
    // create
    // -------------------------------

    const subcategory = await Subcategory.create({
      categoryId,
      name: String(name).trim(),
      description: description ? String(description).trim() : "",
      translations: parsedTranslations,
    });

    return res.status(201).json({
      success: true,
      message: "Subcategory created successfully",
      subcategory,
    });
  } catch (error) {
    console.error("Create Subcategory Error:", error);

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

// ==========================================
// GET ALL SUBCATEGORIES
// ==========================================

const getSubcategories = async (req, res) => {
  try {
    const { categoryId, language = "Hindi" } = req.query;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const skip = (page - 1) * limit;

    const filter = {};

    // --------------------------------
    // CATEGORY FILTER
    // --------------------------------

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

      filter.categoryId = categoryId;
    }

    // --------------------------------
    // TOTAL
    // --------------------------------

    const total = await Subcategory.countDocuments(filter);

    // --------------------------------
    // DATA
    // --------------------------------

    const subcategories = await Subcategory.find(filter)
      .populate("categoryId", "name translations")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // --------------------------------
    // LANGUAGE
    // --------------------------------

    const result = subcategories.map((item) => ({
      ...item,

      displayName: item.translations?.[language] || item.name,

      displayLanguage: language,
    }));

    return res.status(200).json({
      success: true,

      categoryId: categoryId || null,

      language,

      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),

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

// ==========================================
// GET SUBCATEGORIES BY CATEGORY
// ==========================================

const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const language = req.query.language || "Hindi";

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const skip = (page - 1) * limit;

    // ======================================
    // CATEGORY ID CHECK
    // ======================================

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid categoryId",
      });
    }

    // ======================================
    // CATEGORY CHECK
    // ======================================

    const category = await Category.findById(categoryId).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ======================================
    // ONLY THIS CATEGORY
    // ======================================

    const filter = {
      categoryId,
    };

    const total = await Subcategory.countDocuments(filter);

    const subcategories = await Subcategory.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // ======================================
    // ADD QUOTES TO EACH SUBCATEGORY
    // ======================================

    const result = await Promise.all(
      subcategories.map(async (subcategory) => {
        // IMPORTANT:
        // categoryId + subcategoryId
        // dono match hone chahiye

        const quotes = await Quote.find({
          categoryId: categoryId,
          subcategoryId: subcategory._id,
          isDraft: false,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

        // =================================
        // LANGUAGE
        // =================================

        const formattedQuotes = quotes.map((quote) => ({
          _id: quote._id,

          qu_text: quote.text,

          author: quote.author,

          language: quote.language,

          displayText:
            language === "English"
              ? quote.translations?.English || quote.text
              : quote.text,

          translations: quote.translations,
        }));

        return {
          ...subcategory,

          displayName: subcategory.translations?.[language] || subcategory.name,

          displayLanguage: language,

          quotes: formattedQuotes,
        };
      }),
    );

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,

      categoryId,

      language,

      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),

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

// ==========================================
// GET SINGLE SUBCATEGORY
// ==========================================

const getSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const language = req.query.language || "Hindi";

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    const subcategory = await Subcategory.findById(id)
      .populate("categoryId", "name translations")
      .lean();

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    return res.status(200).json({
      success: true,

      language,

      subcategory: {
        ...subcategory,

        displayName: subcategory.translations?.[language] || subcategory.name,
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

// ==========================================
// UPDATE SUBCATEGORY
// ==========================================

const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const body = req.body || {};

    const { categoryId, name, description, translations } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    // --------------------------------
    // CATEGORY
    // --------------------------------

    if (categoryId !== undefined) {
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

      subcategory.categoryId = categoryId;
    }

    // --------------------------------
    // NAME
    // --------------------------------

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

    // --------------------------------
    // DESCRIPTION
    // --------------------------------

    if (description !== undefined) {
      subcategory.description = String(description).trim();
    }

    // --------------------------------
    // TRANSLATIONS
    // --------------------------------

    if (translations !== undefined) {
      let parsedTranslations;

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

      if (
        typeof parsedTranslations !== "object" ||
        Array.isArray(parsedTranslations)
      ) {
        return res.status(400).json({
          success: false,
          message: "Translations must be an object",
        });
      }

      subcategory.translations = parsedTranslations;
    }

    await subcategory.save();

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

// ==========================================
// DELETE SUBCATEGORY
// ==========================================

const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

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

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
