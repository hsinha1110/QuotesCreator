const mongoose = require("mongoose");

const Quote = require("../models/Quotes");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const cloudinary = require("../config/cloudinary");

// ======================================
// ALLOWED LANGUAGES
// ======================================

const allowedLanguages = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Portuguese",
  "Italian",
];

// ======================================
// CLOUDINARY UPLOAD
// ======================================

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "QuotesCreator/quotes",
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

// ======================================
// PARSE TRANSLATIONS
// ======================================

const parseTranslations = (translations) => {
  if (!translations) {
    return {};
  }

  let parsedTranslations = translations;

  if (typeof translations === "string") {
    try {
      parsedTranslations = JSON.parse(translations);
    } catch (error) {
      throw new Error("Invalid translations JSON");
    }
  }

  if (
    typeof parsedTranslations !== "object" ||
    Array.isArray(parsedTranslations)
  ) {
    throw new Error("Translations must be an object");
  }

  return parsedTranslations;
};

// ======================================
// SEARCH QUOTES
// ======================================

// ======================================
// SEARCH QUOTES
// ======================================

const searchQuotes = async (req, res) => {
  try {
    const { q, language } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // ======================================
    // QUERY REQUIRED
    // ======================================

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // ======================================
    // VALIDATE LANGUAGE
    // ======================================

    if (language && !allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    const searchText = q.trim();

    // ======================================
    // SEARCH FILTER
    // ======================================

    const searchFilter = {
      $or: [
        // Search in original quote text
        {
          text: {
            $regex: searchText,
            $options: "i",
          },
        },

        // Search in author
        {
          author: {
            $regex: searchText,
            $options: "i",
          },
        },
      ],
    };

    // ======================================
    // SEARCH IN TRANSLATIONS
    // ======================================

    if (language) {
      searchFilter.$or.push({
        [`translations.${language}`]: {
          $regex: searchText,
          $options: "i",
        },
      });
    } else {
      // Agar language nahi di hai to
      // sabhi translations me search karo

      for (const lang of allowedLanguages) {
        searchFilter.$or.push({
          [`translations.${lang}`]: {
            $regex: searchText,
            $options: "i",
          },
        });
      }
    }

    // ======================================
    // TOTAL
    // ======================================

    const total = await Quote.countDocuments(searchFilter);

    // ======================================
    // GET QUOTES
    // ======================================

    const quotes = await Quote.find(searchFilter)
      .populate("categoryId", "name image")
      .populate("subcategoryId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      success: true,
      query: searchText,
      language: language || null,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    console.error("Search Quotes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search quotes",
      error: error.message,
    });
  }
};

// ======================================
// LATEST QUOTES
// ======================================
// ======================================
// LATEST QUOTES
// ======================================

const getLatestQuotes = async (req, res) => {
  try {
    const { language } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // ======================================
    // VALIDATE LANGUAGE
    // ======================================

    if (language && !allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    // ======================================
    // BASE FILTER
    // ======================================

    const filter = {
      isDraft: false,
    };

    // ======================================
    // LANGUAGE FILTER
    // ======================================
    // Agar language nahi di:
    // sabhi published quotes
    //
    // Agar language di:
    // original language OR translation available
    // dono me se quote milega

    if (language) {
      filter.$or = [
        {
          language: language,
        },
        {
          [`translations.${language}`]: {
            $exists: true,
            $ne: "",
          },
        },
      ];
    }

    // ======================================
    // TOTAL
    // ======================================

    const total = await Quote.countDocuments(filter);

    // ======================================
    // GET LATEST QUOTES
    // ======================================

    const quotes = await Quote.find(filter)
      .populate("categoryId", "name image translations")
      .populate("subcategoryId", "name image translations")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // ======================================
    // LOCALIZED RESPONSE
    // ======================================

    const localizedQuotes = quotes.map((quote) => {
      const quoteObject = quote.toObject();

      // --------------------------------------
      // QUOTE TRANSLATION
      // --------------------------------------

      if (
        language &&
        quoteObject.translations &&
        quoteObject.translations[language]
      ) {
        quoteObject.text = quoteObject.translations[language];
      }

      // --------------------------------------
      // CATEGORY TRANSLATION
      // --------------------------------------

      if (
        language &&
        quoteObject.categoryId?.translations &&
        quoteObject.categoryId.translations[language]
      ) {
        quoteObject.categoryId.displayName =
          quoteObject.categoryId.translations[language];
      } else if (quoteObject.categoryId) {
        quoteObject.categoryId.displayName = quoteObject.categoryId.name;
      }

      // --------------------------------------
      // SUBCATEGORY TRANSLATION
      // --------------------------------------

      if (
        language &&
        quoteObject.subcategoryId?.translations &&
        quoteObject.subcategoryId.translations[language]
      ) {
        quoteObject.subcategoryId.displayName =
          quoteObject.subcategoryId.translations[language];
      } else if (quoteObject.subcategoryId) {
        quoteObject.subcategoryId.displayName = quoteObject.subcategoryId.name;
      }

      // Requested language
      if (language) {
        quoteObject.language = language;
      }

      return quoteObject;
    });

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      success: true,
      language: language || null,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes: localizedQuotes,
    });
  } catch (error) {
    console.error("Latest Quotes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get latest quotes",
      error: error.message,
    });
  }
};

// ======================================
// POPULAR QUOTES
// ======================================

// ======================================
// POPULAR QUOTES
// ======================================

const getPopularQuotes = async (req, res) => {
  try {
    const { language } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // ======================================
    // VALIDATE LANGUAGE
    // ======================================

    if (language && !allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    // ======================================
    // BASE FILTER
    // ======================================

    const filter = {
      isDraft: false,
    };

    // ======================================
    // LANGUAGE FILTER
    // ======================================

    if (language) {
      filter.$or = [
        {
          language: language,
        },
        {
          [`translations.${language}`]: {
            $exists: true,
            $ne: "",
          },
        },
      ];
    }

    // ======================================
    // TOTAL
    // ======================================

    const total = await Quote.countDocuments(filter);

    // ======================================
    // GET POPULAR QUOTES
    // ======================================

    const quotes = await Quote.find(filter)
      .populate("categoryId", "name image translations")
      .populate("subcategoryId", "name image translations")
      .sort({
        views: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    // ======================================
    // LOCALIZE RESPONSE
    // ======================================

    const localizedQuotes = quotes.map((quote) => {
      const quoteObject = quote.toObject();

      // --------------------------------------
      // QUOTE TRANSLATION
      // --------------------------------------

      if (
        language &&
        quoteObject.translations &&
        quoteObject.translations[language]
      ) {
        quoteObject.text = quoteObject.translations[language];
      }

      // --------------------------------------
      // CATEGORY TRANSLATION
      // --------------------------------------

      if (
        language &&
        quoteObject.categoryId?.translations &&
        quoteObject.categoryId.translations[language]
      ) {
        quoteObject.categoryId.displayName =
          quoteObject.categoryId.translations[language];
      } else if (quoteObject.categoryId) {
        quoteObject.categoryId.displayName = quoteObject.categoryId.name;
      }

      // --------------------------------------
      // SUBCATEGORY TRANSLATION
      // --------------------------------------

      if (
        language &&
        quoteObject.subcategoryId?.translations &&
        quoteObject.subcategoryId.translations[language]
      ) {
        quoteObject.subcategoryId.displayName =
          quoteObject.subcategoryId.translations[language];
      } else if (quoteObject.subcategoryId) {
        quoteObject.subcategoryId.displayName = quoteObject.subcategoryId.name;
      }

      // --------------------------------------
      // REQUESTED LANGUAGE
      // --------------------------------------

      if (language) {
        quoteObject.language = language;
      }

      return quoteObject;
    });

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      success: true,
      language: language || null,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes: localizedQuotes,
    });
  } catch (error) {
    console.error("Popular Quotes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get popular quotes",
      error: error.message,
    });
  }
};

// ======================================
// CREATE QUOTE
// ======================================

const createQuote = async (req, res) => {
  try {
    const {
      userId,
      categoryId,
      subcategoryId,
      text,
      author,
      language = "English",
      translations,
      isDraft,
      source,
    } = req.body || {};

    // ======================================
    // REQUIRED FIELDS
    // ======================================

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Quote text is required",
      });
    }

    // ======================================
    // VALIDATE LANGUAGE
    // ======================================

    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    // ======================================
    // PARSE TRANSLATIONS
    // ======================================

    let parsedTranslations = {};

    try {
      parsedTranslations = parseTranslations(translations);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // ======================================
    // VALIDATE TRANSLATION LANGUAGES
    // ======================================

    for (const key of Object.keys(parsedTranslations)) {
      if (!allowedLanguages.includes(key)) {
        return res.status(400).json({
          success: false,
          message: `Invalid translation language: ${key}`,
          allowedLanguages,
        });
      }

      if (
        typeof parsedTranslations[key] !== "string" ||
        !parsedTranslations[key].trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `Translation for ${key} must be a non-empty string`,
        });
      }

      parsedTranslations[key] = parsedTranslations[key].trim();
    }

    // ======================================
    // VALIDATE CATEGORY ID
    // ======================================

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // ======================================
    // CHECK CATEGORY
    // ======================================

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // ======================================
    // VALIDATE SUBCATEGORY
    // ======================================

    if (subcategoryId) {
      if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid subcategory ID",
        });
      }

      const subcategory = await Subcategory.findById(subcategoryId);

      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found",
        });
      }

      if (subcategory.categoryId.toString() !== categoryId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Subcategory does not belong to this category",
        });
      }
    }

    // ======================================
    // CREATE QUOTE
    // ======================================

    const quote = await Quote.create({
      userId: userId || null,
      categoryId,
      subcategoryId: subcategoryId || null,

      text: text.trim(),

      author: author?.trim() || "Unknown",

      image: req.file
        ? (await uploadToCloudinary(req.file.buffer)).secure_url
        : null,

      language,

      translations: parsedTranslations,

      isDraft: isDraft ?? false,

      source: source ?? "user",
    });

    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({
      success: true,
      message: "Quote created successfully",
      quote,
    });
  } catch (error) {
    console.error("Create Quote Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This quote already exists in this subcategory",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create quote",
      error: error.message,
    });
  }
};

// ======================================
// GET ALL QUOTES
// ======================================

const getQuotes = async (req, res) => {
  try {
    const { language } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {};

    if (language) {
      if (!allowedLanguages.includes(language)) {
        return res.status(400).json({
          success: false,
          message: "Invalid language",
          allowedLanguages,
        });
      }

      filter.language = language;
    }

    const total = await Quote.countDocuments(filter);

    const quotes = await Quote.find(filter)
      .populate("categoryId", "name image")
      .populate("subcategoryId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      language: language || null,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    console.error("Get Quotes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get quotes",
      error: error.message,
    });
  }
};

// ======================================
// GET SINGLE QUOTE
// ======================================

const getQuote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    const quote = await Quote.findById(id)
      .populate("categoryId", "name image")
      .populate("subcategoryId", "name image");

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    res.status(200).json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error("Get Quote Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get quote",
      error: error.message,
    });
  }
};

// ======================================
// GET QUOTES BY CATEGORY
// ======================================

const getQuotesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { language } = req.query;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    if (language && !allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {
      categoryId,
    };

    if (language) {
      filter.language = language;
    }

    const total = await Quote.countDocuments(filter);

    const quotes = await Quote.find(filter)
      .populate("subcategoryId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      categoryId,
      language: language || null,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    console.error("Category Quotes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get category quotes",
      error: error.message,
    });
  }
};

// ======================================
// GET QUOTES BY SUBCATEGORY
// ======================================

const getQuotesBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const { language } = req.query;

    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory ID",
      });
    }

    if (language && !allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {
      subcategoryId,
    };

    if (language) {
      filter.language = language;
    }

    const total = await Quote.countDocuments(filter);

    const quotes = await Quote.find(filter)
      .populate("categoryId", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      subcategoryId,
      language: language || null,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    console.error("Subcategory Quotes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get subcategory quotes",
      error: error.message,
    });
  }
};

// ======================================
// DAILY QUOTE
// ======================================
// ======================================
// DAILY QUOTE
// ======================================

const getDailyQuote = async (req, res) => {
  try {
    const { language } = req.query;

    // ======================================
    // VALIDATE LANGUAGE
    // ======================================

    if (language && !allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language",
        allowedLanguages,
      });
    }

    // ======================================
    // BASE FILTER
    // ======================================

    const filter = {
      isDraft: false,
    };

    // ======================================
    // LANGUAGE FILTER
    // ======================================

    if (language) {
      filter.$or = [
        {
          language: language,
        },
        {
          [`translations.${language}`]: {
            $exists: true,
            $ne: "",
          },
        },
      ];
    }

    // ======================================
    // GET TOTAL QUOTES
    // ======================================

    const count = await Quote.countDocuments(filter);

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: language
          ? `No quotes available for ${language}`
          : "No quotes available",
      });
    }

    // ======================================
    // DAILY INDEX
    // Same quote for the whole day
    // ======================================

    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const dateNumber = year * 10000 + month * 100 + day;

    const dailyIndex = dateNumber % count;

    // ======================================
    // GET DAILY QUOTE
    // ======================================

    const quote = await Quote.findOne(filter)
      .sort({ createdAt: 1 })
      .skip(dailyIndex)
      .populate("categoryId", "name image translations")
      .populate("subcategoryId", "name image translations");

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Daily quote not found",
      });
    }

    // ======================================
    // CONVERT MONGOOSE MAP TO OBJECT
    // ======================================

    const quoteObject = quote.toObject();

    const translations = quoteObject.translations || {};

    // ======================================
    // LANGUAGE TEXT
    // ======================================

    let displayText = quoteObject.text;
    let displayLanguage = quoteObject.language;

    if (language) {
      // Translation available
      if (translations[language]) {
        displayText = translations[language];
        displayLanguage = language;
      }

      // Quote itself is in requested language
      else if (quoteObject.language === language) {
        displayText = quoteObject.text;
        displayLanguage = language;
      }
    }

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      success: true,
      language: displayLanguage,

      quote: {
        ...quoteObject,
        text: displayText,
        language: displayLanguage,
      },
    });
  } catch (error) {
    console.error("Daily Quote Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get daily quote",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE QUOTE
// ======================================

const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      categoryId,
      subcategoryId,
      text,
      author,
      language,
      translations,
      isDraft,
      source,
    } = req.body || {};

    // ======================================
    // VALIDATE QUOTE ID
    // ======================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    // ======================================
    // FIND QUOTE
    // ======================================

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    // ======================================
    // CATEGORY
    // ======================================

    if (categoryId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      quote.categoryId = categoryId;
    }

    // ======================================
    // SUBCATEGORY
    // ======================================

    if (subcategoryId !== undefined) {
      if (subcategoryId !== null && subcategoryId !== "") {
        if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
          return res.status(400).json({
            success: false,
            message: "Invalid subcategory ID",
          });
        }

        const subcategory = await Subcategory.findById(subcategoryId);

        if (!subcategory) {
          return res.status(404).json({
            success: false,
            message: "Subcategory not found",
          });
        }

        const finalCategoryId = categoryId || quote.categoryId;

        if (subcategory.categoryId.toString() !== finalCategoryId.toString()) {
          return res.status(400).json({
            success: false,
            message: "Subcategory does not belong to this category",
          });
        }

        quote.subcategoryId = subcategoryId;
      } else {
        quote.subcategoryId = null;
      }
    }

    // ======================================
    // TEXT
    // ======================================

    if (text !== undefined) {
      if (!text.trim()) {
        return res.status(400).json({
          success: false,
          message: "Quote text cannot be empty",
        });
      }

      quote.text = text.trim();
    }

    // ======================================
    // AUTHOR
    // ======================================

    if (author !== undefined) {
      quote.author = author.trim() || "Unknown";
    }

    // ======================================
    // LANGUAGE
    // ======================================

    if (language !== undefined) {
      if (!allowedLanguages.includes(language)) {
        return res.status(400).json({
          success: false,
          message: "Invalid language",
          allowedLanguages,
        });
      }

      quote.language = language;
    }

    // ======================================
    // TRANSLATIONS
    // ======================================

    if (translations !== undefined) {
      let parsedTranslations;

      try {
        parsedTranslations = parseTranslations(translations);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      for (const key of Object.keys(parsedTranslations)) {
        if (!allowedLanguages.includes(key)) {
          return res.status(400).json({
            success: false,
            message: `Invalid translation language: ${key}`,
            allowedLanguages,
          });
        }

        if (
          typeof parsedTranslations[key] !== "string" ||
          !parsedTranslations[key].trim()
        ) {
          return res.status(400).json({
            success: false,
            message: `Translation for ${key} must be a non-empty string`,
          });
        }

        parsedTranslations[key] = parsedTranslations[key].trim();
      }

      quote.translations = parsedTranslations;
    }

    // ======================================
    // DRAFT
    // ======================================

    if (isDraft !== undefined) {
      quote.isDraft = isDraft === true || isDraft === "true";
    }

    // ======================================
    // SOURCE
    // ======================================

    if (source !== undefined) {
      if (!["admin", "user", "ai"].includes(source)) {
        return res.status(400).json({
          success: false,
          message: "Invalid source",
          allowedSources: ["admin", "user", "ai"],
        });
      }

      quote.source = source;
    }

    // ======================================
    // NEW IMAGE
    // ======================================

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      quote.image = result.secure_url;
    }

    // ======================================
    // SAVE
    // ======================================

    await quote.save();

    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      success: true,
      message: "Quote updated successfully",
      quote,
    });
  } catch (error) {
    console.error("Update Quote Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Quote already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update quote",
      error: error.message,
    });
  }
};

// ======================================
// DELETE QUOTE
// ======================================

const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote ID",
      });
    }

    const quote = await Quote.findByIdAndDelete(id);

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
    console.error("Delete Quote Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete quote",
      error: error.message,
    });
  }
};

// ======================================
// EXPORTS
// ======================================

module.exports = {
  createQuote,
  getQuotes,
  getQuote,
  getDailyQuote,
  getQuotesByCategory,
  getQuotesBySubcategory,
  updateQuote,
  deleteQuote,
  searchQuotes,
  getLatestQuotes,
  getPopularQuotes,
};
