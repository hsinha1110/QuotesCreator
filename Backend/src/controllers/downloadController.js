const mongoose = require("mongoose");

const Download = require("../models/Download");
const Quote = require("../models/Quotes");

// ======================================
// ADD DOWNLOAD
// ======================================

const addDownload = async (req, res) => {
  try {
    const { userId, quoteId } = req.body;

    if (!userId || !quoteId) {
      return res.status(400).json({
        message: "userId and quoteId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(quoteId)) {
      return res.status(400).json({
        message: "Invalid quote ID",
      });
    }

    // Check quote exists
    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    // Check duplicate
    const existingDownload = await Download.findOne({
      userId,
      quoteId,
    });

    if (existingDownload) {
      return res.status(409).json({
        message: "Quote already downloaded",
        download: existingDownload,
      });
    }

    const download = await Download.create({
      userId,
      quoteId,
    });

    res.status(201).json({
      success: true,
      message: "Quote downloaded successfully",
      download,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Quote already downloaded",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to save download",
      error: error.message,
    });
  }
};

// ======================================
// GET USER DOWNLOADS
// ======================================

const getDownloads = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const total = await Download.countDocuments({
      userId,
    });

    const downloads = await Download.find({
      userId,
    })
      .populate("quoteId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      downloads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get downloads",
      error: error.message,
    });
  }
};

// ======================================
// REMOVE DOWNLOAD
// ======================================

const removeDownload = async (req, res) => {
  try {
    const { userId, quoteId } = req.body;

    if (!userId || !quoteId) {
      return res.status(400).json({
        message: "userId and quoteId are required",
      });
    }

    const download = await Download.findOneAndDelete({
      userId,
      quoteId,
    });

    if (!download) {
      return res.status(404).json({
        message: "Download not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Download removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove download",
      error: error.message,
    });
  }
};

module.exports = {
  addDownload,
  getDownloads,
  removeDownload,
};
