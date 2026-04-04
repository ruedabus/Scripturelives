/**
 * /api/strongs/chapter?book=Genesis&chapter=1
 * Returns the word-level Strong's tagging for a KJV chapter.
 * Each verse contains an array of { w: word, s: strongsNumber | null }.
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const KJV_DIR = join(process.cwd(), "src", "data", "strongs", "kjv");

// Book name → filename prefix map
const BOOK_FILE_MAP: Record<string, string> = {
  "Genesis": "01-genesis",
  "Exodus": "02-exodus",
  "Leviticus": "03-leviticus",
  "Numbers": "04-numbers",
  "Deuteronomy": "05-deuteronomy",
  "Joshua": "06-joshua",
  "Judges": "07-judges",
  "Ruth": "08-ruth",
  "1 Samuel": "09-1-samuel",
  "2 Samuel": "10-2-samuel",
  "1 Kings": "11-1-kings",
  "2 Kings": "12-2-kings",
  "1 Chronicles": "13-1-chronicles",
  "2 Chronicles": "14-2-chronicles",
  "Ezra": "15-ezra",
  "Nehemiah": "16-nehemiah",
  "Esther": "17-esther",
  "Job": "18-job",
  "Psalms": "19-psalms",
  "Proverbs": "20-proverbs",
  "Ecclesiastes": "21-ecclesiastes",
  "Song of Solomon": "22-song-of-solomon",
  "Isaiah": "23-isaiah",
  "Jeremiah": "24-jeremiah",
  "Lamentations": "25-lamentations",
  "Ezekiel": "26-ezekiel",
  "Daniel": "27-daniel",
  "Hosea": "28-hosea",
  "Joel": "29-joel",
  "Amos": "30-amos",
  "Obadiah": "31-obadiah",
  "Jonah": "32-jonah",
  "Micah": "33-micah",
  "Nahum": "34-nahum",
  "Habakkuk": "35-habakkuk",
  "Zephaniah": "36-zephaniah",
  "Haggai": "37-haggai",
  "Zechariah": "38-zechariah",
  "Malachi": "39-malachi",
  "Matthew": "40-matthew",
  "Mark": "41-mark",
  "Luke": "42-luke",
  "John": "43-john",
  "Acts": "44-acts",
  "Romans": "45-romans",
  "1 Corinthians": "46-1-corinthians",
  "2 Corinthians": "47-2-corinthians",
  "Galatians": "48-galatians",
  "Ephesians": "49-ephesians",
  "Philippians": "50-philippians",
  "Colossians": "51-colossians",
  "1 Thessalonians": "52-1-thessalonians",
  "2 Thessalonians": "53-2-thessalonians",
  "1 Timothy": "54-1-timothy",
  "2 Timothy": "55-2-timothy",
  "Titus": "56-titus",
  "Philemon": "57-philemon",
  "Hebrews": "58-hebrews",
  "James": "59-james",
  "1 Peter": "60-1-peter",
  "2 Peter": "61-2-peter",
  "1 John": "62-1-john",
  "2 John": "63-2-john",
  "3 John": "64-3-john",
  "Jude": "65-jude",
  "Revelation": "66-revelation",
};

// Cache loaded book data in memory
const bookCache: Record<string, Record<number, Record<number, { w: string; s: string | null }[]>>> = {};

function loadBook(bookName: string) {
  if (bookCache[bookName]) return bookCache[bookName];

  const fileBase = BOOK_FILE_MAP[bookName];
  if (!fileBase) return null;

  const filePath = join(KJV_DIR, `${fileBase}.json`);
  if (!existsSync(filePath)) return null;

  bookCache[bookName] = JSON.parse(readFileSync(filePath, "utf-8"));
  return bookCache[bookName];
}

export async function GET(req: NextRequest) {
  const book = req.nextUrl.searchParams.get("book");
  const chapter = parseInt(req.nextUrl.searchParams.get("chapter") ?? "0", 10);

  if (!book || !chapter) {
    return NextResponse.json({ error: "Missing parameters: book and chapter" }, { status: 400 });
  }

  try {
    const bookData = loadBook(book);
    if (!bookData) {
      return NextResponse.json(
        {
          error: "Word-study data not available.",
          hint: "Run: npm run setup-strongs  then restart the dev server.",
        },
        { status: 503 }
      );
    }

    const chapterData = bookData[chapter];
    if (!chapterData) {
      return NextResponse.json({ error: `Chapter ${chapter} not found in ${book}` }, { status: 404 });
    }

    return NextResponse.json({ verses: chapterData });
  } catch {
    return NextResponse.json({ error: "Failed to load word-study data" }, { status: 500 });
  }
}
