import { NextRequest, NextResponse } from "next/server";
import { loadBible, BibleVersion } from "@/lib/loadBibleVersion";

export type BibleSearchResult = {
  version: BibleVersion;
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
  matchType: "reference" | "keyword";
};

// Book name aliases for reference parsing
const BOOK_ALIASES: Record<string, string> = {
  // Genesis - Malachi
  gen: "Genesis", genesis: "Genesis",
  exo: "Exodus", exod: "Exodus", exodus: "Exodus",
  lev: "Leviticus", leviticus: "Leviticus",
  num: "Numbers", numbers: "Numbers",
  deu: "Deuteronomy", deut: "Deuteronomy", deuteronomy: "Deuteronomy",
  jos: "Joshua", josh: "Joshua", joshua: "Joshua",
  jdg: "Judges", judg: "Judges", judges: "Judges",
  rut: "Ruth", ruth: "Ruth",
  "1sa": "1 Samuel", "1sam": "1 Samuel", "1 samuel": "1 Samuel",
  "2sa": "2 Samuel", "2sam": "2 Samuel", "2 samuel": "2 Samuel",
  "1ki": "1 Kings", "1kgs": "1 Kings", "1 kings": "1 Kings",
  "2ki": "2 Kings", "2kgs": "2 Kings", "2 kings": "2 Kings",
  "1ch": "1 Chronicles", "1chr": "1 Chronicles", "1 chronicles": "1 Chronicles",
  "2ch": "2 Chronicles", "2chr": "2 Chronicles", "2 chronicles": "2 Chronicles",
  ezr: "Ezra", ezra: "Ezra",
  neh: "Nehemiah", nehemiah: "Nehemiah",
  est: "Esther", esth: "Esther", esther: "Esther",
  job: "Job",
  psa: "Psalm", ps: "Psalm", psalm: "Psalm", psalms: "Psalm",
  pro: "Proverbs", prov: "Proverbs", proverbs: "Proverbs",
  ecc: "Ecclesiastes", eccl: "Ecclesiastes", ecclesiastes: "Ecclesiastes",
  sng: "Song of Solomon", song: "Song of Solomon", sos: "Song of Solomon",
  isa: "Isaiah", isaiah: "Isaiah",
  jer: "Jeremiah", jeremiah: "Jeremiah",
  lam: "Lamentations", lamentations: "Lamentations",
  ezk: "Ezekiel", ezek: "Ezekiel", ezekiel: "Ezekiel",
  dan: "Daniel", daniel: "Daniel",
  hos: "Hosea", hosea: "Hosea",
  joe: "Joel", joel: "Joel",
  amo: "Amos", amos: "Amos",
  oba: "Obadiah", obad: "Obadiah", obadiah: "Obadiah",
  jon: "Jonah", jonah: "Jonah",
  mic: "Micah", micah: "Micah",
  nam: "Nahum", nahum: "Nahum",
  hab: "Habakkuk", habakkuk: "Habakkuk",
  zep: "Zephaniah", zeph: "Zephaniah", zephaniah: "Zephaniah",
  hag: "Haggai", haggai: "Haggai",
  zec: "Zechariah", zech: "Zechariah", zechariah: "Zechariah",
  mal: "Malachi", malachi: "Malachi",
  // New Testament
  mat: "Matthew", matt: "Matthew", matthew: "Matthew",
  mrk: "Mark", mark: "Mark",
  luk: "Luke", luke: "Luke",
  jhn: "John", john: "John",
  act: "Acts", acts: "Acts",
  rom: "Romans", romans: "Romans",
  "1co": "1 Corinthians", "1cor": "1 Corinthians", "1 corinthians": "1 Corinthians",
  "2co": "2 Corinthians", "2cor": "2 Corinthians", "2 corinthians": "2 Corinthians",
  gal: "Galatians", galatians: "Galatians",
  eph: "Ephesians", ephesians: "Ephesians",
  php: "Philippians", phil: "Philippians", philippians: "Philippians",
  col: "Colossians", colossians: "Colossians",
  "1th": "1 Thessalonians", "1thess": "1 Thessalonians", "1 thessalonians": "1 Thessalonians",
  "2th": "2 Thessalonians", "2thess": "2 Thessalonians", "2 thessalonians": "2 Thessalonians",
  "1ti": "1 Timothy", "1tim": "1 Timothy", "1 timothy": "1 Timothy",
  "2ti": "2 Timothy", "2tim": "2 Timothy", "2 timothy": "2 Timothy",
  tit: "Titus", titus: "Titus",
  phm: "Philemon", phlm: "Philemon", philemon: "Philemon",
  heb: "Hebrews", hebrews: "Hebrews",
  jas: "James", james: "James",
  "1pe": "1 Peter", "1pet": "1 Peter", "1 peter": "1 Peter",
  "2pe": "2 Peter", "2pet": "2 Peter", "2 peter": "2 Peter",
  "1jn": "1 John", "1john": "1 John", "1 john": "1 John",
  "2jn": "2 John", "2john": "2 John", "2 john": "2 John",
  "3jn": "3 John", "3john": "3 John", "3 john": "3 John",
  jud: "Jude", jude: "Jude",
  rev: "Revelation", revelation: "Revelation",
};

function resolveBook(raw: string): string | null {
  const key = raw.toLowerCase().trim();
  return BOOK_ALIASES[key] ?? null;
}

// Try to parse as a scripture reference like "John 3:16", "Gen 1", "Ps 23:1"
function parseReference(query: string): { book: string; chapter: number; verse?: number } | null {
  const q = query.trim();

  // Pattern: (optional number)(word)(optional number) chapter:verse or chapter
  // e.g. "1 John 3:16", "John 3:16", "John 3", "Ps 23"
  const match = q.match(
    /^(\d\s*)?([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\s+(\d+)(?::(\d+))?$/
  );
  if (!match) return null;

  const bookRaw = ((match[1] ?? "") + match[2]).trim();
  const book = resolveBook(bookRaw);
  if (!book) return null;

  const chapter = parseInt(match[3], 10);
  const verse = match[4] ? parseInt(match[4], 10) : undefined;

  return { book, chapter, verse };
}

const VERSIONS: BibleVersion[] = ["KJV", "ASV", "WEB"];
const MAX_KEYWORD_RESULTS_PER_VERSION = 4;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results: BibleSearchResult[] = [];

  // Try reference lookup first
  const ref = parseReference(q);
  if (ref) {
    for (const version of VERSIONS) {
      const bible = loadBible(version);
      const matches = bible.filter(
        (v) =>
          v.book === ref.book &&
          v.chapter === ref.chapter &&
          (ref.verse === undefined || v.verse === ref.verse)
      );
      for (const v of matches.slice(0, ref.verse ? 1 : 5)) {
        results.push({ ...v, version, matchType: "reference" });
      }
    }
  }

  // Also do keyword search if not a pure reference hit (or no ref found)
  if (!ref || results.length === 0) {
    const keywords = q.toLowerCase().split(/\s+/).filter(Boolean);
    for (const version of VERSIONS) {
      const bible = loadBible(version);
      const matches = bible.filter((v) =>
        keywords.every((kw) => v.text.toLowerCase().includes(kw))
      );
      for (const v of matches.slice(0, MAX_KEYWORD_RESULTS_PER_VERSION)) {
        results.push({ ...v, version, matchType: "keyword" });
      }
    }
  }

  return NextResponse.json({ results });
}
