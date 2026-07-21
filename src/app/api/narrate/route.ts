import { type NextRequest, NextResponse } from "next/server";
import { EBOOK_NARRATION } from "@/lib/ebookNarration";

/**
 * GET /api/narrate?book=giant-storm&page=1
 *
 * Calls ElevenLabs TTS and streams the audio back as audio/mpeg.
 *
 * Required env vars:
 *   ELEVENLABS_API_KEY  — your ElevenLabs API key
 *
 * Optional env vars:
 *   ELEVENLABS_VOICE_ID — defaults to "Rachel" (21m00Tcm4TlvDq8ikWAM)
 *                         Find voice IDs at elevenlabs.io/voice-library
 */

const ELEVENLABS_BASE   = "https://api.elevenlabs.io/v1";
const DEFAULT_VOICE_ID  = "21m00Tcm4TlvDq8ikWAM"; // Rachel — warm, clear, great for kids
const DEFAULT_MODEL     = "eleven_monolingual_v1";

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
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured" },
      { status: 503 }
    );
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? DEFAULT_VOICE_ID;

  // ── Build narration text ───────────────────────────────────────
  // Read the page title first, then the body text
  const narrationText = `${page.title}. ${page.text}`;

  // ── Call ElevenLabs ────────────────────────────────────────────
  try {
    const elevenRes = await fetch(
      `${ELEVENLABS_BASE}/text-to-speech/${voiceId}`,
      {
        method:  "POST",
        headers: {
          "xi-api-key":   apiKey,
          "Content-Type": "application/json",
          "Accept":       "audio/mpeg",
        },
        body: JSON.stringify({
          text:      narrationText,
          model_id:  DEFAULT_MODEL,
          voice_settings: {
            stability:        0.55,   // slightly higher = more consistent (good for kids)
            similarity_boost: 0.75,
            style:            0.30,   // a little expressiveness
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errorBody = await elevenRes.text();
      console.error("ElevenLabs error:", elevenRes.status, errorBody);
      return NextResponse.json(
        { error: `ElevenLabs error: ${elevenRes.status}` },
        { status: 502 }
      );
    }

    // Stream audio back with cache headers (same page → same audio)
    const audioBuffer = await elevenRes.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status:  200,
      headers: {
        "Content-Type":  "audio/mpeg",
        "Cache-Control": "public, max-age=86400, immutable", // cache 24h at CDN
      },
    });
  } catch (err) {
    console.error("Narrate API error:", err);
    return NextResponse.json({ error: "Failed to fetch narration" }, { status: 500 });
  }
}
