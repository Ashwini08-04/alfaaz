const Alfaaz = require("../models/Alfaaz");

const getAlfaaz = async (req, res) => {
  try {
    const entries = await Alfaaz.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Alfaaz" });
  }
};

const getSingleAlfaaz = async (req, res) => {
  try {
    const entry = await Alfaaz.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Alfaaz not found" });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Alfaaz" });
  }
};

const createAlfaaz = async (req, res) => {
  try {
    const {
      type,
      title,
      content,
      author,
      favorite,
      lateNight
    } = req.body;

    const entry = await Alfaaz.create({
      type,
      title,
      content,
      author: author || "Ganesh",
      favorite: favorite || false,
      lateNight: lateNight || false
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create Alfaaz" });
  }
};

const updateFavorite = async (req, res) => {
  try {
    const entry = await Alfaaz.findByIdAndUpdate(
      req.params.id,
      { favorite: req.body.favorite },
      { returnDocument: "after" }
    );

    if (!entry) {
      return res.status(404).json({ message: "Alfaaz not found" });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: "Failed to update favorite" });
  }
};

const deleteAlfaaz = async (req, res) => {
  try {
    const entry = await Alfaaz.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Alfaaz not found" });
    }

    res.json({ message: "Alfaaz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete Alfaaz" });
  }
};

module.exports = {
  getAlfaaz,
   getSingleAlfaaz,
  createAlfaaz,
  updateFavorite,
  deleteAlfaaz
};