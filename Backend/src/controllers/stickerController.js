const mongoose = require("mongoose");
const Sticker = require("../models/Sticker");

const allowedTypes = ["popular", "emoji", "shape", "quote"];

// ======================================
// CREATE STICKER
// ======================================

const createSticker = async (req, res) => {
  try {
    const { name, image, type, sortOrder = 0 } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Sticker name is required",
      });
    }

    if (!image || !image.trim()) {
      return res.status(400).json({
        success: false,
        message: "Sticker image is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Sticker type is required",
      });
    }

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sticker type",
        allowedTypes,
      });
    }

    const sticker = await Sticker.create({
      name: name.trim(),
      image: image.trim(),
      type,
      sortOrder: Number(sortOrder) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Sticker created successfully",
      sticker,
    });
  } catch (error) {
    console.error("Create Sticker Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create sticker",
      error: error.message,
    });
  }
};

// ======================================
// GET ALL ACTIVE STICKERS
// ======================================

const getAllStickers = async (req, res) => {
  try {
    const stickers = await Sticker.find({
      isActive: true,
    }).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: stickers.length,
      stickers,
    });
  } catch (error) {
    console.error("Get Stickers Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get stickers",
      error: error.message,
    });
  }
};

// ======================================
// GET STICKERS BY TYPE
// ======================================

const getStickersByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sticker type",
        allowedTypes,
      });
    }

    const stickers = await Sticker.find({
      type,
      isActive: true,
    }).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      type,
      total: stickers.length,
      stickers,
    });
  } catch (error) {
    console.error("Get Stickers By Type Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get stickers",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE STICKER
// ======================================

const updateSticker = async (req, res) => {
  try {
    const { stickerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(stickerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sticker ID",
      });
    }

    const { name, image, type, isActive, sortOrder } = req.body || {};

    const sticker = await Sticker.findById(stickerId);

    if (!sticker) {
      return res.status(404).json({
        success: false,
        message: "Sticker not found",
      });
    }

    // Name
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Sticker name cannot be empty",
        });
      }

      sticker.name = name.trim();
    }

    // Image
    if (image !== undefined) {
      if (!image.trim()) {
        return res.status(400).json({
          success: false,
          message: "Sticker image cannot be empty",
        });
      }

      sticker.image = image.trim();
    }

    // Type
    if (type !== undefined) {
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid sticker type",
          allowedTypes,
        });
      }

      sticker.type = type;
    }

    // Active
    if (isActive !== undefined) {
      sticker.isActive = isActive;
    }

    // Sort order
    if (sortOrder !== undefined) {
      sticker.sortOrder = Number(sortOrder) || 0;
    }

    await sticker.save();

    res.status(200).json({
      success: true,
      message: "Sticker updated successfully",
      sticker,
    });
  } catch (error) {
    console.error("Update Sticker Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update sticker",
      error: error.message,
    });
  }
};

// ======================================
// DELETE STICKER
// ======================================

const deleteSticker = async (req, res) => {
  try {
    const { stickerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(stickerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sticker ID",
      });
    }

    const sticker = await Sticker.findByIdAndDelete(stickerId);

    if (!sticker) {
      return res.status(404).json({
        success: false,
        message: "Sticker not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sticker deleted successfully",
    });
  } catch (error) {
    console.error("Delete Sticker Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete sticker",
      error: error.message,
    });
  }
};

module.exports = {
  createSticker,
  getAllStickers,
  getStickersByType,
  updateSticker,
  deleteSticker,
};
