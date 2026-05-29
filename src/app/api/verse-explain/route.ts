/**
 * POST /api/verse-explain
 * Body: { reference: string, text: string }
 * Returns: { explanation: string }
 *
 * Generates a short 2–3 sentence devotional explanation of a Bible verse
 * using OpenAI GPT-4o-mini.
 */
import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "@/lib/lruCache";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Cache up to 500 explanations so repeated taps don't burn API calls
const cache = new LRUCache<string, string>(500);

export async function POST(req: NextRequest) {
  // Rate limit: 20 verse explains per minute per IP
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
  if (cache.has(cacheKey)) {
    return NextResponse.json({ explanation: cache.get(cacheKey) });
  }

  const systemPrompt = `You are a warm, knowledgeable Bible teacher. When given a Bible verse, write a short devotional explanation in exactly 2–3 sentences. Cover: (1) what the verse means in its original context, and (2) one practical application for everyday faith. Keep language accessible and encouraging. Do NOT include the verse text itself, do NOT start with "This verse", and do NOT use filler phrases like "In this passage". Just dive straight into the meaning.`;

  const userPrompt = `Verse: ${reference}\n"${text}"`;

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
        max_tokens: 150,
        temperature: 0.7,
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

    cache.set(cacheKey, explanation);
    return NextResponse.json({ explanation });
  } catch (err) {
    console.error("[verse-explain] fetch error:", err);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
