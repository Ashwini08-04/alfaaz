const mongoose = require("mongoose");

const privateAlfaazSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Thought", "Note", "Letter", "Chat"],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: "Ganesh"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrivateAlfaaz", privateAlfaazSchema);