/**
 * GET /api/bible/search?q=...&version=KJV&limit=30
 *
 * Local  (KJV, ASV, WEB)  — filter the LRU-cached JSON.
 * Remote (NIV, NLT, AMP, RVR1960) — proxy to api.bible /search endpoint.
 *
 * Also supports reference lookups like "John 3:16" for local versions.
 *
 * Returns: { results: BibleSearchResult[], total: number, query: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { loadBible } from "@/lib/loadBibleVersion";
import { API_BIBLE_IDS } from "@/lib/apiBible";
import { CANONICAL_BOOKS } from "@/app/api/bible/route";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export type BibleSearchResult = {
  book:      string;
  chapter:   number;
  verse:     number;
  reference: string;
  text:      string;
};

const LOCAL_VERSIONS = ["KJV", "ASV", "WEB"] as const;
const MAX_RESULTS    = 50;

// ── Reference parsing ("John 3:16", "Ps 23", "Gen 1:1") ──────────────────────

const BOOK_ALIASES: Record<string, string> = {
  gen:"Genesis",genesis:"Genesis",exo:"Exodus",exod:"Exodus",exodus:"Exodus",
  lev:"Leviticus",leviticus:"Leviticus",num:"Numbers",numbers:"Numbers",
  deu:"Deuteronomy",deut:"Deuteronomy",deuteronomy:"Deuteronomy",
  jos:"Joshua",josh:"Joshua",joshua:"Joshua",jdg:"Judges",judg:"Judges",judges:"Judges",
  rut:"Ruth",ruth:"Ruth",
  "1sa":"1 Samuel","1sam":"1 Samuel","1samuel":"1 Samuel",
  "2sa":"2 Samuel","2sam":"2 Samuel","2samuel":"2 Samuel",
  "1ki":"1 Kings","1kgs":"1 Kings","1kings":"1 Kings",
  "2ki":"2 Kings","2kgs":"2 Kings","2kings":"2 Kings",
  "1ch":"1 Chronicles","1chr":"1 Chronicles","1chronicles":"1 Chronicles",
  "2ch":"2 Chronicles","2chr":"2 Chronicles","2chronicles":"2 Chronicles",
  ezr:"Ezra",ezra:"Ezra",neh:"Nehemiah",nehemiah:"Nehemiah",
  est:"Esther",esth:"Esther",esther:"Esther",job:"Job",
  psa:"Psalm",ps:"Psalm",psalm:"Psalm",psalms:"Psalm",
  pro:"Proverbs",prov:"Proverbs",proverbs:"Proverbs",
  ecc:"Ecclesiastes",eccl:"Ecclesiastes",ecclesiastes:"Ecclesiastes",
  sng:"Song of Solomon",song:"Song of Solomon",sos:"Song of Solomon",
  isa:"Isaiah",isaiah:"Isaiah",jer:"Jeremiah",jeremiah:"Jeremiah",
  lam:"Lamentations",lamentations:"Lamentations",
  ezk:"Ezekiel",ezek:"Ezekiel",ezekiel:"Ezekiel",
  dan:"Daniel",daniel:"Daniel",hos:"Hosea",hosea:"Hosea",
  joe:"Joel",joel:"Joel",amo:"Amos",amos:"Amos",
  oba:"Obadiah",obad:"Obadiah",obadiah:"Obadiah",
  jon:"Jonah",jonah:"Jonah",mic:"Micah",micah:"Micah",
  nam:"Nahum",nahum:"Nahum",hab:"Habakkuk",habakkuk:"Habakkuk",
  zep:"Zephaniah",zeph:"Zephaniah",zephaniah:"Zephaniah",
  hag:"Haggai",haggai:"Haggai",zec:"Zechariah",zech:"Zechariah",zechariah:"Zechariah",
  mal:"Malachi",malachi:"Malachi",
  mat:"Matthew",matt:"Matthew",matthew:"Matthew",
  mrk:"Mark",mark:"Mark",luk:"Luke",luke:"Luke",
  jhn:"John",john:"John",act:"Acts",acts:"Acts",
  rom:"Romans",romans:"Romans",
  "1co":"1 Corinthians","1cor":"1 Corinthians","1corinthians":"1 Corinthians",
  "2co":"2 Corinthians","2cor":"2 Corinthians","2corinthians":"2 Corinthians",
  gal:"Galatians",galatians:"Galatians",eph:"Ephesians",ephesians:"Ephesians",
  php:"Philippians",phil:"Philippians",philippians:"Philippians",
  col:"Colossians",colossians:"Colossians",
  "1th":"1 Thessalonians","1thess":"1 Thessalonians","1thessalonians":"1 Thessalonians",
  "2th":"2 Thessalonians","2thess":"2 Thessalonians","2thessalonians":"2 Thessalonians",
  "1ti":"1 Timothy","1tim":"1 Timothy","1timothy":"1 Timothy",
  "2ti":"2 Timothy","2tim":"2 Timothy","2timothy":"2 Timothy",
  tit:"Titus",titus:"Titus",phm:"Philemon",phlm:"Philemon",philemon:"Philemon",
  heb:"Hebrews",hebrews:"Hebrews",jas:"James",james:"James",
  "1pe":"1 Peter","1pet":"1 Peter","1peter":"1 Peter",
  "2pe":"2 Peter","2pet":"2 Peter","2peter":"2 Peter",
  "1jn":"1 John","1john":"1 John",
  "2jn":"2 John","2john":"2 John",
  "3jn":"3 John","3john":"3 John",
  jud:"Jude",jude:"Jude",rev:"Revelation",revelation:"Revelation",
};

function parseReference(query: string): { book: string; chapter: number; verse?: number } | null {
  const m = query.trim().match(/^(\d\s*)?([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\s+(\d+)(?::(\d+))?$/);
  if (!m) return null;
  const rawBook = ((m[1] ?? "") + m[2]).trim().replace(/\s+/g, "").toLowerCase();
  const book    = BOOK_ALIASES[rawBook] ?? BOOK_ALIASES[((m[1] ?? "") + " " + m[2]).trim().toLowerCase()];
  if (!book) return null;
  return { book, chapter: parseInt(m[3], 10), verse: m[4] ? parseInt(m[4], 10) : undefined };
}

// ── Local search ──────────────────────────────────────────────────────────────

function searchLocal(
  version: "KJV" | "ASV" | "WEB",
  query: string,
  limit: number
): BibleSearchResult[] {
  const bible = loadBible(version);
  const q     = query.toLowerCase();

  // Try reference lookup first
  const ref = parseReference(query);
  if (ref) {
    return bible
      .filter((v) =>
        v.book === ref.book &&
        v.chapter === ref.chapter &&
        (ref.verse === undefined || v.verse === ref.verse)
      )
      .slice(0, ref.verse ? 1 : limit)
      .map((v) => ({ book: v.book, chapter: v.chapter, verse: v.verse, reference: v.reference, text: v.text }));
  }

  // Full-text keyword search — every word must appear in the verse
  const words = q.split(/\s+/).filter(Boolean);
  return bible
    .filter((v) => words.every((w) => v.text.toLowerCase().includes(w)))
    .sort((a, b) => {
      const ai = CANONICAL_BOOKS.indexOf(a.book);
      const bi = CANONICAL_BOOKS.indexOf(b.book);
      if (ai !== bi) return ai - bi;
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      return a.verse - b.verse;
    })
    .slice(0, limit)
    .map((v) => ({ book: v.book, chapter: v.chapter, verse: v.verse, reference: v.reference, text: v.text }));
}

// ── api.bible search ──────────────────────────────────────────────────────────

const USFM_TO_BOOK: Record<string, string> = {
  GEN:"Genesis",EXO:"Exodus",LEV:"Leviticus",NUM:"Numbers",DEU:"Deuteronomy",
  JOS:"Joshua",JDG:"Judges",RUT:"Ruth","1SA":"1 Samuel","2SA":"2 Samuel",
  "1KI":"1 Kings","2KI":"2 Kings","1CH":"1 Chronicles","2CH":"2 Chronicles",
  EZR:"Ezra",NEH:"Nehemiah",EST:"Esther",JOB:"Job",PSA:"Psalm",
  PRO:"Proverbs",ECC:"Ecclesiastes",SNG:"Song of Solomon",
  ISA:"Isaiah",JER:"Jeremiah",LAM:"Lamentations",EZK:"Ezekiel",DAN:"Daniel",
  HOS:"Hosea",JOL:"Joel",AMO:"Amos",OBA:"Obadiah",JON:"Jonah",MIC:"Micah",
  NAM:"Nahum",HAB:"Habakkuk",ZEP:"Zephaniah",HAG:"Haggai",ZEC:"Zechariah",MAL:"Malachi",
  MAT:"Matthew",MRK:"Mark",LUK:"Luke",JHN:"John",ACT:"Acts",ROM:"Romans",
  "1CO":"1 Corinthians","2CO":"2 Corinthians",GAL:"Galatians",EPH:"Ephesians",
  PHP:"Philippians",COL:"Colossians","1TH":"1 Thessalonians","2TH":"2 Thessalonians",
  "1TI":"1 Timothy","2TI":"2 Timothy",TIT:"Titus",PHM:"Philemon",HEB:"Hebrews",
  JAS:"James","1PE":"1 Peter","2PE":"2 Peter","1JN":"1 John","2JN":"2 John",
  "3JN":"3 John",JUD:"Jude",REV:"Revelation",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " ").trim();
}

async function searchRemote(version: string, query: string, limit: number): Promise<BibleSearchResult[]> {
  const bibleId = API_BIBLE_IDS[version];
  if (!bibleId) throw new Error(`Unknown version: ${version}`);
  const apiKey  = process.env.API_BIBLE_KEY;
  if (!apiKey)  throw new Error("API_BIBLE_KEY not configured");

  const url =
    `https://rest.api.bible/v1/bibles/${bibleId}/search` +
    `?query=${encodeURIComponent(query)}&limit=${limit}&sort=relevance`;

  const res = await fetch(url, { headers: { "api-key": apiKey }, cache: "no-store" });
  if (!res.ok) throw new Error(`api.bible search ${res.status}`);
  const data = await res.json();

  return ((data.data?.verses ?? []) as Array<{ id: string; reference: string; text: string }>)
    .map((v) => {
      const [usfm, ch, vs] = v.id.split(".");
      return {
        book:      USFM_TO_BOOK[usfm] ?? usfm,
        chapter:   parseInt(ch, 10),
        verse:     parseInt(vs, 10),
        reference: v.reference,
        text:      stripHtml(v.text),
      };
    })
    .sort((a, b) => {
      const ai = CANONICAL_BOOKS.indexOf(a.book);
      const bi = CANONICAL_BOOKS.indexOf(b.book);
      if (ai !== bi) return ai - bi;
      if (a.chapter !== b.chapter) return a.chapter - b.chapter;
      return a.verse - b.verse;
    });
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const rawQuery = (searchParams.get("q") ?? "").trim();
  const version  = (searchParams.get("version") ?? "KJV").toUpperCase();
  const limit    = Math.min(parseInt(searchParams.get("limit") ?? "25", 10) || 25, MAX_RESULTS);

  if (rawQuery.length < 2)   return NextResponse.json({ error: "Query must be at least 2 characters." }, { status: 400 });
  if (rawQuery.length > 100) return NextResponse.json({ error: "Query too long." }, { status: 400 });

  const query = rawQuery.replace(/[^\w\s'":.-]/g, " ").replace(/\s{2,}/g, " ").trim();

  try {
    const results = (LOCAL_VERSIONS as readonly string[]).includes(version)
      ? searchLocal(version as "KJV" | "ASV" | "WEB", query, limit)
      : await searchRemote(version, query, limit);

    return NextResponse.json(
      { results, total: results.length, query },
      { headers: { "Cache-Control": "public, s-maxage=300" } }
    );
  } catch (e) {
    console.error("[bible/search]", e);
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 });
  }
}
