/**
 * POST /api/verse-explain
 * Body: { reference: string, text: string }
 * Returns: { explanation: string, source: string }
 *
 * Produces a short scholarly devotional explanation grounded in:
 *  - Original language (Greek / Hebrew) word meanings
 *  - Historical and cultural context
 *  - One practical application for everyday faith
 */
import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "@/lib/lruCache";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// ── Cache ────────────────────────────────────────────────────────────────────
type CachedResult = { explanation: string; source: string };
const cache = new LRUCache<string, CachedResult>(500);

// ── OT book set (for Greek vs Hebrew detection) ──────────────────────────────
const OT_BOOKS = new Set([
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges",
  "Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles",
  "Ezra","Nehemiah","Esther","Job","Psalm","Psalms","Proverbs","Ecclesiastes",
  "Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel",
  "Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk",
  "Zephaniah","Haggai","Zechariah","Malachi",
]);

function getLanguage(reference: string): "Hebrew" | "Greek" {
  const book = reference.replace(/\s+\d+:\d+$/, "").trim();
  return OT_BOOKS.has(book) ? "Hebrew" : "Greek";
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

  const lang = getLanguage(reference);

  const systemPrompt = `You are a biblical scholar and pastor with deep expertise in ${lang} linguistics, Second Temple Jewish history, and early church history. When given a Bible verse, write a devotional insight in exactly 2–3 sentences following this structure:

Sentence 1: Highlight something specific from the original ${lang} — name the key word in ${lang} (transliterated), explain what it actually means, and why it matters for understanding this verse. Example: "The ${lang === "Greek" ? "Greek" : "Hebrew"} word here is [word], meaning [definition], which..."

Sentence 2: Give the historical or cultural context a first-century reader (or ancient Israelite for OT) would have immediately understood that modern readers miss.

Sentence 3: One concrete, practical application for everyday faith — specific and actionable, not generic.

Rules:
- Do NOT restate the verse text
- Do NOT start with "This verse" or "In this passage"
- DO name the actual ${lang} word (transliterated) in sentence 1
- Keep total length to 3 sentences maximum
- Write in a warm, accessible tone — scholarly but not academic`;

  const userPrompt = `Verse: ${reference}\n"${text}"`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt },
        ],
        max_tokens: 220,
        temperature: 0.5,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      console.error("[verse-explain] OpenAI error:", await res.text());
      return NextResponse.json({ error: "AI error" }, { status: 502 });
    }

    const data = await res.json();
    const explanation: string = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!explanation) return NextResponse.json({ error: "No explanation returned" }, { status: 502 });

    const result: CachedResult = {
      explanation,
      source: "Biblical Scholarship · Original Languages · Powered by AI",
    };
    cache.set(cacheKey, result);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[verse-explain] fetch error:", err);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
