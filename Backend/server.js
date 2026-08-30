const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// ======================================
// DATABASE
// ======================================

const connectDB = require("./src/config/db");

// ======================================
// ROUTES
// ======================================

const authRoutes = require("./src/routes/authRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const subcategoryRoutes = require("./src/routes/subcategoryRoutes");
const quotesRoutes = require("./src/routes/quotesRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
const userRoutes = require("./src/routes/userRoutes");
// ======================================
// OPTIONAL STICKER ROUTE
// ======================================

let stickerRoutes = null;

try {
  stickerRoutes = require("./src/routes/stickerRoutes");

  console.log("✅ Sticker routes loaded");
} catch (error) {
  console.log("ℹ️ Sticker routes not found - skipping /api/stickers");
}

// ======================================
// CRON
// ======================================

try {
  require("./src/cron/notificationCron");

  console.log("✅ Notification cron loaded");
} catch (error) {
  console.log("❌ Notification cron failed to load:", error.message);
}

// ======================================
// APP
// ======================================

const app = express();

// ======================================
// CORS
// ======================================

app.use(
  cors({
    origin: true,
    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ======================================
// BODY PARSER
// ======================================

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// ======================================
// DATABASE
// ======================================

connectDB();

// ======================================
// API ROUTES
// ======================================

// ======================================
// AUTH
// ======================================

app.use("/api/auth", authRoutes);

// ======================================
// NOTIFICATIONS
// ======================================

app.use("/api/notifications", notificationRoutes);

// ======================================
// CATEGORIES
// ======================================

app.use("/api/categories", categoryRoutes);

// ======================================
// SUBCATEGORIES
// ======================================

app.use("/api/subcategories", subcategoryRoutes);

// ======================================
// QUOTES
// ======================================

app.use("/api/quotes", quotesRoutes);

// ======================================
// USERS
// ======================================

app.use("/api/users", userRoutes);

// ======================================
// AI
// ======================================

app.use("/api/ai", aiRoutes);

// ======================================
// STICKERS
// ======================================

if (stickerRoutes) {
  app.use("/api/stickers", stickerRoutes);
}

// ======================================
// HEALTH CHECK
// ======================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Quotes API is running",
  });
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// ======================================
// 404 HANDLER
// ======================================

app.use((req, res) => {
  console.log(`❌ ROUTE NOT FOUND: ${req.method} ${req.originalUrl}`);

  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use((error, req, res, next) => {
  console.error("❌ GLOBAL ERROR:");
  console.error(error);

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

// ======================================
// SERVER
// ======================================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log("");
  console.log("====================================");
  console.log("       QUOTES API SERVER");
  console.log("====================================");

  console.log(`Server: http://localhost:${PORT}`);

  console.log("");

  console.log("Routes:");

  // ====================================
  // AUTH
  // ====================================

  console.log("  POST   /api/auth/register");

  console.log("  POST   /api/auth/login");

  console.log("  POST   /api/auth/social-login");

  // ====================================
  // USERS
  // ====================================

  console.log("  GET    /api/users");

  console.log("  GET    /api/users/:id");

  console.log("  PUT    /api/users/:id");

  console.log("  PUT    /api/users/:id/password");

  console.log("  DELETE /api/users/:id");

  // ====================================
  // CATEGORIES
  // ====================================

  console.log("  GET    /api/categories");

  console.log("  GET    /api/subcategories");

  // ====================================
  // QUOTES
  // ====================================

  console.log("  GET    /api/quotes");

  console.log("  GET    /api/quotes/daily");

  console.log("  GET    /api/quotes/:id");

  console.log("  POST   /api/quotes");

  console.log("  POST   /api/quotes/bulk-upload");

  console.log("  PUT    /api/quotes/:id");

  console.log("  DELETE /api/quotes/:id");

  // ====================================
  // NOTIFICATIONS
  // ====================================

  console.log("  POST   /api/notifications/register-device");

  console.log("  GET    /api/notifications/user/:userId");

  console.log("  PUT    /api/notifications/deactivate");

  console.log("  POST   /api/notifications/send");

  console.log("  GET    /api/notifications/history/:userId");

  console.log("  GET    /api/notifications/unread-count/:userId");

  console.log("  PUT    /api/notifications/read-all/:userId");

  console.log("  PUT    /api/notifications/:id/read");

  console.log("  DELETE /api/notifications/:id");
  console.log("  POST   /api/quotes/:id/like");
  console.log("  DELETE /api/quotes/:id/like");
  // ====================================
  // AI
  // ====================================

  console.log("  POST   /api/ai/generate");

  // ====================================
  // STICKERS
  // ====================================

  if (stickerRoutes) {
    console.log("  GET    /api/stickers");
  } else {
    console.log("  /api/stickers -> NOT CONFIGURED");
  }

  console.log("====================================");

  console.log("");
});
