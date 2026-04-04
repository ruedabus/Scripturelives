/**
 * Scripture Lives — Strong's Concordance Setup Script
 * Run once: npm run setup-strongs
 *
 * Downloads and processes:
 *   1. Strong's Hebrew lexicon (H1–H8674)   from OpenScriptures / GitHub
 *   2. Strong's Greek lexicon  (G1–G5624)   from OpenScriptures / GitHub
 *   3. KJV text tagged with Strong's numbers (multiple source candidates tried)
 *
 * Saves processed JSON to src/data/strongs/
 */

import fs from "fs";
import path from "path";
import https from "https";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const ROOT = path.join(__dirname, "..");
const STRONGS_DIR = path.join(ROOT, "src", "data", "strongs");
const KJV_DIR = path.join(STRONGS_DIR, "kjv");

// ---------------------------------------------------------------------------
// Source URLs
// ---------------------------------------------------------------------------
const HEBREW_URL =
  "https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.js";
const GREEK_URL =
  "https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.js";

// KJV with Strong's: try multiple candidate URLs in order
const KJV_TAGGED_CANDIDATES = [
  // Scrollmapper bible_databases — various possible paths/branches
  "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/csv/t_kjv.csv",
  "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/csv/t_kjv.csv",
  "https://raw.githubusercontent.com/scrollmapper/bible_databases/main/formats/csv/t_kjv.csv",
  "https://raw.githubusercontent.com/scrollmapper/bible_databases/main/csv/t_kjv.csv",
  "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/data/csv/t_kjv.csv",
  // Alternative: aruljohn KJV Strongs repository
  "https://raw.githubusercontent.com/aruljohn/bible-kjv/master/kjv.json",
  // Alternative: openbible concordance
  "https://raw.githubusercontent.com/openbible-io/strongs/main/kjv-strongs.csv",
];

// ---------------------------------------------------------------------------
// Book number → name lookup (scrollmapper uses 1-66)
// ---------------------------------------------------------------------------
const BOOK_NAMES: string[] = [
  "", // 1-indexed
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
  "Joshua","Judges","Ruth","1 Samuel","2 Samuel",
  "1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs",
  "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations",
  "Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk",
  "Zephaniah","Haggai","Zechariah","Malachi","Matthew",
  "Mark","Luke","John","Acts","Romans",
  "1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians",
  "Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy",
  "Titus","Philemon","Hebrews","James","1 Peter",
  "2 Peter","1 John","2 John","3 John","Jude","Revelation",
];

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------
function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`  ↓ ${url}`);
    https
      .get(url, { headers: { "User-Agent": "scripture-alive-setup/1.0" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return fetchText(res.headers.location!).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

/** Try a list of URLs in order, returning the first successful response. */
async function fetchFirstWorking(urls: string[], label: string): Promise<{ url: string; text: string }> {
  for (const url of urls) {
    try {
      const text = await fetchText(url);
      console.log(`  ✓ Found ${label} at ${url}`);
      return { url, text };
    } catch (e) {
      console.log(`    ✗ Not found (${(e as Error).message})`);
    }
  }
  throw new Error(`Could not download ${label} from any of ${urls.length} candidate URLs.`);
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function saveJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 0), "utf-8");
  const kb = Math.round(fs.statSync(filePath).size / 1024);
  console.log(`  ✓ Saved ${path.relative(ROOT, filePath)} (${kb} KB)`);
}

// ---------------------------------------------------------------------------
// Parse OpenScriptures Strong's JS dictionary files
// Format:  var hebrewStrongsDict = { "H1": {...}, ... };
// ---------------------------------------------------------------------------
function parseStrongsJs(raw: string): Record<string, unknown> {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Could not find JSON object in Strong's JS file");
  return JSON.parse(raw.slice(start, end + 1));
}

type LexEntry = {
  lemma: string;
  xlit: string;
  pron: string;
  derivation: string;
  strongs_def: string;
  kjv_def: string;
};

function cleanEntry(raw: Record<string, unknown>): LexEntry {
  return {
    lemma: String(raw.lemma ?? ""),
    xlit: String(raw.xlit ?? raw.translit ?? ""),
    pron: String(raw.pron ?? ""),
    derivation: String(raw.derivation ?? ""),
    strongs_def: String(raw.strongs_def ?? raw.strongsDef ?? ""),
    kjv_def: String(raw.kjv_def ?? raw.kjvDef ?? raw.usage ?? ""),
  };
}

async function downloadLexicons() {
  console.log("\n📖  Downloading Strong's Hebrew lexicon…");
  const hebrewRaw = await fetchText(HEBREW_URL);
  const hebrewDict = parseStrongsJs(hebrewRaw);
  const hebrew: Record<string, LexEntry> = {};
  for (const [key, val] of Object.entries(hebrewDict)) {
    hebrew[key] = cleanEntry(val as Record<string, unknown>);
  }
  saveJson(path.join(STRONGS_DIR, "hebrew.json"), hebrew);
  console.log(`    Entries: ${Object.keys(hebrew).length}`);

  console.log("\n📖  Downloading Strong's Greek lexicon…");
  const greekRaw = await fetchText(GREEK_URL);
  const greekDict = parseStrongsJs(greekRaw);
  const greek: Record<string, LexEntry> = {};
  for (const [key, val] of Object.entries(greekDict)) {
    greek[key] = cleanEntry(val as Record<string, unknown>);
  }
  saveJson(path.join(STRONGS_DIR, "greek.json"), greek);
  console.log(`    Entries: ${Object.keys(greek).length}`);
}

// ---------------------------------------------------------------------------
// Parse tagged KJV CSV
// Expected format (scrollmapper): b,c,v,t
// where t contains:  word<H430>  inline Strong's tags
// ---------------------------------------------------------------------------
type StrongsWord = { w: string; s: string | null };
type BookData = Record<number, Record<number, StrongsWord[]>>;

function parseVerseWords(text: string): StrongsWord[] {
  const words: StrongsWord[] = [];
  const raw = text.trim();
  let i = 0;

  while (i < raw.length) {
    // Skip whitespace and punctuation
    while (i < raw.length && /[\s,.:;!?()\[\]"'—\-]/.test(raw[i])) i++;
    if (i >= raw.length) break;

    // Read a word (letters, apostrophes)
    let word = "";
    while (i < raw.length && /[A-Za-z'']/.test(raw[i])) {
      word += raw[i++];
    }
    if (!word) { i++; continue; }

    // Check for <H####> or <G####> tag immediately after
    let strongs: string | null = null;
    if (i < raw.length && raw[i] === "<") {
      const end = raw.indexOf(">", i);
      if (end !== -1) {
        const tag = raw.slice(i + 1, end);
        if (/^[HG]\d+$/.test(tag) && tag !== "H0" && tag !== "G0") {
          strongs = tag;
        }
        i = end + 1;
      }
    }
    words.push({ w: word, s: strongs });
  }
  return words;
}

async function downloadTaggedKjv() {
  console.log("\n📜  Locating KJV with Strong's numbers (trying multiple sources)…");

  const { text: csv } = await fetchFirstWorking(KJV_TAGGED_CANDIDATES, "tagged KJV");

  const lines = csv.split("\n");
  console.log(`    Total CSV lines: ${lines.length.toLocaleString()}`);

  const books: Record<string, BookData> = {};
  let processed = 0;

  for (let li = 1; li < lines.length; li++) {
    const line = lines[li].trim();
    if (!line) continue;

    // Parse:  b,c,v,"text..."
    // Find the first three commas, then take everything after as text (may contain commas)
    const commas: number[] = [];
    let inQuote = false;
    for (let ci = 0; ci < line.length && commas.length < 3; ci++) {
      if (line[ci] === '"') inQuote = !inQuote;
      else if (line[ci] === "," && !inQuote) commas.push(ci);
    }
    if (commas.length < 3) continue;

    const b = parseInt(line.slice(0, commas[0]), 10);
    const c = parseInt(line.slice(commas[0] + 1, commas[1]), 10);
    const v = parseInt(line.slice(commas[1] + 1, commas[2]), 10);
    let t = line.slice(commas[2] + 1).trim();
    if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1);
    t = t.replace(/""/g, '"');

    const bookName = BOOK_NAMES[b];
    if (!bookName) continue;

    if (!books[bookName]) books[bookName] = {};
    if (!books[bookName][c]) books[bookName][c] = {};
    books[bookName][c][v] = parseVerseWords(t);
    processed++;
  }

  if (processed === 0) {
    throw new Error("CSV parsed but no verses found — unexpected format?");
  }

  console.log(`    Verses processed: ${processed.toLocaleString()}`);

  // Save one JSON file per book
  for (const [bookName, bookData] of Object.entries(books)) {
    const idx = BOOK_NAMES.indexOf(bookName);
    const fileName = `${String(idx).padStart(2, "0")}-${bookName.toLowerCase().replace(/\s+/g, "-")}.json`;
    saveJson(path.join(KJV_DIR, fileName), bookData);
  }
  console.log(`    Book files written: ${Object.keys(books).length}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Scripture Lives — Strong's Concordance Setup");
  console.log("═══════════════════════════════════════════════════");

  ensureDir(STRONGS_DIR);
  ensureDir(KJV_DIR);

  // Check if lexicons already exist and skip if so
  const hebrewExists = fs.existsSync(path.join(STRONGS_DIR, "hebrew.json"));
  const greekExists = fs.existsSync(path.join(STRONGS_DIR, "greek.json"));

  if (hebrewExists && greekExists) {
    console.log("\n✓  Lexicons already downloaded — skipping.");
  } else {
    try {
      await downloadLexicons();
    } catch (err) {
      console.error("\n❌  Failed to download lexicons:", (err as Error).message);
      process.exit(1);
    }
  }

  // Check if KJV word files already exist
  const kjvFiles = fs.existsSync(KJV_DIR) ? fs.readdirSync(KJV_DIR) : [];
  if (kjvFiles.length >= 66) {
    console.log("\n✓  KJV word-study data already downloaded — skipping.");
    console.log("\n✅  All data present. Restart the dev server if needed.\n");
    return;
  }

  try {
    await downloadTaggedKjv();
  } catch (err) {
    console.error("\n❌  Failed to download tagged KJV:", (err as Error).message);
    console.error(
      "\n   The Hebrew and Greek lexicons were saved successfully."
    );
    console.error(
      "   Word-by-word Strong's tagging requires the KJV source file."
    );
    console.error(
      "   You can still use the lexicons by Strong's number (e.g. H430)."
    );
    console.error(
      "\n   Try again later, or open an issue at:"
    );
    console.error(
      "   https://github.com/scrollmapper/bible_databases"
    );
    process.exit(1);
  }

  console.log("\n✅  Setup complete!");
  console.log("   Restart your dev server (npm run dev) to activate Word Study mode.\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
