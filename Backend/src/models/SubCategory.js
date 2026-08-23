const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: {
      type: String,
      required: true,
    },

    translations: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

subcategorySchema.index(
  {
    categoryId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
