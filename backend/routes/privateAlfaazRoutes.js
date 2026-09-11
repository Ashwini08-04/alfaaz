const express = require("express");

const {
  createPrivateAlfaaz,
  getPrivateAlfaaz,
  deletePrivateAlfaaz
} = require("../controllers/privateAlfaazController");

const router = express.Router();

router.get("/", getPrivateAlfaaz);
router.post("/", createPrivateAlfaaz);
router.delete("/:id", deletePrivateAlfaaz);

module.exports = router;