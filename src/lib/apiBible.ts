/**
 * api.bible (scripture.api.bible) integration
 *
 * Requires environment variable:
 *   API_BIBLE_KEY=your_key_here   (in .env.local or Vercel env vars)
 *
 * Bible IDs used:
 *   NIV  → 06125adad2d5898a-01  (New International Version)
 *   NKJV → de4e12af7f28f599-02  (New King James Version)
 *   ESV  → f421fe261da7624f-01  (English Standard Version)
 *   NLT  → 65eec8e0b60e656b-01  (New Living Translation)
 *
 * Note: Some translations (NIV, ESV, NLT) require approval from the
 * publisher after you sign up — check your api.bible dashboard.
 */

const API_BIBLE_BASE = "https://api.scripture.api.bible/v1";

/**
 * Map your version codes to api.bible Bible IDs.
 * To find your exact IDs: api.bible dashboard → your app → "Additional Bibles"
 * Or call: GET https://api.scripture.api.bible/v1/bibles  (with your api-key header)
 */
export const API_BIBLE_IDS: Record<string, string> = {
  NIV: "06125adad2d5898a-01",   // New International Version
  NLT: "65eec8e0b60e656b-01",   // New Living Translation
  AMP: "a81b73293d3080c9-01",   // Amplified Bible
};

/** Map canonical book names → api.bible 3-letter USFM codes */
const BOOK_TO_USFM: Record<string, string> = {
  "Genesis": "GEN", "Exodus": "EXO", "Leviticus": "LEV", "Numbers": "NUM",
  "Deuteronomy": "DEU", "Joshua": "JOS", "Judges": "JDG", "Ruth": "RUT",
  "1 Samuel": "1SA", "2 Samuel": "2SA", "1 Kings": "1KI", "2 Kings": "2KI",
  "1 Chronicles": "1CH", "2 Chronicles": "2CH", "Ezra": "EZR",
  "Nehemiah": "NEH", "Esther": "EST", "Job": "JOB", "Psalm": "PSA",
  "Proverbs": "PRO", "Ecclesiastes": "ECC", "Song of Solomon": "SNG",
  "Isaiah": "ISA", "Jeremiah": "JER", "Lamentations": "LAM",
  "Ezekiel": "EZK", "Daniel": "DAN", "Hosea": "HOS", "Joel": "JOL",
  "Amos": "AMO", "Obadiah": "OBA", "Jonah": "JON", "Micah": "MIC",
  "Nahum": "NAM", "Habakkuk": "HAB", "Zephaniah": "ZEP", "Haggai": "HAG",
  "Zechariah": "ZEC", "Malachi": "MAL", "Matthew": "MAT", "Mark": "MRK",
  "Luke": "LUK", "John": "JHN", "Acts": "ACT", "Romans": "ROM",
  "1 Corinthians": "1CO", "2 Corinthians": "2CO", "Galatians": "GAL",
  "Ephesians": "EPH", "Philippians": "PHP", "Colossians": "COL",
  "1 Thessalonians": "1TH", "2 Thessalonians": "2TH",
  "1 Timothy": "1TI", "2 Timothy": "2TI", "Titus": "TIT",
  "Philemon": "PHM", "Hebrews": "HEB", "James": "JAS",
  "1 Peter": "1PE", "2 Peter": "2PE", "1 John": "1JN",
  "2 John": "2JN", "3 John": "3JN", "Jude": "JUD", "Revelation": "REV",
};

/** Strip HTML tags returned by api.bible */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function getHeaders(): HeadersInit {
  const key = process.env.API_BIBLE_KEY;
  if (!key) throw new Error("API_BIBLE_KEY environment variable is not set.");
  return { "api-key": key };
}

export type ApiBibleVerse = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
};

/**
 * Fetch all verses for a chapter from api.bible.
 * Returns verses in the same shape as your local BibleVerse type.
 */
export async function fetchChapter(
  version: string,
  book: string,
  chapter: number
): Promise<{ verses: ApiBibleVerse[]; totalChapters: number }> {
  const bibleId = API_BIBLE_IDS[version];
  if (!bibleId) throw new Error(`Unknown api.bible version: ${version}`);

  const usfm = BOOK_TO_USFM[book];
  if (!usfm) throw new Error(`Unknown book: ${book}`);

  const headers = getHeaders();
  const chapterId = `${usfm}.${chapter}`;

  // Fetch verses for this chapter
  const versesUrl = `${API_BIBLE_BASE}/bibles/${bibleId}/chapters/${chapterId}/verses`;
  const versesRes = await fetch(versesUrl, { headers });
  if (!versesRes.ok) throw new Error(`api.bible verses error: ${versesRes.status}`);
  const versesData = await versesRes.json();

  // Fetch total chapter count for this book
  const chaptersUrl = `${API_BIBLE_BASE}/bibles/${bibleId}/books/${usfm}/chapters`;
  const chaptersRes = await fetch(chaptersUrl, { headers });
  if (!chaptersRes.ok) throw new Error(`api.bible chapters error: ${chaptersRes.status}`);
  const chaptersData = await chaptersRes.json();

  // Chapter list includes an "intro" entry — filter to numeric chapters only
  const totalChapters = chaptersData.data.filter(
    (c: { id: string }) => /\.\d+$/.test(c.id)
  ).length;

  // api.bible /verses returns verse IDs but not text — fetch each verse's text
  // For efficiency we fetch the chapter content instead and parse it
  const contentUrl = `${API_BIBLE_BASE}/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`;
  const contentRes = await fetch(contentUrl, { headers });
  if (!contentRes.ok) throw new Error(`api.bible content error: ${contentRes.status}`);
  const contentData = await contentRes.json();

  // The content comes back as one text block; split by verse number markers [1], [2], etc.
  const rawContent: string = contentData.data?.content ?? "";
  const cleaned = stripHtml(rawContent);

  // Split on verse number markers like "1 " at the start or "  1 " mid-text
  const verseTexts: string[] = [];
  const parts = cleaned.split(/(?=\s*\[\d+\])/);
  for (const part of parts) {
    // Use [\s\S]+ instead of .+ with /s flag for broader TS target compatibility
    const match = part.match(/^\s*\[(\d+)\]\s*([\s\S]+)/);
    if (match) {
      verseTexts[parseInt(match[1], 10)] = match[2].trim();
    }
  }

  // Build structured verse array from the /verses list + parsed text
  const verses: ApiBibleVerse[] = (versesData.data as Array<{ id: string; reference: string }>)
    .map((v) => {
      const verseNum = parseInt(v.id.split(".").pop() ?? "0", 10);
      return {
        id: v.id,
        book,
        chapter,
        verse: verseNum,
        reference: `${book} ${chapter}:${verseNum}`,
        text: verseTexts[verseNum] ?? "",
      };
    })
    .filter((v) => v.text.length > 0);

  return { verses, totalChapters };
}

/**
 * Fetch just the total chapter count for a book.
 */
export async function fetchTotalChapters(version: string, book: string): Promise<number> {
  const bibleId = API_BIBLE_IDS[version];
  if (!bibleId) throw new Error(`Unknown api.bible version: ${version}`);

  const usfm = BOOK_TO_USFM[book];
  if (!usfm) throw new Error(`Unknown book: ${book}`);

  const url = `${API_BIBLE_BASE}/bibles/${bibleId}/books/${usfm}/chapters`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`api.bible error: ${res.status}`);
  const data = await res.json();

  return data.data.filter((c: { id: string }) => /\.\d+$/.test(c.id)).length;
}
