const express = require("express");
const upload = require("../middleware/upload");

const {
  createSubcategory,
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/subcategoryController");

const router = express.Router();

router.post("/", upload.single("image"), createSubcategory);

router.get("/", getSubcategories);

router.get("/category/:categoryId", getSubcategoriesByCategory);

router.get("/:id", getSubcategory);

router.put("/:id", upload.single("image"), updateSubcategory);

router.delete("/:id", deleteSubcategory);

module.exports = router;
