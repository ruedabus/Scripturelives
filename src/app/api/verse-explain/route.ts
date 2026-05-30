/**
 * POST /api/verse-explain
 * Body: { reference: string, text: string }
 * Returns: { explanation: string, source: string }
 *
 * Flow:
 *  1. Fetch NET Bible translator notes from labs.bible.org (formatting=full)
 *  2. Extract footnote text from the HTML response
 *  3. Feed notes + verse to GPT-4o-mini to produce a readable 2-3 sentence insight
 *  4. Fall back to pure-AI explanation if NET notes fetch fails
 *
 * Source attribution:
 *  - "NET Bible Translator Notes" when notes are available
 *  - "Scripture Lives AI" for pure-AI fallback
 */
import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "@/lib/lruCache";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// ── Cache ────────────────────────────────────────────────────────────────────
type CachedResult = { explanation: string; source: string };
const cache = new LRUCache<string, CachedResult>(500);

// ── NET Bible note fetcher ────────────────────────────────────────────────────

/**
 * Convert "John 3:16" → "John+3:16" for labs.bible.org
 */
function toLabsPassage(reference: string): string {
  return reference.trim().replace(/\s+/g, "+");
}

/**
 * Strip HTML tags from a string, collapsing whitespace.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Extract NET translator footnotes from labs.bible.org HTML response.
 * Notes are wrapped in <span class="fn">…</span>.
 * Returns a cleaned string of all notes joined, or null if none found.
 */
function extractNetNotes(html: string): string | null {
  const noteMatches = [...html.matchAll(/<span[^>]*class=["']fn["'][^>]*>([\s\S]*?)<\/span>/gi)];
  if (noteMatches.length === 0) return null;
  const notes = noteMatches
    .map(([, inner]) => stripHtml(inner).trim())
    .filter(Boolean);
  return notes.length > 0 ? notes.join(" | ") : null;
}

/**
 * Fetch NET Bible verse text + translator notes from labs.bible.org.
 * Returns { verseText, notes } or null on failure.
 */
async function fetchNetNotes(
  reference: string
): Promise<{ verseText: string; notes: string } | null> {
  try {
    const passage = toLabsPassage(reference);
    const url = `https://labs.bible.org/api/?passage=${passage}&type=json&formatting=full`;
    const res = await fetch(url, {
      headers: { "User-Agent": "ScriptureLives/1.0 (scripture-lives.vercel.app)" },
      signal: AbortSignal.timeout(4_000),
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    // Combine all verse segments (multi-verse references return multiple items)
    const fullHtml = data.map((v: { text: string }) => v.text ?? "").join(" ");
    const notes = extractNetNotes(fullHtml);
    const verseText = stripHtml(fullHtml);

    if (!notes) return null;
    return { verseText, notes };
  } catch {
    return null;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit: 20 requests/minute per IP
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 20, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetMs - Date.now()) / 1000)) } }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
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

  // ── Cache check ─────────────────────────────────────────────────────────────
  const cacheKey = reference.toLowerCase();
  if (cache.has(cacheKey)) {
    return NextResponse.json(cache.get(cacheKey));
  }

  // ── 1. Try NET Bible translator notes ───────────────────────────────────────
  const netData = await fetchNetNotes(reference);

  let systemPrompt: string;
  let userPrompt: string;
  let source: string;

  if (netData) {
    // Grounded in NET translator scholarship
    systemPrompt = `You are a warm, knowledgeable Bible teacher. You have been given a Bible verse and its NET Bible translator notes — scholarly footnotes written by modern Bible scholars explaining translation decisions, original language nuances, and historical context. Using these notes as your primary source, write a short devotional explanation in exactly 2–3 sentences. Cover: (1) the key meaning or context the notes reveal, and (2) one practical application for everyday faith. Keep language accessible and encouraging. Do NOT include the verse text itself, do NOT start with "This verse", and do NOT use filler phrases like "In this passage". Cite the insight naturally — e.g. "The original Hebrew here..." or "Scholars note that...".`;
    userPrompt = `Verse: ${reference}\nVerse text: "${text}"\n\nNET Bible Translator Notes:\n${netData.notes}`;
    source = "NET Bible Translator Notes";
  } else {
    // Pure AI fallback
    systemPrompt = `You are a warm, knowledgeable Bible teacher. When given a Bible verse, write a short devotional explanation in exactly 2–3 sentences. Cover: (1) what the verse means in its original context, and (2) one practical application for everyday faith. Keep language accessible and encouraging. Do NOT include the verse text itself, do NOT start with "This verse", and do NOT use filler phrases like "In this passage". Just dive straight into the meaning.`;
    userPrompt = `Verse: ${reference}\n"${text}"`;
    source = "Scripture Lives AI";
  }

  // ── 2. GPT-4o-mini summarisation ────────────────────────────────────────────
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
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
      const err = await res.text();
      console.error("[verse-explain] OpenAI error:", err);
      return NextResponse.json({ error: "AI error" }, { status: 502 });
    }

    const data = await res.json();
    const explanation: string = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!explanation) {
      return NextResponse.json({ error: "No explanation returned" }, { status: 502 });
    }

    const result: CachedResult = { explanation, source };
    cache.set(cacheKey, result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[verse-explain] fetch error:", err);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
