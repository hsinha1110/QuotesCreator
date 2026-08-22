const mongoose = require("mongoose");
const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

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

// Create Subcategory
const createSubcategory = async (req, res) => {
  try {
    const { categoryId, name } = req.body;

    if (!categoryId || !name) {
      return res.status(400).json({
        message: "categoryId and name are required",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const existingSubcategory = await Subcategory.findOne({
      categoryId,
      name: name.trim(),
    });

    if (existingSubcategory) {
      return res.status(409).json({
        message: "Subcategory already exists",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Subcategory image is required",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const subcategory = await Subcategory.create({
      categoryId,
      name: name.trim(),
      image: result.secure_url,
    });

    res.status(201).json({
      message: "Subcategory created successfully",
      subcategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Subcategory already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create subcategory",
      error: error.message,
    });
  }
};

// Get All Subcategories
const getSubcategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Subcategory.countDocuments();

    const subcategories = await Subcategory.find()
      .populate("categoryId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      subcategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get subcategories",
      error: error.message,
    });
  }
};

// Get Subcategories by Category
const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Subcategory.countDocuments({
      categoryId,
    });

    const subcategories = await Subcategory.find({
      categoryId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      subcategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get subcategories",
      error: error.message,
    });
  }
};
// Get Single Subcategory
const getSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        message: "Subcategory not found",
      });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get subcategory",
      error: error.message,
    });
  }
};

// Update Subcategory
const updateSubcategory = async (req, res) => {
  try {
    const { name } = req.body;

    const subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        message: "Subcategory not found",
      });
    }

    if (name) {
      const duplicate = await Subcategory.findOne({
        categoryId: subcategory.categoryId,
        name: name.trim(),
        _id: { $ne: subcategory._id },
      });

      if (duplicate) {
        return res.status(409).json({
          message: "Subcategory already exists",
        });
      }

      subcategory.name = name.trim();
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      subcategory.image = result.secure_url;
    }

    await subcategory.save();

    res.status(200).json({
      message: "Subcategory updated successfully",
      subcategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update subcategory",
      error: error.message,
    });
  }
};

// Delete Subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        message: "Subcategory not found",
      });
    }

    res.status(200).json({
      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete subcategory",
      error: error.message,
    });
  }
};

module.exports = {
  createSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
