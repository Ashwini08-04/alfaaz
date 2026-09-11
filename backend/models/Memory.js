const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: ""
    },
    imagePublicId: {
      type: String,
      default: ""
    },
    favorite: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memory", memorySchema);