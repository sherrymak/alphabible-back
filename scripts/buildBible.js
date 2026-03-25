import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFolder = path.join(__dirname, "../data/kjv");
const outputFile = path.join(__dirname, "../data/fullBible.json");

// Canonical 66 Book Order
const bookOrder = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
  "Joshua","Judges","Ruth","1 Samuel","2 Samuel",
  "1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs",
  "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah",
  "Lamentations","Ezekiel","Daniel","Hosea","Joel",
  "Amos","Obadiah","Jonah","Micah","Nahum",
  "Habakkuk","Zephaniah","Haggai","Zechariah","Malachi",
  "Matthew","Mark","Luke","John","Acts",
  "Romans","1 Corinthians","2 Corinthians","Galatians",
  "Ephesians","Philippians","Colossians","1 Thessalonians",
  "2 Thessalonians","1 Timothy","2 Timothy","Titus",
  "Philemon","Hebrews","James","1 Peter","2 Peter",
  "1 John","2 John","3 John","Jude","Revelation"
];

const buildBible = () => {
  console.log("🔄 Building fullBible.json...\n");

  if (!fs.existsSync(inputFolder)) {
    console.error("❌ data/kjv folder not found.");
    process.exit(1);
  }

  const books = [];

  for (let i = 0; i < bookOrder.length; i++) {
    const bookName = bookOrder[i];

    // Remove spaces to match GitHub filenames (e.g. 1Samuel.json)
    const safeFileName = bookName.replace(/ /g, "");
    const filePath = path.join(inputFolder, `${safeFileName}.json`);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ Missing file: ${safeFileName}.json`);
      continue;
    }

    const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Some repos use different structures — adjust here if needed
    const rawChapters = rawData.chapters || rawData;

    const chapters = [];

    for (const chapterKey in rawChapters) {
      const versesObj = rawChapters[chapterKey];

      const verses = Object.keys(versesObj)
        .sort((a, b) => Number(a) - Number(b))
        .map((verseNumber) => ({
          verseNumber: Number(verseNumber),
          text: versesObj[verseNumber]
        }));

      chapters.push({
        chapterNumber: Number(chapterKey),
        verses
      });
    }

    chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

    books.push({
      book: bookName,
      bookOrder: i + 1,
      chapters
    });

    console.log(`✅ Processed: ${bookName}`);
  }

  fs.writeFileSync(outputFile, JSON.stringify({ books }, null, 2));

  console.log("\n🎉 fullBible.json created successfully!");
  console.log(`📁 Location: backend/data/fullBible.json`);
};

buildBible();