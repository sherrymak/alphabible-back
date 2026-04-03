import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import weekRoutes from "./routes/weekRoutes.js";
import bibleChapterRoutes from "./routes/bibleChapterRoutes.js";
import Week from "./models/week.js";
import BibleChapter from "./models/BibleChapter.js";

dotenv.config();

const app = express();

// Function to generate weeks from chapters
const generateWeeks = async () => {
  try {
    const weekCount = await Week.countDocuments();
    if (weekCount > 0) {
      console.log(`Weeks already exist (${weekCount} weeks found)`);
      return;
    }

    console.log("Generating weeks from chapters...");
    const chapters = await BibleChapter.find()
      .sort({ bookOrder: 1, chapterNumber: 1 });

    if (chapters.length === 0) {
      console.log("No chapters found. Please seed the Bible first.");
      return;
    }

    const CHAPTERS_PER_WEEK = 22;
    let weekNumber = 1;

    for (let i = 0; i < chapters.length; i += CHAPTERS_PER_WEEK) {
      const slice = chapters.slice(i, i + CHAPTERS_PER_WEEK);

      await Week.create({
        weekNumber,
        chapters: slice.map(c => c._id),
        startChapter: `${slice[0].book} ${slice[0].chapterNumber}`,
        endChapter: `${slice[slice.length - 1].book} ${slice[slice.length - 1].chapterNumber}`
      });

      weekNumber++;
    }

    console.log(`✅ Successfully generated ${weekNumber - 1} weeks`);
  } catch (error) {
    console.error("Error generating weeks:", error);
  }
};

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://alphafront.vercel.app",
    "https://alphabible.netlify.app"
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
  .then(async () => {
    console.log("MongoDB Connected");
    await generateWeeks();
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => {
    console.error("Database connection failed", err);
  });

