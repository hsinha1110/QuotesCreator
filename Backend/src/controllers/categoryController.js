const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

// Upload image to Cloudinary
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

// Create Category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Category image is required",
      });
    }

    // Check duplicate category
    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    // Upload image
    const result = await uploadToCloudinary(req.file.buffer);

    // Create category
    const category = await Category.create({
      name: name.trim(),
      image: result.secure_url,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    // MongoDB duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// Get All Categories
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
    res.status(500).json({
      success: false,
      message: "Failed to get categories",
      error: error.message,
    });
  }
};

// Get Single Category
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get category",
      error: error.message,
    });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Check duplicate name
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id },
      });

      if (existingCategory) {
        return res.status(409).json({
          message: "Category already exists",
        });
      }

      category.name = name.trim();
    }

    // Update image if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      category.image = result.secure_url;
    }

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
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
