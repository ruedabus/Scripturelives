import { type NextRequest, NextResponse } from "next/server";
import { EBOOK_NARRATION } from "@/lib/ebookNarration";

/**
 * GET /api/narrate?book=giant-storm&page=1
 *
 * Calls OpenAI TTS and streams the audio back as audio/mpeg.
 *
 * Required env vars:
 *   OPENAI_API_KEY — your OpenAI API key
 *
 * Optional env vars:
 *   OPENAI_TTS_VOICE — defaults to "nova" (warm, clear, great for kids)
 *                      Options: alloy, echo, fable, onyx, nova, shimmer
 */

const OPENAI_TTS_URL  = "https://api.openai.com/v1/audio/speech";
const DEFAULT_VOICE   = "fable";  // expressive, storytelling feel
const DEFAULT_MODEL   = "tts-1";  // use "tts-1-hd" for higher quality

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const bookSlug  = searchParams.get("book")  ?? "";
  const pageParam = searchParams.get("page")  ?? "1";
  const pageIndex = parseInt(pageParam, 10);   // 1-based

  // ── Validate book ──────────────────────────────────────────────
  const book = EBOOK_NARRATION[bookSlug];
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  // ── Validate page ──────────────────────────────────────────────
  const page = book.pages[pageIndex - 1];
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  // ── Check API key ──────────────────────────────────────────────
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 503 }
    );
  }

  const voice = process.env.OPENAI_TTS_VOICE ?? DEFAULT_VOICE;

  // ── Build narration text ───────────────────────────────────────
  const narrationText = `${page.title}. ${page.text}`;

  // ── Call OpenAI TTS ────────────────────────────────────────────
  try {
    const openaiRes = await fetch(OPENAI_TTS_URL, {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        input: narrationText,
        voice,
      }),
    });

    if (!openaiRes.ok) {
      const errorBody = await openaiRes.text();
      console.error("OpenAI TTS error:", openaiRes.status, errorBody);
      return NextResponse.json(
        { error: `OpenAI TTS error: ${openaiRes.status}`, detail: errorBody },
        { status: 502 }
      );
    }

    const audioBuffer = await openaiRes.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status:  200,
      headers: {
        "Content-Type":  "audio/mpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (err) {
    console.error("Narrate API error:", err);
    return NextResponse.json({ error: "Failed to fetch narration" }, { status: 500 });
  }
}
