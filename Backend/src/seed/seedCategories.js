require("dotenv").config();

const mongoose = require("mongoose");
const Groq = require("groq-sdk");

const Category = require("../models/Category");

// ==========================================
// CONFIG
// ==========================================

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const GROQ_API_KEY = process.env.GROQ_API_KEY;

// ==========================================
// GROQ
// ==========================================

const groq = GROQ_API_KEY
  ? new Groq({
      apiKey: GROQ_API_KEY,
    })
  : null;

// ==========================================
// CATEGORIES
// ==========================================

const categories = [
  {
    name: "प्रेरणा",
    english: "Motivation",
  },
  {
    name: "प्यार",
    english: "Love",
  },
  {
    name: "जिंदगी",
    english: "Life",
  },
  {
    name: "सफलता",
    english: "Success",
  },
  {
    name: "दोस्ती",
    english: "Friendship",
  },
  {
    name: "खुशी",
    english: "Happiness",
  },
  {
    name: "उदासी",
    english: "Sad",
  },
  {
    name: "रवैया",
    english: "Attitude",
  },
  {
    name: "प्रेरणादायक",
    english: "Inspirational",
  },
  {
    name: "सकारात्मक",
    english: "Positive",
  },
  {
    name: "स्वास्थ्य",
    english: "Health",
  },
  {
    name: "धन",
    english: "Wealth",
  },
  {
    name: "आत्मविश्वास",
    english: "Self Confidence",
  },
  {
    name: "स्वतंत्रता",
    english: "Freedom",
  },
  {
    name: "बचपन",
    english: "Childhood",
  },
  {
    name: "लक्ष्य",
    english: "Goal",
  },
  {
    name: "स्वार्थ",
    english: "Selfishness",
  },
  {
    name: "लालच",
    english: "Greed",
  },
  {
    name: "दृढ़ संकल्प",
    english: "Determination",
  },
  {
    name: "आदत",
    english: "Habit",
  },
  {
    name: "आलस्य",
    english: "Laziness",
  },
  {
    name: "नफरत",
    english: "Hatred",
  },
  {
    name: "ईर्ष्या",
    english: "Jealousy",
  },
  {
    name: "क्रोध",
    english: "Anger",
  },
  {
    name: "शांति",
    english: "Peace",
  },
  {
    name: "दर्द",
    english: "Pain",
  },
  {
    name: "दुनिया",
    english: "World",
  },
  {
    name: "एकता",
    english: "Unity",
  },
  {
    name: "वाणी",
    english: "Speech",
  },
  {
    name: "चरित्र",
    english: "Character",
  },
  {
    name: "सुविधा",
    english: "Comfort",
  },
  {
    name: "सामान्य",
    english: "General",
  },
];

// ==========================================
// NORMALIZE
// ==========================================

const normalize = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};

// ==========================================
// MAIN
// ==========================================

const seedCategories = async () => {
  try {
    console.log("\n==========================================");
    console.log("          CATEGORY SEED");
    console.log("==========================================\n");

    // ======================================
    // CHECK MONGO
    // ======================================

    if (!MONGO_URI) {
      throw new Error("MONGO_URI / MONGODB_URI is missing in .env");
    }

    // ======================================
    // CONNECT
    // ======================================

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // ======================================
    // INSERT CATEGORIES
    // ======================================

    let inserted = 0;
    let skipped = 0;

    for (const item of categories) {
      // ------------------------------------
      // DUPLICATE CHECK
      // ------------------------------------

      const existing = await Category.findOne({
        $or: [
          {
            name: item.name,
          },
          {
            "translations.English": item.english,
          },
        ],
      });

      if (existing) {
        console.log(`SKIPPED: ${item.name} / ${item.english}`);

        skipped++;

        continue;
      }

      // ------------------------------------
      // CREATE
      // ------------------------------------

      const category = await Category.create({
        name: item.name,

        // NO IMAGE
        image: null,

        description: "",

        translations: {
          Hindi: item.name,
          English: item.english,
        },
      });

      inserted++;

      console.log(`✓ ${category.name} → ${item.english}`);
    }

    // ======================================
    // RESULT
    // ======================================

    const total = await Category.countDocuments();

    console.log("\n==========================================");
    console.log("          CATEGORY SEED COMPLETE");
    console.log("==========================================");

    console.log(`Total categories : ${total}`);

    console.log(`Inserted          : ${inserted}`);

    console.log(`Skipped           : ${skipped}`);

    console.log("==========================================\n");
  } catch (error) {
    console.error("\n❌ CATEGORY SEED ERROR:", error);

    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();

      console.log("MongoDB disconnected");
    } catch (error) {
      console.error("MongoDB disconnect error:", error.message);
    }
  }
};

// ==========================================
// RUN
// ==========================================

seedCategories();
