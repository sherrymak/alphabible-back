import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import weekRoutes from "./routes/weekRoutes.js";
import bibleChapterRoutes from "./routes/bibleChapterRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://alphabible-backend.onrender.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api/weeks", weekRoutes);
app.use("/api/biblechapters", bibleChapterRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Bible API Running" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error"
  });
});


// Connect DB & Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error("Database connection failed", err);
  });