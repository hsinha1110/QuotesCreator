const express = require("express");

const router = express.Router();

const {
  createSticker,
  getAllStickers,
  getStickersByType,
  updateSticker,
  deleteSticker,
} = require("../controllers/stickerController");

router.post("/", createSticker);

router.get("/", getAllStickers);

router.get("/type/:type", getStickersByType);

router.put("/:stickerId", updateSticker);

router.delete("/:stickerId", deleteSticker);

module.exports = router;
