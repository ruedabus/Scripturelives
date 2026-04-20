import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// ── Field length limits ───────────────────────────────────────────────────────
const MAX_PLACE      = 120;
const MAX_ERA        = 120;
const MAX_DESC       = 500;
const MAX_ANCIENT    = 500;
const MAX_SIG        = 500;
const MAX_REF        = 40;
const MAX_VERSE_TEXT = 500;

type StudyPrompt = {
  id: string;
  title: string;
  prompt: string;
};

function truncate(val: unknown, max: number): string {
  if (typeof val !== "string") return "";
  return val.slice(0, max).replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request: NextRequest) {
  // ── Rate limit: 8 LLM calls / minute per IP ───────────────────────────────
  const ip     = getClientIp(request);
  const result = rateLimit(ip, { limit: 8, windowMs: 60_000 });
  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((result.resetMs - Date.now()) / 1000)) },
      }
    );
  }

  try {
    const body = await request.json();

    // ── Sanitise & clamp all user-supplied fields ─────────────────────────
    const placeName            = truncate(body?.placeName,            MAX_PLACE);
    const era                  = truncate(body?.era,                  MAX_ERA);
    const description          = truncate(body?.description,          MAX_DESC);
    const ancientDescription   = truncate(body?.ancientDescription,   MAX_ANCIENT);
    const biblicalSignificance = truncate(body?.biblicalSignificance, MAX_SIG);
    const verseReference       = truncate(body?.verseReference,       MAX_REF);
    const verseText            = truncate(body?.verseText,            MAX_VERSE_TEXT);

    if (!placeName || !verseReference || !verseText) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    // ── Separate system role from user-supplied content ───────────────────
    // This prevents user values from escaping into the system instruction.
    const systemMessage = `\
You are helping build a Bible study app called Scripture Lives.

Generate exactly 4 thoughtful study prompts in JSON format for a selected biblical place.

Return ONLY valid JSON in this shape:
{
  "prompts": [
    { "id": "string", "title": "string", "prompt": "string" }
  ]
}

Requirements:
- Each prompt should be practical, readable, and spiritually thoughtful.
- Make them distinct from each other.
- Focus on historical context, biblical theology, reflection, and teaching/application.
- Do not include markdown.
- Keep each title short (under 8 words).
- Keep each prompt between 1 and 3 sentences.`;

    const userMessage = `\
Selected place context:
Place: ${placeName}
Era: ${era}
Description: ${description}
Ancient Description: ${ancientDescription}
Biblical Significance: ${biblicalSignificance}
Verse Reference: ${verseReference}
Verse Text: ${verseText}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user",   content: userMessage   },
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      // Do NOT forward the raw OpenAI error — it may contain billing/quota info
      console.error("[study-prompts] OpenAI error:", response.status);
      return NextResponse.json(
        { error: "The AI service is temporarily unavailable. Please try again shortly." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text: string = data.choices?.[0]?.message?.content ?? "";

    if (!text) {
      return NextResponse.json(
        { error: "No response received from the AI service." },
        { status: 500 }
      );
    }

    let parsed: { prompts: StudyPrompt[] };
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Unexpected response format from AI service." },
        { status: 500 }
      );
    }

    if (!parsed.prompts || !Array.isArray(parsed.prompts)) {
      return NextResponse.json(
        { error: "Unexpected response format from AI service." },
        { status: 500 }
      );
    }

    return NextResponse.json({ prompts: parsed.prompts });
  } catch (error) {
    console.error("[study-prompts] Unhandled error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
