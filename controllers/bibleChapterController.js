import BibleChapter from "../models/BibleChapter.js";

/**
 * Create a new Bible chapter
 */
export const createBibleChapter = async (req, res) => {
  try {
    const { book,bookOrder,chapterNumber, verses } = req.body;

    const chapter = await BibleChapter.create({
      book: book.toLowerCase(),
      bookOrder: Number(bookOrder),
      chapterNumber: Number(chapterNumber),
    
      verses
    });

    res.status(201).json(chapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get all chapters (with optional pagination)
 */
export const getAllBibleChapters = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const chapters = await BibleChapter.find()
      .sort({ bookOrder: 1, chapterNumber: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single chapter by book + chapter number (case-insensitive)
 */
export const getBibleChapter = async (req, res) => {
  try {
    const { bookOrder, chapterNumber } = req.params;

    const chapter = await BibleChapter.findOne({
      bookOrder: Number(bookOrder),
      chapterNumber: Number(chapterNumber)
    });

     if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found"
      });
    }

    res.status(200).json({
      success: true,
      data: chapter
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update a chapter
 */
export const updateBibleChapter = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedChapter = await BibleChapter.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedChapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.status(200).json(updatedChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete a chapter
 */
export const deleteBibleChapter = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedChapter = await BibleChapter.findByIdAndDelete(id);

    if (!deletedChapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Search verses by text
 */
export const searchVerses = async (req, res) => {
  try {
    const { query } = req.query;

    const chapters = await BibleChapter.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};