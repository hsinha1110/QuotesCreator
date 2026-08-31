const fs = require("fs");
const csv = require("csv-parser");

const Quote = require("../models/Quote");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");

// =====================================================
// ALLOWED LANGUAGES
// =====================================================

const ALLOWED_LANGUAGES = ["English", "Hindi"];

// =====================================================
// BULK UPLOAD QUOTES
// =====================================================

const bulkUploadQuotes = async (req, res) => {
  let filePath = null;

  const errors = [];
  const duplicates = [];
  const quotes = [];

  try {
    // =================================================
    // FILE CHECK
    // =================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    filePath = req.file.path;

    // =================================================
    // READ CSV
    // =================================================

    const rows = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(
          csv({
            mapHeaders: ({ header }) => normalizeHeader(header),
          }),
        )
        .on("data", (row) => {
          rows.push(row);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (!rows.length) {
      removeFile(filePath);
      filePath = null;

      return res.status(400).json({
        success: false,
        message: "CSV file is empty",
      });
    }

    console.log("====================================");
    console.log("CSV TOTAL ROWS:", rows.length);
    console.log("CSV HEADERS:", Object.keys(rows[0]));
    console.log("====================================");

    // =================================================
    // CACHE
    // =================================================

    const categoryCache = new Map();
    const subcategoryCache = new Map();

    // =================================================
    // PROCESS CSV
    // =================================================

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const rowNumber = index + 2;

      try {
        // =================================================
        // CATEGORY ENGLISH
        // =================================================

        const categoryEn = getValue(
          row,
          "category_en",
          "category_name_en",
          "category",
        );

        // =================================================
        // CATEGORY HINDI
        // =================================================

        const categoryHi = getValue(
          row,
          "category_hi",
          "category_name_hi",
          "category_hindi",
        );

        if (!categoryEn) {
          throw new Error("Category English name is required");
        }

        const finalCategoryHi = categoryHi || categoryEn;

        // =================================================
        // CATEGORY KEY
        // =================================================

        const categoryKey = categoryEn.trim().toLowerCase();

        let category = categoryCache.get(categoryKey);

        // =================================================
        // FIND EXISTING CATEGORY
        // =================================================

        if (!category) {
          category = await findExistingCategory(categoryEn, finalCategoryHi);
        }

        // =================================================
        // CREATE CATEGORY ONLY IF NOT FOUND
        // =================================================

        if (!category) {
          category = await Category.create({
            name: categoryEn.trim(),
            image: null,

            translations: {
              English: categoryEn.trim(),
              Hindi: finalCategoryHi.trim(),
            },
          });

          console.log(
            `🆕 CATEGORY CREATED: ${category.name} -> ${category._id}`,
          );
        } else {
          console.log(`✅ CATEGORY FOUND: ${category.name} -> ${category._id}`);

          await ensureCategoryTranslations(
            category,
            categoryEn.trim(),
            finalCategoryHi.trim(),
          );
        }

        // =================================================
        // CACHE CATEGORY
        // =================================================

        categoryCache.set(categoryKey, category);

        // =================================================
        // SUBCATEGORY ENGLISH
        // =================================================

        const subcategoryEn = getValue(
          row,
          "subcategory_en",
          "subcategory_name_en",
          "subcategory",
        );

        // =================================================
        // SUBCATEGORY HINDI
        // =================================================

        const subcategoryHi = getValue(
          row,
          "subcategory_hi",
          "subcategory_name_hi",
          "subcategory_hindi",
        );

        // =================================================
        // SUBCATEGORY DESCRIPTION ENGLISH
        // =================================================

        const descriptionEn = getValue(
          row,
          "description_en",
          "subcategory_description_en",
          "description_english",
        );

        // =================================================
        // SUBCATEGORY DESCRIPTION HINDI
        // =================================================

        const descriptionHi = getValue(
          row,
          "description_hi",
          "subcategory_description_hi",
          "description_hindi",
        );

        let subcategory = null;

        // =================================================
        // FIND / CREATE SUBCATEGORY
        // =================================================

        if (subcategoryEn) {
          const finalSubcategoryHi = subcategoryHi || subcategoryEn;

          const finalDescriptionEn = descriptionEn || "";
          const finalDescriptionHi = descriptionHi || "";

          // IMPORTANT:
          // Category ID is part of cache key.
          // This prevents same subcategory names
          // from different categories mixing together.

          const subcategoryKey = `${String(category._id)}_${subcategoryEn
            .trim()
            .toLowerCase()}`;

          subcategory = subcategoryCache.get(subcategoryKey);

          // =================================================
          // FIND EXISTING SUBCATEGORY
          // =================================================

          if (!subcategory) {
            subcategory = await findExistingSubcategory(
              category._id,
              subcategoryEn,
              finalSubcategoryHi,
            );
          }

          // =================================================
          // CREATE SUBCATEGORY
          // =================================================

          if (!subcategory) {
            subcategory = await Subcategory.create({
              categoryId: category._id,

              name: subcategoryEn.trim(),

              description: finalDescriptionEn,

              translations: {
                English: subcategoryEn.trim(),
                Hindi: finalSubcategoryHi.trim(),
              },

              descriptionTranslations: {
                English: finalDescriptionEn,
                Hindi: finalDescriptionHi,
              },
            });

            console.log(
              `🆕 SUBCATEGORY CREATED: ${subcategoryEn} -> ${subcategory._id}`,
            );
          } else {
            console.log(
              `✅ SUBCATEGORY FOUND: ${subcategory.name} -> ${subcategory._id}`,
            );

            await ensureSubcategoryTranslations(
              subcategory,
              subcategoryEn.trim(),
              finalSubcategoryHi.trim(),
              finalDescriptionEn,
              finalDescriptionHi,
            );
          }

          // =================================================
          // CACHE SUBCATEGORY
          // =================================================

          subcategoryCache.set(subcategoryKey, subcategory);
        }

        // =================================================
        // QUOTE ENGLISH
        // =================================================

        const quoteEn = getValue(
          row,
          "quote_en",
          "text_en",
          "english",
          "quote_english",
        );

        // =================================================
        // QUOTE HINDI
        // =================================================

        const quoteHi = getValue(
          row,
          "quote_hi",
          "text_hi",
          "hindi",
          "quote_hindi",
        );

        // =================================================
        // GENERIC QUOTE
        // =================================================

        const genericText = getValue(row, "text", "quote", "quote_text");

        if (!quoteEn && !quoteHi && !genericText) {
          throw new Error("Quote text is required. Use quote_en or quote_hi.");
        }

        // =================================================
        // FINAL TEXT
        // =================================================

        const finalText = quoteEn || quoteHi || genericText;

        // =================================================
        // AUTHOR
        // =================================================

        const author = getValue(row, "author", "quote_author") || "Unknown";

        // =================================================
        // LANGUAGE
        // =================================================

        let language = getValue(row, "language");

        if (!language) {
          language = quoteEn ? "English" : "Hindi";
        }

        language = normalizeLanguage(language);

        if (!ALLOWED_LANGUAGES.includes(language)) {
          throw new Error(`Invalid language: ${language}`);
        }

        // =================================================
        // TRANSLATIONS
        // =================================================

        const translations = {};

        if (quoteEn) {
          translations.English = quoteEn;
        }

        if (quoteHi) {
          translations.Hindi = quoteHi;
        }

        // =================================================
        // ACTIVE
        // =================================================

        const isActive = parseBoolean(
          getValue(row, "isactive", "is_active", "active"),
          true,
        );

        // =================================================
        // DUPLICATE CONDITIONS
        // =================================================

        const duplicateConditions = [];

        if (quoteEn) {
          duplicateConditions.push({
            "translations.English": quoteEn,
          });
        }

        if (quoteHi) {
          duplicateConditions.push({
            "translations.Hindi": quoteHi,
          });
        }

        if (genericText) {
          duplicateConditions.push({
            text: genericText,
          });
        }

        if (!duplicateConditions.length) {
          throw new Error("Unable to check duplicate quote");
        }

        // =================================================
        // DUPLICATE QUERY
        // =================================================

        const duplicateQuery = {
          categoryId: category._id,

          $or: duplicateConditions,
        };

        if (subcategory?._id) {
          duplicateQuery.subcategoryId = subcategory._id;
        }

        // =================================================
        // CHECK EXISTING QUOTE
        // =================================================

        const existingQuote = await Quote.findOne(duplicateQuery);

        if (existingQuote) {
          duplicates.push({
            row: rowNumber,

            message: "Duplicate quote",

            quote: finalText,

            category: categoryEn,

            subcategory: subcategoryEn || null,
          });

          continue;
        }

        // =================================================
        // PREPARE QUOTE
        // =================================================

        const quoteData = {
          // IMPORTANT:
          // Always use CURRENT MongoDB category ID

          categoryId: category._id,

          // IMPORTANT:
          // Always use CURRENT MongoDB subcategory ID

          subcategoryId: subcategory?._id || null,

          text: finalText,

          author,

          image: null,

          language,

          translations,

          views: 0,

          likes: 0,

          isDraft: !isActive,

          isActive,

          source: "admin",
        };

        console.log("====================================");

        console.log(`ROW ${rowNumber} QUOTE`);

        console.log("CATEGORY:", category.name);

        console.log("CATEGORY ID:", String(category._id));

        console.log("SUBCATEGORY:", subcategory?.name || null);

        console.log(
          "SUBCATEGORY ID:",
          subcategory?._id ? String(subcategory._id) : null,
        );

        console.log("LANGUAGE:", language);

        console.log("====================================");

        quotes.push(quoteData);
      } catch (error) {
        console.error(`❌ Row ${rowNumber} failed:`, error.message);

        errors.push({
          row: rowNumber,

          error: error.message,

          data: row,
        });
      }
    }

    // =================================================
    // INSERT QUOTES
    // =================================================

    let insertedCount = 0;

    if (quotes.length > 0) {
      const inserted = await Quote.insertMany(quotes, {
        ordered: false,
      });

      insertedCount = inserted.length;
    }

    // =================================================
    // DELETE CSV
    // =================================================

    removeFile(filePath);
    filePath = null;

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message: "Bulk upload completed",

      totalRows: rows.length,

      prepared: quotes.length,

      inserted: insertedCount,

      duplicates: duplicates.length,

      failed: errors.length,

      categoriesProcessed: categoryCache.size,

      subcategoriesProcessed: subcategoryCache.size,

      errors,

      duplicateRows: duplicates,
    });
  } catch (error) {
    console.error("====================================");

    console.error("❌ BULK UPLOAD ERROR:", error);

    console.error("====================================");

    removeFile(filePath);

    return res.status(500).json({
      success: false,

      message: "Failed to bulk upload quotes",

      error: error.message,
    });
  }
};

// =====================================================
// FIND EXISTING CATEGORY
// =====================================================

async function findExistingCategory(english, hindi) {
  const englishName = english.trim();

  const hindiName = hindi.trim();

  // 1. Exact English name

  let category = await Category.findOne({
    name: {
      $regex: `^${escapeRegex(englishName)}$`,
      $options: "i",
    },
  });

  if (category) {
    return category;
  }

  // 2. English translation

  category = await Category.findOne({
    "translations.English": {
      $regex: `^${escapeRegex(englishName)}$`,
      $options: "i",
    },
  });

  if (category) {
    return category;
  }

  // 3. Hindi translation

  if (hindiName) {
    category = await Category.findOne({
      "translations.Hindi": {
        $regex: `^${escapeRegex(hindiName)}$`,
        $options: "i",
      },
    });
  }

  return category;
}

// =====================================================
// FIND EXISTING SUBCATEGORY
// =====================================================

async function findExistingSubcategory(categoryId, english, hindi) {
  const englishName = english.trim();

  const hindiName = hindi.trim();

  // IMPORTANT:
  // categoryId must ALWAYS be included.

  let subcategory = await Subcategory.findOne({
    categoryId,

    name: {
      $regex: `^${escapeRegex(englishName)}$`,
      $options: "i",
    },
  });

  if (subcategory) {
    return subcategory;
  }

  // English translation

  subcategory = await Subcategory.findOne({
    categoryId,

    "translations.English": {
      $regex: `^${escapeRegex(englishName)}$`,
      $options: "i",
    },
  });

  if (subcategory) {
    return subcategory;
  }

  // Hindi translation

  if (hindiName) {
    subcategory = await Subcategory.findOne({
      categoryId,

      "translations.Hindi": {
        $regex: `^${escapeRegex(hindiName)}$`,
        $options: "i",
      },
    });
  }

  return subcategory;
}

// =====================================================
// CATEGORY TRANSLATIONS
// =====================================================

async function ensureCategoryTranslations(category, english, hindi) {
  let changed = false;

  if (!category.translations) {
    category.translations = {};
  }

  const existingEnglish = getMapValue(category.translations, "English");

  const existingHindi = getMapValue(category.translations, "Hindi");

  if (!existingEnglish) {
    setMapValue(category.translations, "English", english);

    changed = true;
  }

  if (!existingHindi) {
    setMapValue(category.translations, "Hindi", hindi);

    changed = true;
  }

  if (changed) {
    await category.save();
  }
}

// =====================================================
// SUBCATEGORY TRANSLATIONS
// =====================================================

async function ensureSubcategoryTranslations(
  subcategory,
  english,
  hindi,
  descriptionEnglish,
  descriptionHindi,
) {
  let changed = false;

  // =================================================
  // NAME TRANSLATIONS
  // =================================================

  if (!subcategory.translations) {
    subcategory.translations = {};
  }

  const existingEnglish = getMapValue(subcategory.translations, "English");

  const existingHindi = getMapValue(subcategory.translations, "Hindi");

  if (!existingEnglish) {
    setMapValue(subcategory.translations, "English", english);

    changed = true;
  }

  if (!existingHindi) {
    setMapValue(subcategory.translations, "Hindi", hindi);

    changed = true;
  }

  // =================================================
  // DESCRIPTION TRANSLATIONS
  // =================================================

  if (!subcategory.descriptionTranslations) {
    subcategory.descriptionTranslations = {};
  }

  const existingDescriptionEnglish = getMapValue(
    subcategory.descriptionTranslations,
    "English",
  );

  const existingDescriptionHindi = getMapValue(
    subcategory.descriptionTranslations,
    "Hindi",
  );

  if (descriptionEnglish && !existingDescriptionEnglish) {
    setMapValue(
      subcategory.descriptionTranslations,
      "English",
      descriptionEnglish,
    );

    changed = true;
  }

  if (descriptionHindi && !existingDescriptionHindi) {
    setMapValue(subcategory.descriptionTranslations, "Hindi", descriptionHindi);

    changed = true;
  }

  // =================================================
  // BASE DESCRIPTION
  // =================================================

  if (descriptionEnglish && !subcategory.description) {
    subcategory.description = descriptionEnglish;

    changed = true;
  }

  if (changed) {
    await subcategory.save();
  }
}

// =====================================================
// GET MAP VALUE
// =====================================================

function getMapValue(map, key) {
  if (!map) {
    return "";
  }

  if (typeof map.get === "function") {
    return map.get(key) || "";
  }

  return map[key] || "";
}

// =====================================================
// SET MAP VALUE
// =====================================================

function setMapValue(map, key, value) {
  if (!map) {
    return;
  }

  if (typeof map.set === "function") {
    map.set(key, value);
  } else {
    map[key] = value;
  }
}

// =====================================================
// GET CSV VALUE
// =====================================================

function getValue(row, ...keys) {
  for (const key of keys) {
    const value = row[key];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return "";
}

// =====================================================
// NORMALIZE CSV HEADER
// =====================================================

function normalizeHeader(header) {
  return String(header || "")
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
}

// =====================================================
// NORMALIZE LANGUAGE
// =====================================================

function normalizeLanguage(language) {
  const value = String(language || "")
    .trim()
    .toLowerCase();

  if (value === "english" || value === "en") {
    return "English";
  }

  if (value === "hindi" || value === "hi") {
    return "Hindi";
  }

  return language;
}

// =====================================================
// PARSE BOOLEAN
// =====================================================

function parseBoolean(value, defaultValue = true) {
  if (!value) {
    return defaultValue;
  }

  const normalized = String(value).trim().toLowerCase();

  if (["true", "1", "yes", "y", "active"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n", "inactive"].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

// =====================================================
// ESCAPE REGEX
// =====================================================

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// =====================================================
// REMOVE FILE
// =====================================================

function removeFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log("🗑️ CSV FILE REMOVED:", filePath);
    }
  } catch (error) {
    console.error("Could not remove uploaded CSV:", error.message);
  }
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  bulkUploadQuotes,
};
