import mongoose from "mongoose";

const verseSchema = new mongoose.Schema(
  {
    verseNumber: { type: Number, required: true },
    text: { type: String, required: true }
  },
  { _id: false }
);

const bibleChapterSchema = new mongoose.Schema(
  {
    book: { type: String, required: true, lowercase: true }, // store lowercase
    bookOrder: { type: Number, required: true },
    chapterNumber: { type: Number, required: true },
    verses: { type: [verseSchema], required: true }
  },
  { timestamps: true }
);

// Unique index on book + chapter
bibleChapterSchema.index({ bookOrder: 1, chapterNumber: 1 }, { unique: true });

// Text index for verse search
bibleChapterSchema.index({ "verses.text": "text" });

const BibleChapter = mongoose.model("BibleChapter", bibleChapterSchema);

export default BibleChapter;