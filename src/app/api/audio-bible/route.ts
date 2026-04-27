import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const ESV_API_KEY = process.env.ESV_API_KEY;

// Some book names need slight adjustment for ESV query format
const ESV_BOOK_MAP: Record<string, string> = {
  "Song of Songs":   "Song of Solomon",
  "Revelation":      "Revelation",
  "Psalms":          "Psalm",
};

function toEsvQuery(book: string, chapter: number): string {
  const mapped = ESV_BOOK_MAP[book] ?? book;
  return `${mapped} ${chapter}`;
}

export async function GET(req: NextRequest) {
  // ── Rate limit: 20 audio requests / min per IP ─────────────────────────────
  const ip = getClientIp(req);
  const { allowed } = rateLimit(ip, { limit: 20, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // ── Check config ───────────────────────────────────────────────────────────
  if (!ESV_API_KEY) {
    return NextResponse.json(
      { error: "Audio Bible not configured — add ESV_API_KEY to environment" },
      { status: 503 }
    );
  }

  // ── Validate params ────────────────────────────────────────────────────────
  const { searchParams } = new URL(req.url);
  const book    = (searchParams.get("book") ?? "").trim().slice(0, 60);
  const chapter = parseInt(searchParams.get("chapter") ?? "1", 10);

  if (!book) {
    return NextResponse.json({ error: "Missing book parameter" }, { status: 400 });
  }
  if (isNaN(chapter) || chapter < 1 || chapter > 150) {
    return NextResponse.json({ error: "Invalid chapter" }, { status: 400 });
  }

  // ── Fetch audio from ESV API ───────────────────────────────────────────────
  const query = toEsvQuery(book, chapter);
  const url   = `https://api.esv.org/v3/passage/audio/?q=${encodeURIComponent(query)}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        Authorization: `Token ${ESV_API_KEY}`,
      },
      // 30-second timeout
      signal: AbortSignal.timeout(30_000),
    });

    if (!upstream.ok) {
      console.error(`ESV audio fetch failed: ${upstream.status} for "${query}"`);
      return NextResponse.json({ error: "Audio unavailable" }, { status: 502 });
    }

    // Stream the MP3 back to the client, cache for 24 hours
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type":  "audio/mpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
        "X-Passage":     query,
      },
    });
  } catch (err) {
    console.error("ESV audio error:", err);
    return NextResponse.json({ error: "Audio unavailable" }, { status: 502 });
  }
}
