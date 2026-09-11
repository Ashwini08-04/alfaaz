const mongoose = require("mongoose");

const alfaazSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Poetry", "Shayari", "Note", "Thought", "Letter"],
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
    },
    favorite: {
      type: Boolean,
      default: false
    },
    lateNight: {
    type: Boolean,
    default: false
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alfaaz", alfaazSchema);