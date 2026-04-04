/**
 * Scripture Lives — Extra Data Setup Script
 * Run once: npm run setup-extras
 *
 * Downloads:
 *   1. Cross-references (OpenBible.info — 340k verse pairs)
 *   2. Matthew Henry Commentary index (chapter-level summaries)
 *
 * Saves to src/data/cross-refs/ and src/data/commentary/
 */

import fs from "fs";
import path from "path";
import https from "https";

const ROOT = path.join(__dirname, "..");
const XREF_DIR = path.join(ROOT, "src", "data", "cross-refs");
const COMMENTARY_DIR = path.join(ROOT, "src", "data", "commentary");

// ---------------------------------------------------------------------------
// Cross-reference source candidates  (updated 2026 — several old URLs moved)
// ---------------------------------------------------------------------------
const XREF_CANDIDATES = [
  // shandran mirror of openbible.info data — OSIS format, CC-BY
  "https://raw.githubusercontent.com/shandran/openbible/main/cross_references_expanded.csv",
  // scrollmapper 2025 branch
  "https://raw.githubusercontent.com/scrollmapper/bible_databases/2025/formats/csv/cross_references.csv",
  // scrollmapper master — various path attempts
  "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/csv/cross_references.csv",
  "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/csv/cross_references.csv",
  // BibleResearch — different column format (a/b), handled by parser below
  "https://raw.githubusercontent.com/BibleResearch/bible-cross-reference-database/master/cross_references.csv",
  // openbible direct (may be 403 behind CDN)
  "https://a.openbible.info/data/cross-references.txt",
];

// Matthew Henry Commentary — chapter summaries from CCEL / GitHub
const MHC_CANDIDATES = [
  "https://raw.githubusercontent.com/chadrs2/matthew-henry-commentary/main/mhc_json/mhc.json",
  "https://raw.githubusercontent.com/dtjohnso/matthew-henry/master/commentary.json",
  "https://raw.githubusercontent.com/openscriptures/commentary/main/matthew-henry/mhc.json",
];

// ---------------------------------------------------------------------------
// Book name / abbreviation maps
// ---------------------------------------------------------------------------
const OSIS_TO_NAME: Record<string, string> = {
  Gen:"Genesis", Exod:"Exodus", Lev:"Leviticus", Num:"Numbers", Deut:"Deuteronomy",
  Josh:"Joshua", Judg:"Judges", Ruth:"Ruth", "1Sam":"1 Samuel", "2Sam":"2 Samuel",
  "1Kgs":"1 Kings", "2Kgs":"2 Kings", "1Chr":"1 Chronicles", "2Chr":"2 Chronicles",
  Ezra:"Ezra", Neh:"Nehemiah", Esth:"Esther", Job:"Job", Ps:"Psalms",
  Prov:"Proverbs", Eccl:"Ecclesiastes", Song:"Song of Solomon", Isa:"Isaiah",
  Jer:"Jeremiah", Lam:"Lamentations", Ezek:"Ezekiel", Dan:"Daniel",
  Hos:"Hosea", Joel:"Joel", Amos:"Amos", Obad:"Obadiah", Jonah:"Jonah",
  Mic:"Micah", Nah:"Nahum", Hab:"Habakkuk", Zeph:"Zephaniah", Hag:"Haggai",
  Zech:"Zechariah", Mal:"Malachi",
  Matt:"Matthew", Mark:"Mark", Luke:"Luke", John:"John", Acts:"Acts",
  Rom:"Romans", "1Cor":"1 Corinthians", "2Cor":"2 Corinthians", Gal:"Galatians",
  Eph:"Ephesians", Phil:"Philippians", Col:"Colossians",
  "1Thess":"1 Thessalonians", "2Thess":"2 Thessalonians",
  "1Tim":"1 Timothy", "2Tim":"2 Timothy", Titus:"Titus", Phlm:"Philemon",
  Heb:"Hebrews", Jas:"James", "1Pet":"1 Peter", "2Pet":"2 Peter",
  "1John":"1 John", "2John":"2 John", "3John":"3 John", Jude:"Jude", Rev:"Revelation",
};

// Also handle dot-separated OSIS like "Gen.1.1"
function osisToRef(osis: string): { book: string; chapter: number; verse: number } | null {
  const parts = osis.split(".");
  if (parts.length < 2) return null;
  const bookOsis = parts[0];
  const book = OSIS_TO_NAME[bookOsis] ?? bookOsis;
  const chapter = parseInt(parts[1], 10);
  const verse = parts[2] ? parseInt(parts[2], 10) : 0;
  if (!book || isNaN(chapter)) return null;
  return { book, chapter, verse };
}

// BibleResearch format uses abbreviated names like "Ge 1:1", "Re 22:21"
const ABBR_TO_NAME: Record<string, string> = {
  Ge:"Genesis", Ex:"Exodus", Le:"Leviticus", Nu:"Numbers", De:"Deuteronomy",
  Jos:"Joshua", Jg:"Judges", Ru:"Ruth", "1Sa":"1 Samuel", "2Sa":"2 Samuel",
  "1Ki":"1 Kings", "2Ki":"2 Kings", "1Ch":"1 Chronicles", "2Ch":"2 Chronicles",
  Ezr:"Ezra", Ne:"Nehemiah", Es:"Esther", Job:"Job", Ps:"Psalms",
  Pr:"Proverbs", Ec:"Ecclesiastes", So:"Song of Solomon", Isa:"Isaiah",
  Jer:"Jeremiah", La:"Lamentations", Eze:"Ezekiel", Da:"Daniel",
  Ho:"Hosea", Joe:"Joel", Am:"Amos", Ob:"Obadiah", Jon:"Jonah",
  Mic:"Micah", Na:"Nahum", Hab:"Habakkuk", Zep:"Zephaniah", Hag:"Haggai",
  Zec:"Zechariah", Mal:"Malachi",
  Mt:"Matthew", Mr:"Mark", Lu:"Luke", Joh:"John", Ac:"Acts",
  Ro:"Romans", "1Co":"1 Corinthians", "2Co":"2 Corinthians", Ga:"Galatians",
  Eph:"Ephesians", Php:"Philippians", Col:"Colossians",
  "1Th":"1 Thessalonians", "2Th":"2 Thessalonians",
  "1Ti":"1 Timothy", "2Ti":"2 Timothy", Tit:"Titus", Phm:"Philemon",
  Heb:"Hebrews", Jas:"James", "1Pe":"1 Peter", "2Pe":"2 Peter",
  "1Jo":"1 John", "2Jo":"2 John", "3Jo":"3 John", Jude:"Jude", Re:"Revelation",
};

function abbrToRef(ref: string): { book: string; chapter: number; verse: number } | null {
  // e.g. "Ge 1:1", "1Sa 2:3", "Re 22:21"
  const m = ref.trim().match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!m) return null;
  const book = ABBR_TO_NAME[m[1]] ?? OSIS_TO_NAME[m[1]] ?? m[1];
  const chapter = parseInt(m[2], 10);
  const verse = parseInt(m[3], 10);
  if (!book || isNaN(chapter)) return null;
  return { book, chapter, verse };
}

// ---------------------------------------------------------------------------
// HTTP fetch helpers
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

async function fetchFirstWorking(urls: string[], label: string): Promise<{ url: string; text: string }> {
  for (const url of urls) {
    try {
      const text = await fetchText(url);
      console.log(`  ✓ Found ${label}`);
      return { url, text };
    } catch (e) {
      console.log(`    ✗ ${(e as Error).message}`);
    }
  }
  throw new Error(`Could not download ${label} from any candidate URL.`);
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
// Cross-references
// Format varies by source — handles both TSV (from/to/votes) and CSV
// Expected: from_verse\tto_verse\tvotes  (OSIS format: Gen.1.1)
// ---------------------------------------------------------------------------
type XrefEntry = { book: string; chapter: number; verse: number };
// Keyed: "Genesis 1:1" → array of XrefEntry
type XrefIndex = Record<string, XrefEntry[]>;

function parseXrefs(raw: string): XrefIndex {
  const index: XrefIndex = {};
  const lines = raw.split("\n");
  let parsed = 0;

  // Detect format from header row
  const header = lines[0]?.trim().toLowerCase() ?? "";
  const isBibleResearch = header.startsWith('"a"') || header.startsWith("a,") || header === "a,b,description,sources,date-added";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Skip known header rows
    const lower = trimmed.toLowerCase();
    if (lower.startsWith("from") || lower.startsWith('"from"') ||
        lower === "a,b,description,sources,date-added" ||
        lower.startsWith('"a","b"')) continue;

    // Try tab-separated first, then comma-separated
    const sep = trimmed.includes("\t") ? "\t" : ",";
    const parts = trimmed.split(sep);
    if (parts.length < 2) continue;

    const col0 = parts[0].trim().replace(/^"|"$/g, "");
    const col1 = parts[1].trim().replace(/^"|"$/g, "");

    let from: { book: string; chapter: number; verse: number } | null;
    let to: { book: string; chapter: number; verse: number } | null;

    if (isBibleResearch) {
      // "Ge 1:1" style
      from = abbrToRef(col0);
      to = abbrToRef(col1);
    } else {
      // OSIS "Gen.1.1" style
      from = osisToRef(col0);
      to = osisToRef(col1);
    }

    if (!from || !to) continue;

    const fromKey = `${from.book} ${from.chapter}:${from.verse}`;
    if (!index[fromKey]) index[fromKey] = [];

    // Avoid duplicates
    const alreadyHas = index[fromKey].some(
      (e) => e.book === to!.book && e.chapter === to!.chapter && e.verse === to!.verse
    );
    if (!alreadyHas) {
      index[fromKey].push(to);
    }
    parsed++;
  }

  console.log(`    Cross-references parsed: ${parsed.toLocaleString()}`);
  return index;
}

async function downloadCrossRefs() {
  console.log("\n🔗  Downloading cross-references…");

  const xrefFile = path.join(XREF_DIR, "index.json");
  if (fs.existsSync(xrefFile)) {
    console.log("  ✓ Already downloaded — skipping.");
    return;
  }

  const { text } = await fetchFirstWorking(XREF_CANDIDATES, "cross-references");
  const index = parseXrefs(text);
  const count = Object.keys(index).length;
  console.log(`    Verses with cross-refs: ${count.toLocaleString()}`);
  saveJson(xrefFile, index);
}

// ---------------------------------------------------------------------------
// Matthew Henry Commentary
// We attempt multiple JSON sources. If all fail, we generate a stub index
// that tells the UI to show a helpful message with a link to the full text.
// ---------------------------------------------------------------------------
async function downloadCommentary() {
  console.log("\n📚  Downloading Matthew Henry Commentary…");

  const commentaryFile = path.join(COMMENTARY_DIR, "mhc.json");
  if (fs.existsSync(commentaryFile)) {
    console.log("  ✓ Already downloaded — skipping.");
    return;
  }

  try {
    const { text } = await fetchFirstWorking(MHC_CANDIDATES, "Matthew Henry Commentary");
    // Validate it looks like JSON
    const parsed = JSON.parse(text);
    saveJson(commentaryFile, parsed);
  } catch (err) {
    console.log(`\n  ℹ  Could not download Matthew Henry Commentary JSON.`);
    console.log(`     The commentary tab will link to the full text online.`);
    // Save a stub so the API knows to use the fallback mode
    saveJson(commentaryFile, { __stub: true, __source: "online" });
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Scripture Lives — Extra Data Setup");
  console.log("═══════════════════════════════════════════════════");

  ensureDir(XREF_DIR);
  ensureDir(COMMENTARY_DIR);

  await downloadCrossRefs();
  await downloadCommentary();

  console.log("\n✅  Setup complete!");
  console.log("   Restart your dev server (npm run dev) to activate these features.\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
