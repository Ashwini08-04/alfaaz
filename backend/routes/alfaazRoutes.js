const express = require("express");

const {
  getAlfaaz,
  getSingleAlfaaz,
  createAlfaaz,
  updateFavorite,
  deleteAlfaaz
} = require("../controllers/alfaazController");

const router = express.Router();

router.get("/", getAlfaaz);
router.get("/:id", getSingleAlfaaz);
router.post("/", createAlfaaz);
router.put("/:id", updateFavorite);
router.delete("/:id", deleteAlfaaz);

module.exports = router;