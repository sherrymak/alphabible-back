import fs from "fs";
import rawData from "../data/fullBible.json" with { type: "json" };

const cleaned = {
  books: []
};

rawData.books.forEach((book, bookIndex) => {

  const cleanBook = {
    book: book.book,
    bookOrder: bookIndex + 1,
    chapters: []
  };

  book.chapters.forEach((chapter, chapterIndex) => {

    // Find real verses (the nested array)
    const nested = chapter.verses.find(v => Array.isArray(v.text));

    if (!nested) return;

    const cleanChapter = {
      chapterNumber: chapterIndex + 1,
      verses: nested.text.map(v => ({
        verseNumber: Number(v.verse),
        text: v.text
      }))
    };

    cleanBook.chapters.push(cleanChapter);

  });

  cleaned.books.push(cleanBook);

});

fs.writeFileSync(
  "./data/fullBibleClean.json",
  JSON.stringify(cleaned, null, 2)
);

console.log("Clean Bible file generated successfully ✅");