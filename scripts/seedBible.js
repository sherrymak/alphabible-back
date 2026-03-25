import mongoose from "mongoose";
import dotenv from "dotenv";
import BibleChapter from "../models/BibleChapter.js";
import bibleData from "../data/fullBible.json" with { type: "json" };

dotenv.config();

const bibleOrder = [
  "genesis","exodus","leviticus","numbers","deuteronomy",
  "joshua","judges","ruth","1 samuel","2 samuel",
  "1 kings","2 kings","1 chronicles","2 chronicles",
  "ezra","nehemiah","esther","job","psalms","proverbs",
  "ecclesiastes","song of solomon","isaiah","jeremiah",
  "lamentations","ezekiel","daniel","hosea","joel","amos",
  "obadiah","jonah","micah","nahum","habakkuk",
  "zephaniah","haggai","zechariah","malachi",
  "matthew","mark","luke","john","acts","romans",
  "1 corinthians","2 corinthians","galatians","ephesians",
  "philippians","colossians","1 thessalonians","2 thessalonians",
  "1 timothy","2 timothy","titus","philemon",
  "hebrews","james","1 peter","2 peter",
  "1 john","2 john","3 john","jude","revelation"
];

const seedBible = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    await BibleChapter.deleteMany();
    console.log("Old chapters deleted");

    const formatted = [];

    bibleData.books.forEach(book => {

      const order = bibleOrder.indexOf(book.book.toLowerCase()) + 1;

      if (order === 0) {
        console.log(`Book not found in order list: ${book.book}`);
        return;
      }

      book.chapters.forEach(chapter => {
        formatted.push({
          book: book.book.toLowerCase(),
          bookOrder: order,
          chapterNumber: chapter.chapterNumber,
          verses: chapter.verses
        });
      });

    });

    await BibleChapter.insertMany(formatted);

    console.log("Bible seeded in correct canonical order ✅");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedBible();