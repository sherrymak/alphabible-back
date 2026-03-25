import express from "express";
import {
  createBibleChapter,
  getAllBibleChapters,
  getBibleChapter,
  updateBibleChapter,
  deleteBibleChapter,
  searchVerses
} from "../controllers/bibleChapterController.js";

const router = express.Router();

// CRUD routes
router.post("/", createBibleChapter);
router.get("/", getAllBibleChapters); // optional ?page & ?limit
router.get("/search", searchVerses); // ?query=In+the+beginning
router.get("/:bookOrder/:chapterNumber", getBibleChapter);
router.put("/:id", updateBibleChapter);
router.delete("/:id", deleteBibleChapter);

export default router;
