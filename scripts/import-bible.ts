import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

type BibleVersion = "KJV" | "ASV" | "WEB";

type NormalizedVerse = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  textNodeName: "textNode",
  trimValues: true,
  preserveOrder: false,
});

const BOOK_NAME_MAP: Record<string, string> = {
  Gen: "Genesis",
  Exod: "Exodus",
  Lev: "Leviticus",
  Num: "Numbers",
  Deut: "Deuteronomy",
  Josh: "Joshua",
  Judg: "Judges",
  Ruth: "Ruth",
  "1Sam": "1 Samuel",
  "2Sam": "2 Samuel",
  "1Kgs": "1 Kings",
  "2Kgs": "2 Kings",
  "1Chr": "1 Chronicles",
  "2Chr": "2 Chronicles",
  Ezra: "Ezra",
  Neh: "Nehemiah",
  Esth: "Esther",
  Job: "Job",
  Ps: "Psalm",
  Prov: "Proverbs",
  Eccl: "Ecclesiastes",
  Song: "Song of Solomon",
  Isa: "Isaiah",
  Jer: "Jeremiah",
  Lam: "Lamentations",
  Ezek: "Ezekiel",
  Dan: "Daniel",
  Hos: "Hosea",
  Joel: "Joel",
  Amos: "Amos",
  Obad: "Obadiah",
  Jonah: "Jonah",
  Mic: "Micah",
  Nah: "Nahum",
  Hab: "Habakkuk",
  Zeph: "Zephaniah",
  Hag: "Haggai",
  Zech: "Zechariah",
  Mal: "Malachi",
  Matt: "Matthew",
  Mark: "Mark",
  Luke: "Luke",
  John: "John",
  Acts: "Acts",
  Rom: "Romans",
  "1Cor": "1 Corinthians",
  "2Cor": "2 Corinthians",
  Gal: "Galatians",
  Eph: "Ephesians",
  Phil: "Philippians",
  Col: "Colossians",
  "1Thess": "1 Thessalonians",
  "2Thess": "2 Thessalonians",
  "1Tim": "1 Timothy",
  "2Tim": "2 Timothy",
  Titus: "Titus",
  Phlm: "Philemon",
  Heb: "Hebrews",
  Jas: "James",
  "1Pet": "1 Peter",
  "2Pet": "2 Peter",
  "1John": "1 John",
  "2John": "2 John",
  "3John": "3 John",
  Jude: "Jude",
  Rev: "Revelation",
};

function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyReference(book: string, chapter: number, verse: number): string {
  return `${book.toLowerCase().replace(/\s+/g, "-")}-${chapter}-${verse}`;
}

function stripXmlTags(text: string): string {
  return normalizeWhitespace(text.replace(/<[^>]+>/g, " "));
}

function extractText(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string") return normalizeWhitespace(node);
  if (typeof node === "number") return String(node);

  if (Array.isArray(node)) {
    return normalizeWhitespace(node.map(extractText).join(" "));
  }

  if (typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const ignoredKeys = new Set([
      "style",
      "note",
      "ref",
      "figure",
      "table",
      "row",
      "cell",
      "sidebar",
      "ca",
      "cp",
      "va",
    ]);

    const pieces: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      if (ignoredKeys.has(key)) continue;
      pieces.push(extractText(value));
    }

    return normalizeWhitespace(pieces.join(" "));
  }

  return "";
}

/**
 * Handles OSIS files where verse text appears immediately after:
 * <verse osisID="Gen.1.1" ... />
 * followed by text until next <verse .../> or paragraph end.
 */
function parseOsisBible(xmlText: string): NormalizedVerse[] {
  const verses: NormalizedVerse[] = [];

  const verseRegex =
    /<verse\b[^>]*osisID="([^"]+)"[^>]*\/>([\s\S]*?)(?=<verse\b|<\/p>|<\/div>|<\/chapter>)/g;

  let match: RegExpExecArray | null;

  while ((match = verseRegex.exec(xmlText)) !== null) {
    const osisID = match[1];
    const rawText = match[2];

    if (!osisID || !rawText) continue;

    const parts = osisID.split(".");
    if (parts.length < 3) continue;

    const [bookCode, chapterStr, verseStr] = parts;
    const bookName = BOOK_NAME_MAP[bookCode] ?? bookCode;
    const chapter = Number(chapterStr);
    const verse = Number(verseStr);

    if (!bookName || Number.isNaN(chapter) || Number.isNaN(verse)) continue;

    const text = stripXmlTags(rawText);
    if (!text) continue;

    verses.push({
      id: slugifyReference(bookName, chapter, verse),
      book: bookName,
      chapter,
      verse,
      reference: `${bookName} ${chapter}:${verse}`,
      text,
    });
  }

  return dedupeVerses(verses);
}

/**
 * Basic USFX parser.
 * Works with files shaped like:
 * <usfx><book id="GEN">...<c id="1"/>...<v id="1"/>Text...</book></usfx>
 */
function parseUsfxBible(xmlText: string): NormalizedVerse[] {
  const parsed = parser.parse(xmlText);
  const root = parsed?.usfx ?? parsed?.USFX ?? parsed;
  const bookNodes = ensureArray(root?.book);
  const verses: NormalizedVerse[] = [];

  for (const bookNode of bookNodes) {
    const rawBookCode =
      bookNode?.id ||
      bookNode?.code ||
      bookNode?.bookCode ||
      bookNode?.style?.id ||
      "Unknown";

    // Ignore front matter / preface
    if (rawBookCode === "FRT") continue;

    const bookName = BOOK_NAME_MAP[rawBookCode] ?? rawBookCode;

    let currentChapter = 0;
    let currentVerse = 0;

    function walk(node: unknown): void {
      if (node == null) return;

      if (Array.isArray(node)) {
        for (const item of node) walk(item);
        return;
      }

      if (typeof node !== "object") return;

      const obj = node as Record<string, unknown>;

      // Chapter markers
      const chapterNodes = ensureArray(obj.c);
      for (const c of chapterNodes) {
        if (typeof c === "object" && c !== null) {
          const cObj = c as Record<string, unknown>;
          const value = cObj.id ?? cObj.number ?? cObj.textNode;
          const num = Number(value);
          if (!Number.isNaN(num) && num > 0) {
            currentChapter = num;
          }
        }
      }

      // Verse markers
      const verseNodes = ensureArray(obj.v);
      for (const v of verseNodes) {
        if (typeof v !== "object" || v === null) continue;

        const vObj = v as Record<string, unknown>;
        const value = vObj.id ?? vObj.number ?? vObj.textNode;
        const num = Number(value);

        if (Number.isNaN(num) || num <= 0) continue;
        if (!currentChapter) continue;

        currentVerse = num;

        let verseText = "";

        if (typeof vObj.textNode === "string") {
          verseText = vObj.textNode;
        } else {
          verseText = extractText(vObj);
        }

        verseText = normalizeWhitespace(verseText);

        if (!verseText) continue;

        verses.push({
          id: slugifyReference(bookName, currentChapter, currentVerse),
          book: bookName,
          chapter: currentChapter,
          verse: currentVerse,
          reference: `${bookName} ${currentChapter}:${currentVerse}`,
          text: verseText,
        });
      }

      for (const value of Object.values(obj)) {
        walk(value);
      }
    }

    walk(bookNode);
  }

  return dedupeVerses(verses);
}

function dedupeVerses(verses: NormalizedVerse[]): NormalizedVerse[] {
  const seen = new Map<string, NormalizedVerse>();

  for (const verse of verses) {
    const existing = seen.get(verse.id);
    if (!existing || verse.text.length > existing.text.length) {
      seen.set(verse.id, verse);
    }
  }

  return Array.from(seen.values()).sort((a, b) => {
    if (a.book !== b.book) return a.book.localeCompare(b.book);
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return a.verse - b.verse;
  });
}

function parseBible(xmlText: string): NormalizedVerse[] {
  if (xmlText.includes("<usfx") || xmlText.includes("<USFX")) {
    return parseUsfxBible(xmlText);
  }

  if (xmlText.includes("<osis") || xmlText.includes("<osisText")) {
    return parseOsisBible(xmlText);
  }

  throw new Error("Unsupported XML format. Expected USFX or OSIS.");
}

function importBible(version: BibleVersion, inputFile: string, outputFile: string) {
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Missing source file for ${version}: ${inputFile}`);
  }

  const xmlText = fs.readFileSync(inputFile, "utf-8");
  const verses = parseBible(xmlText);

  if (verses.length === 0) {
    throw new Error(`No verses parsed for ${version}. Check the XML structure.`);
  }

  fs.writeFileSync(outputFile, JSON.stringify(verses, null, 2), "utf-8");
  console.log(`Imported ${verses.length} verses for ${version} -> ${outputFile}`);
}

function main() {
  const root = process.cwd();
  const rawDir = path.join(root, "src", "data", "bibles", "raw");
  const outDir = path.join(root, "src", "data", "bibles", "normalized");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Start with one version if needed, then uncomment the others.
  importBible(
    "WEB",
    path.join(rawDir, "web.xml"),
    path.join(outDir, "web.json")
  );

  importBible(
    "KJV",
    path.join(rawDir, "kjv.xml"),
    path.join(outDir, "kjv.json")
  );

  importBible(
    "ASV",
    path.join(rawDir, "asv.xml"),
    path.join(outDir, "asv.json")
  );
}

main();