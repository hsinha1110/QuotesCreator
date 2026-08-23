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
        folder: "QuotesCreator/categories",
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
// CREATE CATEGORY
// ======================================

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    let translations = {};

    if (req.body.translations) {
      try {
        translations =
          typeof req.body.translations === "string"
            ? JSON.parse(req.body.translations)
            : req.body.translations;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid translations JSON",
        });
      }
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const category = await Category.create({
      name: name.trim(),
      image: result.secure_url,
      description: description?.trim() || "",
      translations,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// ======================================
// GET ALL CATEGORIES
// ======================================

const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Category.countDocuments();

    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get categories",
      error: error.message,
    });
  }
};

// ======================================
// GET SINGLE CATEGORY
// ======================================

const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get category",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE CATEGORY
// ======================================
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    let translations;

    if (req.body.translations) {
      try {
        translations =
          typeof req.body.translations === "string"
            ? JSON.parse(req.body.translations)
            : req.body.translations;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid translations JSON",
        });
      }
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Name
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category name cannot be empty",
        });
      }

      const duplicate = await Category.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      category.name = name.trim();
    }

    // Description
    if (description !== undefined) {
      category.description = description.trim();
    }

    // Translations
    if (translations !== undefined) {
      if (typeof translations !== "object" || Array.isArray(translations)) {
        return res.status(400).json({
          success: false,
          message: "Translations must be an object",
        });
      }

      category.translations = translations;
    }

    // Image
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      category.image = result.secure_url;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};
// ======================================
// DELETE CATEGORY
// ======================================

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    res.status(500).json({
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
