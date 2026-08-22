const Quote = require("../models/Quotes");

// ===============================
// GET MY QUOTES
// ===============================
const getMyQuotes = async (req, res) => {
  try {
    const { userId } = req.params;

    const quotes = await Quote.find({
      userId,
      isDraft: false,
    })
      .populate("categoryId")
      .populate("subcategoryId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: quotes.length,
      quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get my quotes",
      error: error.message,
    });
  }
};

// ===============================
// GET MY DRAFTS
// ===============================
const getMyDrafts = async (req, res) => {
  try {
    const { userId } = req.params;

    const drafts = await Quote.find({
      userId,
      isDraft: true,
    })
      .populate("categoryId")
      .populate("subcategoryId")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      total: drafts.length,
      drafts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get drafts",
      error: error.message,
    });
  }
};

// ===============================
// GET CREATED QUOTES
// ===============================
const getCreatedQuotes = async (req, res) => {
  try {
    const { userId } = req.params;

    const quotes = await Quote.find({
      userId,
      source: "user",
      isDraft: false,
    })
      .populate("categoryId")
      .populate("subcategoryId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: quotes.length,
      quotes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get created quotes",
      error: error.message,
    });
  }
};

// ===============================
// DELETE MY QUOTE
// ===============================
const deleteMyQuote = async (req, res) => {
  try {
    const { userId, quoteId } = req.params;

    const quote = await Quote.findOneAndDelete({
      _id: quoteId,
      userId,
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete quote",
      error: error.message,
    });
  }
};
const updateMyQuote = async (req, res) => {
  try {
    const { userId, quoteId } = req.params;

    const { text, author, categoryId, subcategoryId, image, isDraft } =
      req.body || {};

    const quote = await Quote.findOne({
      _id: quoteId,
      userId,
    });

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    if (text !== undefined) quote.text = text;
    if (author !== undefined) quote.author = author;
    if (categoryId !== undefined) quote.categoryId = categoryId;
    if (subcategoryId !== undefined) quote.subcategoryId = subcategoryId;
    if (image !== undefined) quote.image = image;
    if (isDraft !== undefined) quote.isDraft = isDraft;

    await quote.save();

    res.status(200).json({
      success: true,
      message: "Quote updated successfully",
      quote,
    });
  } catch (error) {
    console.error("Update My Quote Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update quote",
      error: error.message,
    });
  }
};
module.exports = {
  getMyQuotes,
  getMyDrafts,
  getCreatedQuotes,
  updateMyQuote,
  deleteMyQuote,
};
