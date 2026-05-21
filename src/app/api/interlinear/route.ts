/**
 * /api/interlinear?book=John&chapter=3&verse=16
 * /api/interlinear?book=John&chapter=3              ← whole chapter
 *
 * Returns word-level interlinear data for a KJV verse or chapter.
 * Each token: { english, original, xlit, strongs, gloss, isOT }
 *
 * Primary: STEPBible API (word-precise tagged data)
 * Fallback: local Strong's reverse-index lookup
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { loadBible } from "@/lib/loadBibleVersion";

// ── Types ────────────────────────────────────────────────────────────────────

type LexEntry = {
  lemma: string;
  xlit:  string;
  pron:  string;
  strongs_def: string;
  kjv_def:     string;
};

export type InterlinearWord = {
  english:   string;   // KJV surface word
  original:  string;   // Greek or Hebrew script
  xlit:      string;   // transliteration
  strongs:   string;   // e.g. "G2316" or "H430"
  gloss:     string;   // short English gloss
  morph?:    string;   // morphological code (when available)
  isOT:      boolean;
};

export type InterlinearVerse = {
  book:    string;
  chapter: number;
  verse:   number;
  ref:     string;     // "John 3:16"
  isOT:    boolean;
  words:   InterlinearWord[];
};

// ── OT book set ──────────────────────────────────────────────────────────────

const OT_BOOKS = new Set([
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
  "Joshua","Judges","Ruth","1 Samuel","2 Samuel",
  "1 Kings","2 Kings","1 Chronicles","2 Chronicles",
  "Ezra","Nehemiah","Esther","Job","Psalm","Proverbs",
  "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah",
  "Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk",
  "Zephaniah","Haggai","Zechariah","Malachi",
]);

// ── Book name → STEPBible abbreviation ──────────────────────────────────────

const BOOK_TO_STEP: Record<string, string> = {
  "Genesis":"Gen","Exodus":"Exod","Leviticus":"Lev","Numbers":"Num",
  "Deuteronomy":"Deut","Joshua":"Josh","Judges":"Judg","Ruth":"Ruth",
  "1 Samuel":"1Sam","2 Samuel":"2Sam","1 Kings":"1Kgs","2 Kings":"2Kgs",
  "1 Chronicles":"1Chr","2 Chronicles":"2Chr","Ezra":"Ezra",
  "Nehemiah":"Neh","Esther":"Esth","Job":"Job","Psalm":"Ps",
  "Proverbs":"Prov","Ecclesiastes":"Eccl","Song of Solomon":"Song",
  "Isaiah":"Isa","Jeremiah":"Jer","Lamentations":"Lam","Ezekiel":"Ezek",
  "Daniel":"Dan","Hosea":"Hos","Joel":"Joel","Amos":"Amos",
  "Obadiah":"Obad","Jonah":"Jonah","Micah":"Mic","Nahum":"Nah",
  "Habakkuk":"Hab","Zephaniah":"Zeph","Haggai":"Hag","Zechariah":"Zech",
  "Malachi":"Mal","Matthew":"Matt","Mark":"Mark","Luke":"Luke",
  "John":"John","Acts":"Acts","Romans":"Rom",
  "1 Corinthians":"1Cor","2 Corinthians":"2Cor","Galatians":"Gal",
  "Ephesians":"Eph","Philippians":"Phil","Colossians":"Col",
  "1 Thessalonians":"1Thess","2 Thessalonians":"2Thess",
  "1 Timothy":"1Tim","2 Timothy":"2Tim","Titus":"Titus",
  "Philemon":"Phlm","Hebrews":"Heb","James":"Jas",
  "1 Peter":"1Pet","2 Peter":"2Pet","1 John":"1John",
  "2 John":"2John","3 John":"3John","Jude":"Jude","Revelation":"Rev",
};

// ── Lexicon loaders (cached) ─────────────────────────────────────────────────

let _greek:  Record<string, LexEntry> | null = null;
let _hebrew: Record<string, LexEntry> | null = null;

function loadGreek()  { if (!_greek)  { const p = join(process.cwd(),"src","data","strongs","greek.json");  _greek  = JSON.parse(readFileSync(p,"utf-8")); } return _greek!; }
function loadHebrew() { if (!_hebrew) { const p = join(process.cwd(),"src","data","strongs","hebrew.json"); _hebrew = JSON.parse(readFileSync(p,"utf-8")); } return _hebrew!; }

// ── Reverse index: kjv_def word → [(strongsNum, score)] ──────────────────────

type RevEntry = { num: string; entry: LexEntry };
let _greekRev:  Map<string, RevEntry[]> | null = null;
let _hebrewRev: Map<string, RevEntry[]> | null = null;

function buildRevIndex(lex: Record<string, LexEntry>): Map<string, RevEntry[]> {
  const map = new Map<string, RevEntry[]>();
  for (const [num, entry] of Object.entries(lex)) {
    const tokens = entry.kjv_def
      .toLowerCase()
      .split(/[\s,;()[\]×.]+/)
      .filter((t) => t.length > 1);
    for (const tok of tokens) {
      if (!map.has(tok)) map.set(tok, []);
      map.get(tok)!.push({ num, entry });
    }
  }
  return map;
}

function getGreekRev()  { if (!_greekRev)  _greekRev  = buildRevIndex(loadGreek());  return _greekRev!; }
function getHebrewRev() { if (!_hebrewRev) _hebrewRev = buildRevIndex(loadHebrew()); return _hebrewRev!; }

// ── Simple English stemmer ───────────────────────────────────────────────────

function stem(w: string): string {
  return w
    .replace(/ieth$/, "").replace(/eth$/, "").replace(/est$/, "")
    .replace(/ness$/, "").replace(/ation$/, "").replace(/tion$/, "")
    .replace(/ings?$/, "").replace(/ied$/, "y").replace(/ed$/, "")
    .replace(/es$/, "").replace(/er$/, "").replace(/ly$/, "").replace(/s$/, "");
}

// ── Local fallback: look up one KJV word ────────────────────────────────────

function localLookup(word: string, isOT: boolean): InterlinearWord | null {
  const rev = isOT ? getHebrewRev() : getGreekRev();
  const lex = isOT ? loadHebrew()   : loadGreek();
  const w   = word.toLowerCase().replace(/[^a-z]/g, "");
  const s   = stem(w);
  if (!w) return null;

  // Skip trivial stop-words (handled as empty tokens by the display)
  const STOP = new Set(["the","a","an","and","of","in","to","that","is","are","was","were","be","by","for","with","his","her","their","our","your","its","not","but","as","at","on","or","if","so","it","he","she","we","i","thou","thee","ye","thy","thine"]);
  if (STOP.has(w)) return null;

  const candidates: { num: string; entry: LexEntry; score: number }[] = [];
  for (const lookup of [w, s]) {
    const hits = rev.get(lookup) ?? [];
    for (const { num, entry } of hits) {
      const existing = candidates.find((c) => c.num === num);
      if (!existing) {
        candidates.push({ num, entry, score: lookup === w ? 10 : 7 });
      }
    }
  }
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  const prefix = isOT ? "H" : "G";

  // Verify the num has the right prefix
  const matchingNum = best.num.startsWith(prefix) ? best.num :
    candidates.find((c) => c.num.startsWith(prefix))?.num;
  if (!matchingNum) return null;
  const matchEntry = lex[matchingNum] ?? best.entry;

  return {
    english:  word,
    original: matchEntry.lemma,
    xlit:     matchEntry.xlit,
    strongs:  matchingNum,
    gloss:    (matchEntry.kjv_def.split(/[;,(]/)[0] ?? "").trim().slice(0, 40),
    isOT,
  };
}

// ── STEPBible API (primary) ──────────────────────────────────────────────────

async function fetchFromStep(
  book: string,
  chapter: number,
  verse: number | null,
  isOT: boolean
): Promise<InterlinearVerse[] | null> {
  const stepAbbr = BOOK_TO_STEP[book];
  if (!stepAbbr) return null;

  const version = isOT ? "THOT" : "TGNT";
  const ref     = verse
    ? `${stepAbbr}.${chapter}.${verse}`
    : `${stepAbbr}.${chapter}`;

  const url = `https://api.stepbible.org/v1/rest/passage/text?version=${version}&reference=${encodeURIComponent(ref)}&options=VHN`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ScriptureLives/1.0" },
      signal: AbortSignal.timeout(6000),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    if (!res.ok) return null;
    const data = await res.json();

    // STEPBible wraps content in passageText.passage (HTML)
    const html: string = data?.passageText?.passage ?? "";
    if (!html) return null;

    // Parse word spans: <span class="w" data-strong="G2316" data-morph="...">word</span>
    // or strong numbers embedded as data attributes on various span types
    return parseStepHtml(html, book, chapter, isOT);
  } catch {
    return null;
  }
}

function parseStepHtml(html: string, book: string, chapter: number, isOT: boolean): InterlinearVerse[] {
  const results: InterlinearVerse[] = [];
  const lex = isOT ? loadHebrew() : loadGreek();

  // Match verse containers: data-verse-num="N"
  const verseBlocks = [...html.matchAll(/data-verse-num="(\d+)"[^>]*>([\s\S]*?)(?=data-verse-num="\d+"|$)/g)];

  for (const [, vNum, block] of verseBlocks) {
    const verseNum = parseInt(vNum, 10);
    const words: InterlinearWord[] = [];

    // Extract word spans with Strong's numbers
    const wordRegex = /data-strong="([^"]+)"[^>]*data-morph="([^"]*)"[^>]*>.*?<span[^>]*>([^<]+)<\/span>/g;
    for (const [, strong, morph, original] of [...block.matchAll(wordRegex)]) {
      // Also try to find the gloss from the interlinear gloss span
      const lexEntry = lex[strong];
      if (!lexEntry) continue;
      words.push({
        english:  lexEntry.kjv_def.split(/[;,(]/)[0]?.trim().slice(0,30) ?? "",
        original: original.trim(),
        xlit:     lexEntry.xlit,
        strongs:  strong,
        gloss:    lexEntry.kjv_def.split(/[;,(]/)[0]?.trim().slice(0,40) ?? "",
        morph:    morph || undefined,
        isOT,
      });
    }

    if (words.length > 0) {
      results.push({
        book, chapter, verse: verseNum,
        ref: `${book} ${chapter}:${verseNum}`,
        isOT,
        words,
      });
    }
  }

  return results;
}

// ── Local fallback: build interlinear from KJV text ──────────────────────────

function localInterlinear(
  text: string,
  book: string,
  chapter: number,
  verse: number,
  isOT: boolean
): InterlinearVerse {
  // Tokenise: preserve punctuation-stripped words in order
  const raw = text.split(/\s+/).filter(Boolean);
  const words: InterlinearWord[] = [];

  for (const token of raw) {
    const clean = token.replace(/[^a-zA-Z']/g, "");
    if (!clean) continue;
    const hit = localLookup(clean, isOT);
    if (hit) {
      words.push({ ...hit, english: token }); // keep original punctuation in display
    } else {
      // Still show the word, just without original language data
      words.push({
        english:  token,
        original: "",
        xlit:     "",
        strongs:  "",
        gloss:    "",
        isOT,
      });
    }
  }

  return { book, chapter, verse, ref: `${book} ${chapter}:${verse}`, isOT, words };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const book    = searchParams.get("book");
  const chapter = parseInt(searchParams.get("chapter") ?? "0", 10);
  const verse   = searchParams.get("verse") ? parseInt(searchParams.get("verse")!, 10) : null;

  if (!book || !chapter || isNaN(chapter)) {
    return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
  }

  const isOT = OT_BOOKS.has(book);

  // ── 1. Try STEPBible (word-precise) ──────────────────────────────────────
  const stepResult = await fetchFromStep(book, chapter, verse, isOT);
  if (stepResult && stepResult.length > 0) {
    const filtered = verse ? stepResult.filter((v) => v.verse === verse) : stepResult;
    if (filtered.length > 0) {
      return NextResponse.json({ verses: filtered, source: "step" });
    }
  }

  // ── 2. Local fallback ────────────────────────────────────────────────────
  try {
    const kjv      = loadBible("KJV");
    const filtered = kjv.filter(
      (v) => v.book === book && v.chapter === chapter && (verse == null || v.verse === verse)
    );

    const verses: InterlinearVerse[] = filtered.map((v) =>
      localInterlinear(
        v.text ?? "",
        book,
        chapter,
        v.verse,
        isOT
      )
    );

    return NextResponse.json({ verses, source: "local" });
  } catch (err) {
    console.error("[interlinear] local fallback failed:", err);
    return NextResponse.json({ error: "Could not load interlinear data" }, { status: 500 });
  }
}
