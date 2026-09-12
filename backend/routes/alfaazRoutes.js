const express = require("express");

const {
  getAlfaaz,
  getSingleAlfaaz,
  createAlfaaz,
  updateFavorite,
  deleteAlfaaz
} = require("../controllers/alfaazController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAlfaaz);
router.get("/:id", protect, getSingleAlfaaz);
router.post("/", protect, createAlfaaz);
router.put("/:id", protect, updateFavorite);
router.delete("/:id", protect, deleteAlfaaz);

module.exports = router;