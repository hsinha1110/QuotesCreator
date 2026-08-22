const Favorite = require("../models/Favorite");
// ===============================
// ADD FAVORITE
// ===============================
const addFavorite = async (req, res) => {
  try {
    const { userId, quoteId } = req.body;

    if (!userId || !quoteId) {
      return res.status(400).json({
        message: "userId and quoteId are required",
      });
    }

    const existingFavorite = await Favorite.findOne({
      userId,
      quoteId,
    });

    if (existingFavorite) {
      return res.status(409).json({
        message: "Quote already added to favorites",
      });
    }

    const favorite = await Favorite.create({
      userId,
      quoteId,
    });

    res.status(201).json({
      message: "Quote added to favorites",
      favorite,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add favorite",
      error: error.message,
    });
  }
};

// ===============================
// GET USER FAVORITES
// ===============================
const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const favorites = await Favorite.find({
      userId,
    })
      .populate("quoteId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: favorites.length,
      favorites,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get favorites",
      error: error.message,
    });
  }
};

// ===============================
// DELETE FAVORITE
// ===============================
const removeFavorite = async (req, res) => {
  try {
    const { userId, quoteId } = req.body;

    if (!userId || !quoteId) {
      return res.status(400).json({
        message: "userId and quoteId are required",
      });
    }

    const favorite = await Favorite.findOneAndDelete({
      userId,
      quoteId,
    });

    if (!favorite) {
      return res.status(404).json({
        message: "Favorite not found",
      });
    }

    res.status(200).json({
      message: "Quote removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove favorite",
      error: error.message,
    });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};
