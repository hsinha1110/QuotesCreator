const express = require("express");

const subcategoryController = require("../controllers/subcategoryController");

console.log("SUBCATEGORY CONTROLLER:", subcategoryController);

const router = express.Router();

router.post("/", subcategoryController.createSubcategory);

router.get("/", subcategoryController.getSubcategories);

router.get(
  "/category/:categoryId",
  subcategoryController.getSubcategoriesByCategory,
);

router.get("/:id", subcategoryController.getSubcategory);

router.put("/:id", subcategoryController.updateSubcategory);

router.delete("/:id", subcategoryController.deleteSubcategory);

module.exports = router;
