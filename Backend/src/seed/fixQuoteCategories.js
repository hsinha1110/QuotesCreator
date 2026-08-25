require("dotenv").config();

const mongoose = require("mongoose");

const Quote = require("../models/Quote");
const Category = require("../models/Category");

// =====================================================
// CONFIG
// =====================================================

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// =====================================================
// CATEGORY KEYWORDS
// =====================================================

const CATEGORY_KEYWORDS = {
  प्रेरणा: [
    "प्रेरणा",
    "प्रेरित",
    "हौसला",
    "हिम्मत",
    "मेहनत",
    "परिश्रम",
    "प्रयास",
    "कोशिश",
    "संघर्ष",
    "हार मत",
    "सफलता",
    "कामयाबी",
  ],

  प्यार: [
    "प्यार",
    "प्रेम",
    "मोहब्बत",
    "इश्क",
    "दिल",
    "प्रेमी",
    "प्रेयसी",
    "रिश्ता",
    "रिश्ते",
    "जुदाई",
  ],

  जिंदगी: [
    "जिंदगी",
    "जिन्दगी",
    "जीवन",
    "जीना",
    "जिंदगी की",
    "जीवन की",
    "अनुभव",
    "सबक",
    "सीख",
  ],

  सफलता: [
    "सफलता",
    "सफल",
    "कामयाबी",
    "कामयाब",
    "जीत",
    "विजय",
    "मंजिल",
    "उपलब्धि",
  ],

  दोस्ती: ["दोस्त", "दोस्ती", "मित्र", "यार", "सखा"],

  खुशी: ["खुशी", "खुश", "मुस्कान", "हंसी", "आनंद"],

  उदासी: ["उदासी", "उदास", "दुख", "दुःख", "अकेला", "अकेलापन"],

  रवैया: ["रवैया", "व्यवहार", "सोच", "attitude"],

  प्रेरणादायक: ["प्रेरणादायक", "प्रेरक"],

  सकारात्मक: ["सकारात्मक", "positive", "उम्मीद", "आशा"],

  स्वास्थ्य: ["स्वास्थ्य", "सेहत", "स्वस्थ", "योग", "व्यायाम", "कसरत"],

  धन: ["धन", "पैसा", "दौलत", "रुपया", "अमीर", "गरीबी"],

  आत्मविश्वास: ["आत्मविश्वास", "विश्वास", "भरोसा", "आत्मसम्मान"],

  स्वतंत्रता: ["स्वतंत्रता", "आजादी", "आज़ादी", "स्वतंत्र"],

  बचपन: ["बचपन", "बच्चपन", "बचपन की याद"],

  लक्ष्य: ["लक्ष्य", "मंजिल", "उद्देश्य", "सपना", "सपने", "ख्वाब"],

  स्वार्थ: ["स्वार्थ", "स्वार्थी", "मतलब"],

  लालच: ["लालच", "लालसा", "लोभ"],

  "दृढ़ संकल्प": ["दृढ़ संकल्प", "संकल्प", "इरादा", "इच्छाशक्ति"],

  आदत: ["आदत", "आदतें", "अनुशासन", "दिनचर्या"],

  आलस्य: ["आलस्य", "आलसी", "सुस्ती"],

  नफरत: ["नफरत", "घृणा", "द्वेष", "नफरत करना"],

  ईर्ष्या: ["ईर्ष्या", "जलन", "ईर्ष्यालु"],

  क्रोध: ["क्रोध", "गुस्सा", "नाराज", "क्रोधी"],

  शांति: ["शांति", "सुकून", "शांत", "धैर्य", "संयम"],

  दर्द: ["दर्द", "पीड़ा", "तकलीफ", "दुख", "जख्म"],

  दुनिया: ["दुनिया", "विश्व", "जगत", "समाज", "लोग"],

  एकता: ["एकता", "एकजुट", "साथ", "मिलजुल"],

  वाणी: ["वाणी", "शब्द", "बोल", "बात", "वचन"],

  चरित्र: ["चरित्र", "संस्कार", "ईमानदारी", "सच्चाई"],

  सुविधा: ["सुविधा", "आराम", "सुख", "सुविधाजनक"],

  सामान्य: [],
};

// =====================================================
// NORMALIZE
// =====================================================

const normalize = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

// =====================================================
// GET QUOTE TEXT
// =====================================================

const getQuoteText = (quote) => {
  return normalize(quote.qu_text || quote.text || "");
};

// =====================================================
// GET CATEGORY NAME
// =====================================================

const getCategoryName = (category) => {
  return normalize(
    category.name || category.hindiName || category.translations?.Hindi || "",
  );
};

// =====================================================
// FIND CATEGORY
// =====================================================

const findCategory = (quoteText, categories) => {
  let bestCategory = null;
  let bestScore = 0;

  for (const category of categories) {
    const categoryName = getCategoryName(category);

    const keywords = CATEGORY_KEYWORDS[categoryName] || [];

    let score = 0;

    for (const keyword of keywords) {
      const normalizedKeyword = normalize(keyword);

      if (normalizedKeyword && quoteText.includes(normalizedKeyword)) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return {
    category: bestCategory,
    score: bestScore,
  };
};

// =====================================================
// FIND GENERAL
// =====================================================

const findGeneralCategory = (categories) => {
  return (
    categories.find((category) => getCategoryName(category) === "सामान्य") ||
    categories.find(
      (category) => normalize(category.translations?.English) === "general",
    ) ||
    null
  );
};

// =====================================================
// MAIN
// =====================================================

const fixQuoteCategories = async () => {
  try {
    console.log("\n==========================================");

    console.log("       FIX QUOTE CATEGORIES");

    console.log("==========================================\n");

    // ======================================
    // CHECK URI
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
    // GET CATEGORIES
    // ======================================

    const categories = await Category.find({})
      .select("_id name hindiName translations")
      .lean();

    console.log(`Categories found: ${categories.length}`);

    if (!categories.length) {
      throw new Error(
        "No categories found. Run npm run seed:categories first.",
      );
    }

    // ======================================
    // GENERAL CATEGORY
    // ======================================

    const generalCategory = findGeneralCategory(categories);

    if (!generalCategory) {
      throw new Error("General/सामान्य category not found.");
    }

    console.log(`General category: ${generalCategory._id}`);

    // ======================================
    // GET QUOTES
    // ======================================

    const quotes = await Quote.find({
      language: "Hindi",
    })
      .select("_id qu_text text qu_author author categoryId subcategoryId")
      .lean();

    console.log(`Hindi quotes found: ${quotes.length}`);

    // ======================================
    // COUNTERS
    // ======================================

    let updated = 0;
    let generalCount = 0;
    let matchedCount = 0;
    let skippedCount = 0;

    // ======================================
    // PROCESS
    // ======================================

    for (const quote of quotes) {
      const quoteText = getQuoteText(quote);

      if (!quoteText) {
        skippedCount++;
        continue;
      }

      const result = findCategory(quoteText, categories);

      let category = result.category;

      // ====================================
      // FALLBACK GENERAL
      // ====================================

      if (!category) {
        category = generalCategory;

        generalCount++;
      } else {
        matchedCount++;
      }

      // ====================================
      // UPDATE
      // ====================================

      const updateResult = await Quote.updateOne(
        {
          _id: quote._id,
        },
        {
          $set: {
            categoryId: category._id,

            // IMPORTANT:
            // old deleted subcategory IDs
            // must not remain
            subcategoryId: null,
          },
        },
      );

      if (updateResult.modifiedCount > 0) {
        updated++;
      }

      // ====================================
      // PROGRESS
      // ====================================

      if (updated > 0 && updated % 100 === 0) {
        console.log(`Updated: ${updated}`);
      }
    }

    // ======================================
    // FINAL CHECK
    // ======================================

    const withoutCategory = await Quote.countDocuments({
      language: "Hindi",

      $or: [
        {
          categoryId: null,
        },
        {
          categoryId: {
            $exists: false,
          },
        },
      ],
    });

    // ======================================
    // CATEGORY COUNTS
    // ======================================

    console.log("\n==========================================");

    console.log("       CATEGORY ASSIGNMENT RESULT");

    console.log("==========================================");

    console.log(`Total quotes       : ${quotes.length}`);

    console.log(`Updated            : ${updated}`);

    console.log(`Keyword matched    : ${matchedCount}`);

    console.log(`General fallback   : ${generalCount}`);

    console.log(`Skipped            : ${skippedCount}`);

    console.log(`Without category   : ${withoutCategory}`);

    console.log("==========================================\n");

    // ======================================
    // SHOW CATEGORY DISTRIBUTION
    // ======================================

    console.log("CATEGORY DISTRIBUTION:\n");

    for (const category of categories) {
      const count = await Quote.countDocuments({
        language: "Hindi",

        categoryId: category._id,
      });

      console.log(`${category.name}: ${count}`);
    }

    console.log("\n==========================================");

    console.log("✅ CATEGORY FIX COMPLETE");

    console.log("==========================================\n");
  } catch (error) {
    console.error("\n❌ FIX CATEGORY ERROR:", error);

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

// =====================================================
// RUN
// =====================================================

fixQuoteCategories();
