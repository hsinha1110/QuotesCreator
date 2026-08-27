const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const quoteRoutes = require("./routes/quotesRoutes");
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
const myQuotesRoutes = require("./routes/myQuotesRoutes");
const stickerRoutes = require("./routes/stickerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bulkQuoteRoutes = require("./src/routes/bulkQuoteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Quotes API is running",
  });
});

// ===============================
// AUTH
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/admin", bulkQuoteRoutes);
// ===============================
// CATEGORIES
// ===============================
app.use("/api/categories", categoryRoutes);

// ===============================
// SUBCATEGORIES
// ===============================
app.use("/api/subcategories", subcategoryRoutes);

// ===============================
// QUOTES
// ===============================
app.use("/api/quotes", quoteRoutes);

// ===============================
// FAVORITES
// ===============================
app.use("/api/favorites", favoriteRoutes);

// ===============================
// COLLECTIONS
// ===============================
app.use("/api/collections", collectionRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

// My Quotes
app.use("/api/my-quotes", myQuotesRoutes);
app.use("/api/stickers", stickerRoutes);
app.use("/api/notifications", notificationRoutes);
module.exports = app;
