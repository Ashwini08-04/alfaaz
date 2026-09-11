const Memory = require("../models/Memory");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "alfaaz/memories",
        resource_type: "image"
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });

const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch memories" });
  }
};

const createMemory = async (req, res) => {
  try {
    const { title, date, text } = req.body;

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const memory = await Memory.create({
      title,
      date,
      text,
      imageUrl,
      imagePublicId
    });

    res.status(201).json(memory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create memory" });
  }
};

const updateFavorite = async (req, res) => {
  try {
    const memory = await Memory.findByIdAndUpdate(
      req.params.id,
      { favorite: req.body.favorite },
      { returnDocument: "after" }
    );

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: "Failed to update favorite" });
  }
};

const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findByIdAndDelete(req.params.id);

    if (!memory) {
      return res.status(404).json({ message: "Memory not found" });
    }

    if (memory.imagePublicId) {
      await cloudinary.uploader.destroy(memory.imagePublicId);
    }

    res.json({ message: "Memory deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete memory" });
  }
};

module.exports = {
  getMemories,
  createMemory,
  updateFavorite,
  deleteMemory
};