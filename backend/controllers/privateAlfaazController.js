const PrivateAlfaaz = require("../models/PrivateAlfaaz");

const createPrivateAlfaaz = async (req, res) => {
  try {
    const { type, title, content } = req.body;

    const entry = await PrivateAlfaaz.create({
      type,
      title,
      content
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: "Failed to save private entry" });
  }
};

const getPrivateAlfaaz = async (req, res) => {
  try {
    const entries = await PrivateAlfaaz.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch private entries" });
  }
};

const deletePrivateAlfaaz = async (req, res) => {
  try {
    const entry = await PrivateAlfaaz.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Private entry not found" });
    }

    res.json({ message: "Private entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete private entry" });
  }
};

module.exports = {
  createPrivateAlfaaz,
  getPrivateAlfaaz,
  deletePrivateAlfaaz
};