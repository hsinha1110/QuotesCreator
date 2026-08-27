const mongoose = require("mongoose");

// ======================================================
// SUBCATEGORY SCHEMA
// ======================================================

const subcategorySchema = new mongoose.Schema(
  {
    // ==================================================
    // CATEGORY RELATION
    // ==================================================

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    // ==================================================
    // CANONICAL NAME
    // ==================================================
    // English name is stored here
    // Example: Self Motivation

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ==================================================
    // DEFAULT DESCRIPTION
    // ==================================================
    // English/default description

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // ==================================================
    // NAME TRANSLATIONS
    // ==================================================
    // ONLY English + Hindi

    translations: {
      type: Map,
      of: {
        type: String,
        trim: true,
      },
      default: {},
    },

    // ==================================================
    // DESCRIPTION TRANSLATIONS
    // ==================================================
    // ONLY English + Hindi

    descriptionTranslations: {
      type: Map,
      of: {
        type: String,
        trim: true,
      },
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// ======================================================
// UNIQUE SUBCATEGORY INSIDE CATEGORY
// ======================================================

subcategorySchema.index(
  {
    categoryId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

// ======================================================
// EXPORT
// ======================================================

module.exports = mongoose.model("Subcategory", subcategorySchema);
