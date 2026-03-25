import mongoose from "mongoose";

const weekSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
    unique: true
  },
  chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BibleChapter"
    }
  ],
  startChapter: String,
  endChapter: String
}, { timestamps: true });

export default mongoose.model("Week", weekSchema);