const express = require("express");
const multer = require("multer");

const {
  getMemories,
  createMemory,
  updateFavorite,
  deleteMemory
} = require("../controllers/memoryController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif"
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  }
});

router.get("/", getMemories);
router.post("/", upload.single("image"), createMemory);
router.put("/:id", updateFavorite);
router.delete("/:id", deleteMemory);

module.exports = router;