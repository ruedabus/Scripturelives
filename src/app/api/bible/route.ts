import { NextRequest, NextResponse } from "next/server";
import { loadBible, BibleVersion } from "@/lib/loadBibleVersion";
import { API_BIBLE_IDS, fetchChapter, fetchTotalChapters } from "@/lib/apiBible";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

/** Versions served locally vs. via api.bible */
const LOCAL_VERSIONS = ["KJV", "ASV", "WEB"];
const REMOTE_VERSIONS = Object.keys(API_BIBLE_IDS); // NIV, NKJV, ESV, NLT

export const CANONICAL_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalm", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah",
  "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans",
  "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
  "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation",
];

function getChapterCount(version: BibleVersion, book: string): number {
  const bible = loadBible(version);
  const chapters = new Set(bible.filter((v) => v.book === book).map((v) => v.chapter));
  return chapters.size > 0 ? Math.max(...chapters) : 0;
}

export async function GET(req: NextRequest) {
  // ── Rate limit: 60 req / min per IP ───────────────────────────────────────
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 60, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetMs - Date.now()) / 1000)) } }
    );
  }

  const { searchParams } = new URL(req.url);
  const version = (searchParams.get("version") ?? "KJV").toUpperCase();
  const book = searchParams.get("book");
  const chapterParam = searchParams.get("chapter");

  // ── Validate book against canonical list ──────────────────────────────────
  if (book && !CANONICAL_BOOKS.includes(book)) {
    return NextResponse.json({ error: "Invalid book name." }, { status: 400 });
  }

  // ── Validate chapter range ─────────────────────────────────────────────────
  if (chapterParam !== null) {
    const ch = parseInt(chapterParam, 10);
    if (isNaN(ch) || ch < 1 || ch > 150) {
      return NextResponse.json({ error: "Invalid chapter number." }, { status: 400 });
    }
  }

  const isLocal = LOCAL_VERSIONS.includes(version);
  const isRemote = REMOTE_VERSIONS.includes(version);

  if (!isLocal && !isRemote) {
    return NextResponse.json({ error: "Invalid version" }, { status: 400 });
  }

  // ── REMOTE (api.bible) versions ─────────────────────────────────────────
  if (isRemote) {
    // Book list: same 66 books for all versions — return using local KJV chapter counts
    if (!book) {
      const bible = loadBible("KJV");
      const chaptersByBook = new Map<string, Set<number>>();
      for (const v of bible) {
        if (!CANONICAL_BOOKS.includes(v.book)) continue;
        if (!chaptersByBook.has(v.book)) chaptersByBook.set(v.book, new Set());
        chaptersByBook.get(v.book)!.add(v.chapter);
      }
      const books = CANONICAL_BOOKS.filter((b) => chaptersByBook.has(b)).map((b) => ({
        name: b,
        chapters: Math.max(...chaptersByBook.get(b)!),
      }));
      return NextResponse.json({ books });
    }

    // Chapter content
    if (book && chapterParam) {
      const chapter = parseInt(chapterParam, 10);
      if (isNaN(chapter)) return NextResponse.json({ error: "Invalid chapter" }, { status: 400 });
      try {
        const { verses, totalChapters } = await fetchChapter(version, book, chapter);
        return NextResponse.json({ verses, totalChapters });
      } catch (err) {
        console.error("[bible] fetchChapter error:", err);
        return NextResponse.json({ error: "Failed to load chapter." }, { status: 502 });
      }
    }

    // Chapter count only
    if (book) {
      try {
        const totalChapters = await fetchTotalChapters(version, book);
        return NextResponse.json({ totalChapters });
      } catch (err) {
        console.error("[bible] fetchTotalChapters error:", err);
        return NextResponse.json({ error: "Failed to load chapter count." }, { status: 502 });
      }
    }
  }

  // ── LOCAL versions (KJV, ASV, WEB) ──────────────────────────────────────
  const localVersion = version as BibleVersion;

  // Return book list with chapter counts
  if (!book) {
    const bible = loadBible(localVersion);
    const chaptersByBook = new Map<string, Set<number>>();
    for (const v of bible) {
      if (!CANONICAL_BOOKS.includes(v.book)) continue;
      if (!chaptersByBook.has(v.book)) chaptersByBook.set(v.book, new Set());
      chaptersByBook.get(v.book)!.add(v.chapter);
    }
    const books = CANONICAL_BOOKS.filter((b) => chaptersByBook.has(b)).map((b) => ({
      name: b,
      chapters: Math.max(...chaptersByBook.get(b)!),
    }));
    return NextResponse.json({ books });
  }

  // Return verses for a specific chapter
  if (book && chapterParam) {
    const chapter = parseInt(chapterParam, 10);
    if (isNaN(chapter)) return NextResponse.json({ error: "Invalid chapter" }, { status: 400 });

    const bible = loadBible(localVersion);
    const verses = bible.filter((v) => v.book === book && v.chapter === chapter);
    const totalChapters = getChapterCount(localVersion, book);
    return NextResponse.json({ verses, totalChapters });
  }

  // Return just chapter count for a book
  if (book) {
    const totalChapters = getChapterCount(localVersion, book);
    return NextResponse.json({ totalChapters });
  }

  return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
}
