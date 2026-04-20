/**
 * /api/commentary?book=Genesis&chapter=1
 *
 * Returns Matthew Henry commentary for a given chapter.
 * Strategy:
 *   1. If a real local mhc.json is present, use it.
 *   2. Otherwise, fetch live from static-HTML sources (BibleHub, StudyLight).
 *      Results are cached in memory for the lifetime of the server process.
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { LRUCache } from "@/lib/lruCache";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const MHC_PATH = join(process.cwd(), "src", "data", "commentary", "mhc.json");

// ── In-memory LRU cache: "Genesis:1" → text | null (max 300 entries) ─────────
const liveCache = new LRUCache<string, string | null>(300);

// ── Local file ────────────────────────────────────────────────────────────────
let localData: Record<string, unknown> | null = null;
let localLoaded = false;

function getLocalData(): Record<string, unknown> | null {
  if (localLoaded) return localData;
  localLoaded = true;
  if (!existsSync(MHC_PATH)) return null;
  const raw = JSON.parse(readFileSync(MHC_PATH, "utf-8"));
  if (raw.__stub) return null;
  localData = raw;
  return raw;
}

// ── Book name → URL slugs ─────────────────────────────────────────────────────
// BibleHub uses lowercase with underscores:  "1_samuel", "song_of_solomon"
// StudyLight uses lowercase with hyphens:    "1-samuel", "song-of-solomon"

const BOOK_TO_BIBLEHUB: Record<string, string> = {
  "Genesis":"genesis","Exodus":"exodus","Leviticus":"leviticus","Numbers":"numbers",
  "Deuteronomy":"deuteronomy","Joshua":"joshua","Judges":"judges","Ruth":"ruth",
  "1 Samuel":"1_samuel","2 Samuel":"2_samuel","1 Kings":"1_kings","2 Kings":"2_kings",
  "1 Chronicles":"1_chronicles","2 Chronicles":"2_chronicles","Ezra":"ezra",
  "Nehemiah":"nehemiah","Esther":"esther","Job":"job","Psalms":"psalms",
  "Proverbs":"proverbs","Ecclesiastes":"ecclesiastes","Song of Solomon":"songs",
  "Isaiah":"isaiah","Jeremiah":"jeremiah","Lamentations":"lamentations",
  "Ezekiel":"ezekiel","Daniel":"daniel","Hosea":"hosea","Joel":"joel",
  "Amos":"amos","Obadiah":"obadiah","Jonah":"jonah","Micah":"micah",
  "Nahum":"nahum","Habakkuk":"habakkuk","Zephaniah":"zephaniah","Haggai":"haggai",
  "Zechariah":"zechariah","Malachi":"malachi",
  "Matthew":"matthew","Mark":"mark","Luke":"luke","John":"john","Acts":"acts",
  "Romans":"romans","1 Corinthians":"1_corinthians","2 Corinthians":"2_corinthians",
  "Galatians":"galatians","Ephesians":"ephesians","Philippians":"philippians",
  "Colossians":"colossians","1 Thessalonians":"1_thessalonians",
  "2 Thessalonians":"2_thessalonians","1 Timothy":"1_timothy","2 Timothy":"2_timothy",
  "Titus":"titus","Philemon":"philemon","Hebrews":"hebrews","James":"james",
  "1 Peter":"1_peter","2 Peter":"2_peter","1 John":"1_john","2 John":"2_john",
  "3 John":"3_john","Jude":"jude","Revelation":"revelation",
};

const BOOK_TO_STUDYLIGHT: Record<string, string> = {
  "Genesis":"genesis","Exodus":"exodus","Leviticus":"leviticus","Numbers":"numbers",
  "Deuteronomy":"deuteronomy","Joshua":"joshua","Judges":"judges","Ruth":"ruth",
  "1 Samuel":"1-samuel","2 Samuel":"2-samuel","1 Kings":"1-kings","2 Kings":"2-kings",
  "1 Chronicles":"1-chronicles","2 Chronicles":"2-chronicles","Ezra":"ezra",
  "Nehemiah":"nehemiah","Esther":"esther","Job":"job","Psalms":"psalms",
  "Proverbs":"proverbs","Ecclesiastes":"ecclesiastes","Song of Solomon":"song-of-solomon",
  "Isaiah":"isaiah","Jeremiah":"jeremiah","Lamentations":"lamentations",
  "Ezekiel":"ezekiel","Daniel":"daniel","Hosea":"hosea","Joel":"joel",
  "Amos":"amos","Obadiah":"obadiah","Jonah":"jonah","Micah":"micah",
  "Nahum":"nahum","Habakkuk":"habakkuk","Zephaniah":"zephaniah","Haggai":"haggai",
  "Zechariah":"zechariah","Malachi":"malachi",
  "Matthew":"matthew","Mark":"mark","Luke":"luke","John":"john","Acts":"acts",
  "Romans":"romans","1 Corinthians":"1-corinthians","2 Corinthians":"2-corinthians",
  "Galatians":"galatians","Ephesians":"ephesians","Philippians":"philippians",
  "Colossians":"colossians","1 Thessalonians":"1-thessalonians",
  "2 Thessalonians":"2-thessalonians","1 Timothy":"1-timothy","2 Timothy":"2-timothy",
  "Titus":"titus","Philemon":"philemon","Hebrews":"hebrews","James":"james",
  "1 Peter":"1-peter","2 Peter":"2-peter","1 John":"1-john","2 John":"2-john",
  "3 John":"3-john","Jude":"jude","Revelation":"revelation",
};

// ── URL builders ──────────────────────────────────────────────────────────────
function sourceUrls(book: string, chapter: number): { url: string; source: "biblehub" | "studylight" }[] {
  const urls: { url: string; source: "biblehub" | "studylight" }[] = [];

  const bhSlug = BOOK_TO_BIBLEHUB[book];
  if (bhSlug) {
    // MHC concise on BibleHub (static HTML, well-structured)
    urls.push({ url: `https://biblehub.com/commentaries/mhcw/${bhSlug}/${chapter}.htm`, source: "biblehub" });
  }

  const slSlug = BOOK_TO_STUDYLIGHT[book];
  if (slSlug) {
    // MHC complete on StudyLight (static HTML)
    urls.push({ url: `https://studylight.org/commentaries/eng/mhm/${slSlug}-${chapter}.html`, source: "studylight" });
  }

  return urls;
}

// Public reading link (shown as "Full text" button)
function publicUrl(book: string, chapter: number): string {
  const bhSlug = BOOK_TO_BIBLEHUB[book];
  return bhSlug
    ? `https://biblehub.com/commentaries/mhcw/${bhSlug}/${chapter}.htm`
    : `https://www.ccel.org/ccel/henry/mhcc.toc.html`;
}

// ── HTML → plain text (targeted per source) ───────────────────────────────────
function extractText(html: string, source: "biblehub" | "studylight"): string | null {
  let content = html;

  if (source === "biblehub") {
    // BibleHub wraps commentary in <div class="chap"> or <p> tags in main body
    // Pull the section between the commentary heading and the footer
    const start = content.search(/class="(?:chap|comm|mhcw|mhc)"/i);
    if (start > 0) {
      const closeTag = content.indexOf(">", start);
      content = content.slice(closeTag > start ? closeTag + 1 : start);
    }
    // Cut before the site footer / nav
    const footerIdx = content.search(/class="(?:footer|breadcrumb|topheading)"/i);
    if (footerIdx > 0) content = content.slice(0, footerIdx);
  }

  if (source === "studylight") {
    // StudyLight wraps commentary in <div class="commentary-unit"> or <article>
    const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) content = articleMatch[1];
    else {
      const unitMatch = content.match(/class="commentary[^"]*"[^>]*>([\s\S]*?)(?=<div class="(?:footer|sidebar|ad)|<\/body)/i);
      if (unitMatch) content = unitMatch[1];
    }
  }

  // Strip scripts, styles, nav elements
  content = content
    .replace(/<(script|style|nav|header|footer|aside|iframe)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Paragraphs / headings → newlines
  content = content.replace(/<\/?(p|br|h[1-6]|li|tr|div|blockquote)[^>]*>/gi, "\n");

  // Strip remaining tags
  content = content.replace(/<[^>]+>/g, "");

  // Decode entities
  content = content
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, " ");

  // Normalize whitespace
  content = content
    .replace(/\t/g, " ").replace(/ {2,}/g, " ")
    .replace(/\n /g, "\n").replace(/ \n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Filter out lines that are clearly boilerplate / navigation
  const boilerplate = [
    /^loading\.{0,3}$/i, /^please login/i, /^register to save/i,
    /^contents$/i, /^advertisement$/i, /^copyright/i, /^home$/i,
    /^bible$/i, /^commentaries$/i, /^search$/i, /^menu$/i,
    /^VIEWNAME/i, /^var /i, /^function /i,
  ];
  const lines = content.split("\n").filter(line => {
    const t = line.trim();
    if (!t || t.length < 3) return false;
    return !boilerplate.some(rx => rx.test(t));
  });

  const result = lines.join("\n").trim();

  // Minimum quality check — must have at least 300 chars of real content
  if (result.length < 300) return null;

  return result;
}

// ── Live fetch ────────────────────────────────────────────────────────────────
async function fetchLive(book: string, chapter: number): Promise<string | null> {
  const cacheKey = `${book}:${chapter}`;
  if (liveCache.has(cacheKey)) return liveCache.get(cacheKey) ?? null;

  const candidates = sourceUrls(book, chapter);

  for (const { url, source } of candidates) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ScriptureApp/1.0)",
          "Accept": "text/html",
        },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;

      const html = await res.text();
      const text = extractText(html, source);
      if (!text) continue;

      liveCache.set(cacheKey, text);
      return text;
    } catch {
      // try next source
    }
  }

  liveCache.set(cacheKey, null);
  return null;
}

// ── Local JSON extraction ─────────────────────────────────────────────────────
function extractFromLocal(data: Record<string, unknown>, book: string, chapter: number): string | null {
  const byBook = data[book] as Record<number, unknown> | undefined;
  if (byBook) {
    const ch = byBook[chapter];
    if (typeof ch === "string") return ch;
    if (ch && typeof (ch as Record<string, unknown>).text === "string")
      return (ch as Record<string, unknown>).text as string;
  }
  const key = `${book} ${chapter}`;
  const direct = data[key];
  if (typeof direct === "string") return direct;
  return null;
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // ── Rate limit: 30 req / min per IP ───────────────────────────────────────
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetMs - Date.now()) / 1000)) } }
    );
  }

  const book    = req.nextUrl.searchParams.get("book") ?? "";
  const chapter = parseInt(req.nextUrl.searchParams.get("chapter") ?? "0", 10);

  if (!book || !chapter) {
    return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
  }

  // ── Whitelist: only known books accepted ──────────────────────────────────
  if (!Object.prototype.hasOwnProperty.call(BOOK_TO_BIBLEHUB, book)) {
    return NextResponse.json({ error: "Invalid book name." }, { status: 400 });
  }

  // ── Chapter range ─────────────────────────────────────────────────────────
  if (chapter < 1 || chapter > 150) {
    return NextResponse.json({ error: "Invalid chapter number." }, { status: 400 });
  }

  const onlineUrl = publicUrl(book, chapter);
  const source    = "Matthew Henry's Commentary on the Whole Bible (1706–1714)";

  // 1. Try local file first
  const local = getLocalData();
  if (local) {
    const text = extractFromLocal(local, book, chapter);
    if (text) return NextResponse.json({ text, source, onlineUrl, unavailable: false });
  }

  // 2. Fetch live from static-HTML sources (BibleHub, StudyLight)
  const liveText = await fetchLive(book, chapter);
  if (liveText) {
    return NextResponse.json({ text: liveText, source, onlineUrl, unavailable: false });
  }

  // 3. Nothing worked — return unavailable with link
  return NextResponse.json({ text: null, source, onlineUrl, unavailable: true });
}
