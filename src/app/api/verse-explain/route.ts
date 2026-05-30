/**
 * POST /api/verse-explain
 * Body: { reference: string, text: string }
 * Returns: { explanation: string, source: string }
 *
 * Flow:
 *  1. Parse reference → book / chapter / verse
 *  2. Fetch NET Bible (NET2full) translator notes from STEPBible  ← primary
 *  3. Fall back to labs.bible.org NET API                         ← secondary
 *  4. Fall back to pure-AI explanation                            ← last resort
 */
import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "@/lib/lruCache";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// ── Cache ────────────────────────────────────────────────────────────────────
type CachedResult = { explanation: string; source: string };
const cache = new LRUCache<string, CachedResult>(500);

// ── Book name → STEPBible abbreviation ──────────────────────────────────────
const BOOK_TO_STEP: Record<string, string> = {
  "Genesis":"Gen","Exodus":"Exod","Leviticus":"Lev","Numbers":"Num",
  "Deuteronomy":"Deut","Joshua":"Josh","Judges":"Judg","Ruth":"Ruth",
  "1 Samuel":"1Sam","2 Samuel":"2Sam","1 Kings":"1Kgs","2 Kings":"2Kgs",
  "1 Chronicles":"1Chr","2 Chronicles":"2Chr","Ezra":"Ezra",
  "Nehemiah":"Neh","Esther":"Esth","Job":"Job","Psalm":"Ps","Psalms":"Ps",
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

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Parse "2 Samuel 1:6" → { book, chapter, verse } or null */
function parseRef(reference: string): { book: string; chapter: number; verse: number } | null {
  const m = reference.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!m) return null;
  return { book: m[1].trim(), chapter: parseInt(m[2], 10), verse: parseInt(m[3], 10) };
}

/** Strip HTML tags and decode entities */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ").trim();
}

/** Extract footnote/note spans from HTML (various class names used by different sources) */
function extractNotes(html: string): string | null {
  // Match <span class="fn">, <span class="note">, <span class="tn">, etc.
  const noteRegex = /<span[^>]*class=["'][^"']*(?:fn|note|tn|sn)[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi;
  const matches = [...html.matchAll(noteRegex)];
  if (matches.length === 0) return null;
  const notes = matches
    .map(([, inner]) => stripHtml(inner).trim())
    .filter(n => n.length > 10); // skip very short fragments
  return notes.length > 0 ? notes.slice(0, 6).join(" | ") : null;
}

// ── Primary: STEPBible NET2full ───────────────────────────────────────────────

async function fetchStepNotes(reference: string): Promise<string | null> {
  const parsed = parseRef(reference);
  if (!parsed) return null;

  const stepAbbr = BOOK_TO_STEP[parsed.book];
  if (!stepAbbr) return null;

  const ref = `${stepAbbr}.${parsed.chapter}.${parsed.verse}`;
  const url = `https://api.stepbible.org/v1/rest/passage/text?version=NET2full&reference=${encodeURIComponent(ref)}&options=VHN`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ScriptureLives/1.0" },
      signal: AbortSignal.timeout(6_000),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    if (!res.ok) return null;
    const data = await res.json();
    const html: string = data?.passageText?.passage ?? "";
    if (!html) return null;
    return extractNotes(html);
  } catch {
    return null;
  }
}

// ── Secondary: labs.bible.org NET ────────────────────────────────────────────

async function fetchLabsNotes(reference: string): Promise<string | null> {
  try {
    const passage = reference.trim().replace(/\s+/g, "+");
    const url = `https://labs.bible.org/api/?passage=${passage}&type=json&formatting=full`;
    const res = await fetch(url, {
      headers: { "User-Agent": "ScriptureLives/1.0 (https://scripturelives.com)" },
      signal: AbortSignal.timeout(6_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const fullHtml = data.map((v: { text: string }) => v.text ?? "").join(" ");
    return extractNotes(fullHtml);
  } catch {
    return null;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetMs - Date.now()) / 1000)) } }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI not configured" }, { status: 500 });

  let reference: string;
  let text: string;
  try {
    const body = await req.json();
    reference = (body.reference ?? "").trim().slice(0, 80);
    text      = (body.text      ?? "").trim().slice(0, 500);
    if (!reference || !text) throw new Error();
  } catch {
    return NextResponse.json({ error: "Provide reference and text" }, { status: 400 });
  }

  const cacheKey = reference.toLowerCase();
  if (cache.has(cacheKey)) return NextResponse.json(cache.get(cacheKey));

  // ── 1. Try to get NET Bible notes (primary → secondary) ──────────────────
  let notes: string | null = await fetchStepNotes(reference);
  if (!notes) notes = await fetchLabsNotes(reference);

  // ── 2. Build prompts ──────────────────────────────────────────────────────
  let systemPrompt: string;
  let userPrompt: string;
  let source: string;

  if (notes) {
    systemPrompt = `You are a warm, knowledgeable Bible teacher. You have been given a Bible verse and its NET Bible translator notes — scholarly footnotes written by modern Bible scholars explaining translation decisions, original language nuances, and historical context. Using these notes as your primary source, write a short devotional explanation in exactly 2–3 sentences. Cover: (1) the key meaning or context the notes reveal, and (2) one practical application for everyday faith. Keep language accessible and encouraging. Do NOT include the verse text itself, do NOT start with "This verse", and do NOT use filler phrases like "In this passage". Naturally reference the scholarship when relevant — e.g. "The original Hebrew here..." or "Scholars note that...".`;
    userPrompt = `Verse: ${reference}\nVerse text: "${text}"\n\nNET Bible Translator Notes:\n${notes}`;
    source = "NET Bible Translator Notes";
  } else {
    systemPrompt = `You are a warm, knowledgeable Bible teacher. When given a Bible verse, write a short devotional explanation in exactly 2–3 sentences. Cover: (1) what the verse means in its original context, and (2) one practical application for everyday faith. Keep language accessible and encouraging. Do NOT include the verse text itself, do NOT start with "This verse", and do NOT use filler phrases like "In this passage". Just dive straight into the meaning.`;
    userPrompt = `Verse: ${reference}\n"${text}"`;
    source = "Scripture Lives AI";
  }

  // ── 3. GPT-4o-mini summarisation ─────────────────────────────────────────
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt },
        ],
        max_tokens: 180,
        temperature: 0.6,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      console.error("[verse-explain] OpenAI error:", await res.text());
      return NextResponse.json({ error: "AI error" }, { status: 502 });
    }

    const data = await res.json();
    const explanation: string = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!explanation) return NextResponse.json({ error: "No explanation returned" }, { status: 502 });

    const result: CachedResult = { explanation, source };
    cache.set(cacheKey, result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[verse-explain] fetch error:", err);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
