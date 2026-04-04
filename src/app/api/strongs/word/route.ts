/**
 * /api/strongs/word?w=created&book=Genesis
 *
 * Reverse-lexicon lookup: given an English KJV word and the book name,
 * searches the Hebrew or Greek Strong's lexicon for matching entries.
 *
 * Works directly from the lexicon files — no pre-tagged Bible text needed.
 * Returns up to 5 best-matching entries, prioritised by match quality.
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

type LexEntry = {
  lemma: string;
  xlit: string;
  pron: string;
  derivation: string;
  strongs_def: string;
  kjv_def: string;
};

type ResultEntry = LexEntry & {
  number: string;
  language: "Hebrew" | "Greek";
  testament: string;
  score: number; // higher = better match
};

// OT books (1–39). All others assumed NT.
const OT_BOOKS = new Set([
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
  "Joshua","Judges","Ruth","1 Samuel","2 Samuel",
  "1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs",
  "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations",
  "Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk",
  "Zephaniah","Haggai","Zechariah","Malachi",
]);

// Lazy-loaded caches
let hebrewLex: Record<string, LexEntry> | null = null;
let greekLex: Record<string, LexEntry> | null = null;

function loadHebrew(): Record<string, LexEntry> {
  if (!hebrewLex) {
    const p = join(process.cwd(), "src", "data", "strongs", "hebrew.json");
    hebrewLex = JSON.parse(readFileSync(p, "utf-8"));
  }
  return hebrewLex!;
}

function loadGreek(): Record<string, LexEntry> {
  if (!greekLex) {
    const p = join(process.cwd(), "src", "data", "strongs", "greek.json");
    greekLex = JSON.parse(readFileSync(p, "utf-8"));
  }
  return greekLex!;
}

/**
 * Score how well a lexicon entry matches the query word.
 * Higher score = better match. Returns 0 if no match.
 *
 * Scoring logic:
 *   10 — query word appears as standalone word in kjv_def (exact token match)
 *    6 — query word appears as prefix in kjv_def (e.g. "creat" matches "created")
 *    3 — query word appears as substring in strongs_def
 *    1 — query word appears anywhere in kjv_def
 */
function scoreEntry(entry: LexEntry, word: string, stem: string): number {
  const kjvLower = entry.kjv_def.toLowerCase();
  const defLower = entry.strongs_def.toLowerCase();

  // Build a token list from kjv_def (split on space, comma, semicolon, etc.)
  const kjvTokens = kjvLower.split(/[\s,;()[\]×.]+/).filter(Boolean);

  let score = 0;

  // Exact token match (highest priority)
  if (kjvTokens.includes(word)) score += 10;
  else if (kjvTokens.includes(stem)) score += 8;
  // Prefix match among tokens
  else if (kjvTokens.some((t) => t.startsWith(word) || word.startsWith(t))) score += 6;
  else if (kjvLower.includes(word)) score += 3;
  else if (kjvLower.includes(stem)) score += 2;

  // Bonus: appears in strongs_def as well
  if (defLower.includes(word) || defLower.includes(stem)) score += 2;

  // Bonus: shorter kjv_def = more focused entry (avoid catch-all entries)
  if (score > 0 && entry.kjv_def.length < 60) score += 1;

  return score;
}

/** Simple English stemmer — strips common suffixes */
function stem(word: string): string {
  return word
    .replace(/ieth$/, "") // cometh → com
    .replace(/eth$/, "")  // loveth → lov
    .replace(/est$/, "")  // doest → do
    .replace(/ness$/, "")
    .replace(/tion$/, "")
    .replace(/ation$/, "")
    .replace(/ing$/, "")
    .replace(/ings$/, "")
    .replace(/ied$/, "y") // carried → carry
    .replace(/ed$/, "")
    .replace(/es$/, "")
    .replace(/s$/, "")
    .replace(/er$/, "")
    .replace(/ly$/, "");
}

function searchLex(
  lex: Record<string, LexEntry>,
  language: "Hebrew" | "Greek",
  testament: string,
  word: string,
  wordStem: string
): ResultEntry[] {
  const results: ResultEntry[] = [];
  for (const [number, entry] of Object.entries(lex)) {
    const score = scoreEntry(entry, word, wordStem);
    if (score > 0) {
      results.push({ number, language, testament, score, ...entry });
    }
  }
  return results;
}

export async function GET(req: NextRequest) {
  const rawWord = req.nextUrl.searchParams.get("w");
  const book = req.nextUrl.searchParams.get("book") ?? "";

  if (!rawWord) {
    return NextResponse.json({ error: "Missing parameter: w (word)" }, { status: 400 });
  }

  const word = rawWord.toLowerCase().trim();
  const wordStem = stem(word);
  const isOT = OT_BOOKS.has(book);

  // Skip extremely common English words that would match everything
  const STOP_WORDS = new Set([
    "the","and","of","a","to","in","is","it","he","she","they","we",
    "I","his","her","my","your","our","their","be","was","were","are",
    "as","at","by","for","from","with","that","this","these","those",
    "or","but","if","so","yet","then","when","who","which","what",
    "not","no","nor","have","has","had","do","did","does","will",
    "would","could","should","may","might","shall","unto","upon","thee",
    "thou","thy","ye","hath","doth","art",
  ]);

  if (STOP_WORDS.has(word) || word.length < 2) {
    return NextResponse.json({ entries: [], stopWord: true });
  }

  try {
    let results: ResultEntry[] = [];

    if (isOT) {
      // OT: search Hebrew first, then Greek (for quotations etc.)
      const hebrewResults = searchLex(loadHebrew(), "Hebrew", "Old Testament", word, wordStem);
      results = hebrewResults;
    } else {
      // NT: search Greek first
      const greekResults = searchLex(loadGreek(), "Greek", "New Testament", word, wordStem);
      results = greekResults;
    }

    // Sort by score descending, take top 5
    results.sort((a, b) => b.score - a.score);
    const top = results.slice(0, 5);

    return NextResponse.json({ entries: top, word: rawWord, book, testament: isOT ? "OT" : "NT" });
  } catch {
    return NextResponse.json(
      {
        error: "Lexicon data not yet downloaded.",
        hint: "Run: npm run setup-strongs  then restart the dev server.",
      },
      { status: 503 }
    );
  }
}
