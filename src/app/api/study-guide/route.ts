/**
 * POST /api/study-guide
 * Generates a full small-group Bible study guide for a passage.
 * Returns: { sections: StudyGuideSection[] }
 *
 * Sections: historical_context, discussion_questions, application, prayer_starters
 */
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const MAX_REF        = 60;
const MAX_VERSE_TEXT = 800;

export type StudyGuideSection =
  | { id: "historical_context"; title: string; content: string }
  | { id: "discussion_questions"; title: string; items: { text: string; tag: string }[] }
  | { id: "application"; title: string; items: string[] }
  | { id: "prayer_starters"; title: string; items: string[] };

function truncate(val: unknown, max: number): string {
  if (typeof val !== "string") return "";
  return val.slice(0, max).replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request: NextRequest) {
  const ip     = getClientIp(request);
  const result = rateLimit(ip, { limit: 6, windowMs: 60_000 });
  if (!result.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((result.resetMs - Date.now()) / 1000)) } }
    );
  }

  try {
    const body          = await request.json();
    const verseReference = truncate(body?.verseReference, MAX_REF);
    const verseText      = truncate(body?.verseText,      MAX_VERSE_TEXT);
    const lang           = body?.lang === "es" ? "es" : "en";

    if (!verseReference) {
      return NextResponse.json({ error: "Missing verse reference." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const isSpanish = lang === "es";

    const systemMessage = isSpanish
      ? `Eres un maestro bíblico experto que ayuda a líderes de grupos pequeños.
Genera una guía completa de estudio bíblico en ESPAÑOL para el pasaje proporcionado.

Devuelve SOLO JSON válido con esta estructura exacta:
{
  "sections": [
    {
      "id": "historical_context",
      "title": "Contexto Histórico",
      "content": "2-3 párrafos cortos sobre el contexto histórico, cultural y geográfico del pasaje."
    },
    {
      "id": "discussion_questions",
      "title": "Preguntas de Discusión",
      "items": [
        { "text": "pregunta aquí", "tag": "Observación" },
        { "text": "pregunta aquí", "tag": "Interpretación" },
        { "text": "pregunta aquí", "tag": "Reflexión personal" },
        { "text": "pregunta aquí", "tag": "Discusión grupal" },
        { "text": "pregunta aquí", "tag": "Aplicación" }
      ]
    },
    {
      "id": "application",
      "title": "Puntos de Aplicación",
      "items": [
        "punto de aplicación práctico 1",
        "punto de aplicación práctico 2",
        "punto de aplicación práctico 3"
      ]
    },
    {
      "id": "prayer_starters",
      "title": "Iniciadores de Oración",
      "items": [
        "Señor, ayúdame a...",
        "Padre, gracias por...",
        "Dios, que esta semana yo..."
      ]
    }
  ]
}

Reglas:
- Todo el contenido debe estar en español
- Las preguntas deben ser reflexivas, prácticas y accesibles
- Los puntos de aplicación deben ser concretos y alcanzables esta semana
- Sin markdown, sin formato adicional`
      : `You are an expert Bible teacher helping small group leaders.
Generate a complete small-group Bible study guide for the given passage.

Return ONLY valid JSON with this exact structure:
{
  "sections": [
    {
      "id": "historical_context",
      "title": "Historical Context",
      "content": "2-3 short paragraphs covering historical, cultural, and geographical background."
    },
    {
      "id": "discussion_questions",
      "title": "Discussion Questions",
      "items": [
        { "text": "question here", "tag": "Observation" },
        { "text": "question here", "tag": "Interpretation" },
        { "text": "question here", "tag": "Personal reflection" },
        { "text": "question here", "tag": "Group discussion" },
        { "text": "question here", "tag": "Application" }
      ]
    },
    {
      "id": "application",
      "title": "Application Points",
      "items": [
        "practical application point 1",
        "practical application point 2",
        "practical application point 3"
      ]
    },
    {
      "id": "prayer_starters",
      "title": "Prayer Starters",
      "items": [
        "Lord, help me to...",
        "Father, thank you for...",
        "God, may this week I..."
      ]
    }
  ]
}

Rules:
- Questions should be thoughtful, practical, and accessible to all group members
- Application points should be concrete and doable this week
- No markdown, no extra formatting`;

    const userMessage = `Passage: ${verseReference}${verseText ? `\n\nVerse text: ${verseText}` : ""}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user",   content: userMessage   },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("[study-guide] OpenAI error:", response.status);
      return NextResponse.json({ error: "AI service temporarily unavailable." }, { status: 502 });
    }

    const data = await response.json();
    const text: string = data.choices?.[0]?.message?.content ?? "";
    if (!text) return NextResponse.json({ error: "No response from AI." }, { status: 500 });

    let parsed: { sections: StudyGuideSection[] };
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Unexpected response format." }, { status: 500 });
    }

    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      return NextResponse.json({ error: "Unexpected response format." }, { status: 500 });
    }

    return NextResponse.json({ sections: parsed.sections });
  } catch (error) {
    console.error("[study-guide] Unhandled error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
