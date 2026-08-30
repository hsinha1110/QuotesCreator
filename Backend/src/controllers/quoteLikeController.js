const Quote = require("../models/Quote");
const QuoteLike = require("../models/QuoteLike");

// =====================================================
// LIKE
// =====================================================

const likeQuote = async (req, res) => {
  try {
    const { id } = req.params;

    // JWT payload has `userId`
    const userId = req.user?.userId;

    console.log("LIKE QUOTE USER:", req.user);
    console.log("LIKE QUOTE USER ID:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    const existingLike = await QuoteLike.findOne({
      quoteId: id,
      userId,
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: "Quote already liked",
        likes: quote.likes || 0,
        isLiked: true,
      });
    }

    await QuoteLike.create({
      quoteId: id,
      userId,
    });

    quote.likes = (quote.likes || 0) + 1;

    await quote.save();

    return res.status(200).json({
      success: true,
      message: "Quote liked successfully",
      likes: quote.likes,
      isLiked: true,
    });
  } catch (error) {
    console.error("LIKE QUOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to like quote",
    });
  }
};

// =====================================================
// UNLIKE
// =====================================================

const unlikeQuote = async (req, res) => {
  try {
    const { id } = req.params;

    // JWT payload has `userId`
    const userId = req.user?.userId;

    console.log("UNLIKE QUOTE USER:", req.user);
    console.log("UNLIKE QUOTE USER ID:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in token",
      });
    }

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    const existingLike = await QuoteLike.findOne({
      quoteId: id,
      userId,
    });

    if (!existingLike) {
      return res.status(400).json({
        success: false,
        message: "Quote is not liked",
        likes: quote.likes || 0,
        isLiked: false,
      });
    }

    await QuoteLike.deleteOne({
      _id: existingLike._id,
    });

    quote.likes = Math.max((quote.likes || 0) - 1, 0);

    await quote.save();

    return res.status(200).json({
      success: true,
      message: "Quote unliked successfully",
      likes: quote.likes,
      isLiked: false,
    });
  } catch (error) {
    console.error("UNLIKE QUOTE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unlike quote",
    });
  }
};

module.exports = {
  likeQuote,
  unlikeQuote,
};
