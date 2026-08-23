const mongoose = require("mongoose");

const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

// ======================================
// ALLOWED LANGUAGES
// ======================================

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

// ======================================
// CLOUDINARY UPLOAD
// ======================================

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "QuotesCreator/subcategories",
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
// PARSE TRANSLATIONS
// ======================================

const parseTranslations = (translations) => {
  if (
    translations === undefined ||
    translations === null ||
    translations === ""
  ) {
    return {};
  }

  // Already object
  if (typeof translations === "object") {
    if (Array.isArray(translations)) {
      throw new Error("Translations must be an object");
    }

    return translations;
  }

  // String from multipart/form-data
  if (typeof translations === "string") {
    let parsed = translations.trim();

    try {
      // First parse
      parsed = JSON.parse(parsed);

      // If it was double encoded, parse again
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        throw new Error();
      }

      return parsed;
    } catch (error) {
      console.log("RAW TRANSLATIONS:", JSON.stringify(translations));

      throw new Error("Invalid translations JSON");
    }
  }

  throw new Error("Translations must be an object");
};

// ======================================
// VALIDATE TRANSLATIONS
// ======================================

const validateTranslations = (translations) => {
  if (translations === undefined || translations === null) {
    return null;
  }

  if (typeof translations !== "object" || Array.isArray(translations)) {
    return "Translations must be an object";
  }

  for (const language of Object.keys(translations)) {
    // Check allowed language
    if (!allowedLanguages.includes(language)) {
      return `Invalid language: ${language}`;
    }

    // Check translation value
    if (
      typeof translations[language] !== "string" ||
      !translations[language].trim()
    ) {
      return `Translation for ${language} cannot be empty`;
    }
  }

  return null;
};

// ======================================
// CREATE SUBCATEGORY
// ======================================

const createSubcategory = async (req, res) => {
  try {
    const { categoryId, name, description } = req.body || {};

    // ======================================
    // REQUIRED FIELDS
    // ======================================

    if (!categoryId || !name) {
      return res.status(400).json({
        success: false,
        message: "categoryId and name are required",
      });
    }

    if (!name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subcategory name cannot be empty",
      });
    }

    // ======================================
    // VALIDATE CATEGORY ID
    // ======================================

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // ======================================
    // CHECK CATEGORY
    // ======================================

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ======================================
    // CHECK DUPLICATE
    // ======================================

    const existingSubcategory = await Subcategory.findOne({
      categoryId,
      name: name.trim(),
    });

    if (existingSubcategory) {
      return res.status(409).json({
        success: false,
        message: "Subcategory already exists",
      });
    }

    // ======================================
    // IMAGE REQUIRED
    // ======================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Subcategory image is required",
      });
    }

    // ======================================
    // PARSE TRANSLATIONS
    // ======================================

    let translations;

    try {
      translations = parseTranslations(req.body?.translations);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // ======================================
    // VALIDATE TRANSLATIONS
    // ======================================

    const translationError = validateTranslations(translations);

    if (translationError) {
      return res.status(400).json({
        success: false,
        message: translationError,
      });
    }

    // ======================================
    // UPLOAD IMAGE
    // ======================================

    const result = await uploadToCloudinary(req.file.buffer);

    // ======================================
    // CREATE SUBCATEGORY
    // ======================================

    const subcategory = await Subcategory.create({
      categoryId,
      name: name.trim(),
      description: description ? description.trim() : "",
      image: result.secure_url,
      translations,
    });

    // ======================================
    // SUCCESS
    // ======================================

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
        message: "Subcategory already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create subcategory",
      error: error.message,
    });
  }
};

// ======================================
// GET ALL SUBCATEGORIES
// ======================================

const getSubcategories = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const total = await Subcategory.countDocuments();

    const subcategories = await Subcategory.find()
      .populate("categoryId", "name image translations")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      subcategories,
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

// ======================================
// GET SUBCATEGORIES BY CATEGORY
// ======================================

const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { language } = req.query;

    // ======================================
    // VALIDATE CATEGORY ID
    // ======================================

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // ======================================
    // VALIDATE LANGUAGE
    // ======================================

    if (language && !allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    // ======================================
    // PAGINATION
    // ======================================

    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    // ======================================
    // TOTAL
    // ======================================

    const total = await Subcategory.countDocuments({
      categoryId,
    });

    // ======================================
    // GET SUBCATEGORIES
    // ======================================

    const subcategories = await Subcategory.find({
      categoryId,
    })
      .populate("categoryId", "name image translations")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // ======================================
    // ADD DISPLAY NAME
    // ======================================

    const result = subcategories.map((subcategory) => {
      const item = subcategory.toObject();

      let translations = {};

      if (item.translations) {
        if (item.translations instanceof Map) {
          translations = Object.fromEntries(item.translations);
        } else {
          translations = item.translations;
        }
      }

      item.translations = translations;

      if (language && translations[language]) {
        item.displayName = translations[language];
      } else {
        item.displayName = item.name;
      }

      return item;
    });

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      categoryId,
      language: language || null,
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

// ======================================
// GET SINGLE SUBCATEGORY
// ======================================

const getSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { language } = req.query;

    // ======================================
    // VALIDATE ID
    // ======================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    // ======================================
    // VALIDATE LANGUAGE
    // ======================================

    if (language && !allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    // ======================================
    // FIND
    // ======================================

    const subcategory = await Subcategory.findById(id).populate(
      "categoryId",
      "name image translations",
    );

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    // ======================================
    // CONVERT TO OBJECT
    // ======================================

    const result = subcategory.toObject();

    let translations = {};

    if (result.translations) {
      if (result.translations instanceof Map) {
        translations = Object.fromEntries(result.translations);
      } else {
        translations = result.translations;
      }
    }

    result.translations = translations;

    // ======================================
    // DISPLAY NAME
    // ======================================

    if (language && translations[language]) {
      result.displayName = translations[language];
    } else {
      result.displayName = result.name;
    }

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      subcategory: result,
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

// ======================================
// UPDATE SUBCATEGORY
// ======================================

const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description } = req.body || {};

    // ======================================
    // VALIDATE ID
    // ======================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    // ======================================
    // FIND
    // ======================================

    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    // ======================================
    // UPDATE NAME
    // ======================================

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Subcategory name cannot be empty",
        });
      }

      const duplicate = await Subcategory.findOne({
        categoryId: subcategory.categoryId,
        name: name.trim(),
        _id: {
          $ne: subcategory._id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Subcategory already exists",
        });
      }

      subcategory.name = name.trim();
    }

    // ======================================
    // UPDATE DESCRIPTION
    // ======================================

    if (description !== undefined) {
      subcategory.description = description.trim();
    }

    // ======================================
    // UPDATE TRANSLATIONS
    // ======================================

    if (req.body?.translations !== undefined) {
      let translations;

      try {
        translations = parseTranslations(req.body.translations);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      const translationError = validateTranslations(translations);

      if (translationError) {
        return res.status(400).json({
          success: false,
          message: translationError,
        });
      }

      subcategory.translations = translations;
    }

    // ======================================
    // UPDATE IMAGE
    // ======================================

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      subcategory.image = result.secure_url;
    }

    // ======================================
    // SAVE
    // ======================================

    await subcategory.save();

    // ======================================
    // RESPONSE
    // ======================================

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
        message: "Subcategory already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update subcategory",
      error: error.message,
    });
  }
};

// ======================================
// DELETE SUBCATEGORY
// ======================================

const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    // ======================================
    // VALIDATE ID
    // ======================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    // ======================================
    // DELETE
    // ======================================

    const subcategory = await Subcategory.findByIdAndDelete(id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    // ======================================
    // RESPONSE
    // ======================================

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

// ======================================
// EXPORTS
// ======================================

module.exports = {
  createSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
