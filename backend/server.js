const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const privateAlfaazRoutes = require("./routes/privateAlfaazRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const alfaazRoutes = require("./routes/alfaazRoutes");
const memoryRoutes = require("./routes/memoryRoutes");

app.get("/", (req, res) => {
  res.json({ message: "Alfaaz Backend is Running ✨" });
});

app.use("/api/auth", authRoutes);
app.use("/api/alfaaz", alfaazRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/private-alfaaz", privateAlfaazRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});