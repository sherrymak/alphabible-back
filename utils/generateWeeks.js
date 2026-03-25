import mongoose from "mongoose";
import dotenv from "dotenv";
import BibleChapter from "../models/BibleChapter.js";
import Week from "../models/week.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const CHAPTERS_PER_WEEK = 22;

const generateWeeks = async () => {
  const chapters = await BibleChapter.find()
    .sort({ bookOrder: 1, chapterNumber: 1 });

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

  console.log("Weeks generated successfully");
  process.exit();
};

generateWeeks();