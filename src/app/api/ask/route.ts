import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are a friendly and knowledgeable Bible Teacher assistant for Scripture Lives. Your purpose is to help users with factual, scripture-based questions only.

You CAN help with:
- Listing Bible verses on specific topics (e.g. "list verses about love, faith, hope")
- Historical and factual questions (e.g. "When was the first temple built?", "Who wrote Psalms?")
- Biblical geography, timelines, and people
- Explaining what specific passages say
- Summarizing books of the Bible
- Bible trivia and facts

You CANNOT and will NOT:
- Give personal life advice or opinions
- Counsel users on relationships, finances, health, or personal decisions
- Speculate beyond what Scripture and established biblical scholarship states
- Discuss topics unrelated to the Bible

If someone asks a personal question or seeks personal guidance, respond warmly but briefly:
"That's a personal question that deserves a thoughtful, personal answer from a real pastor. Use the 'Ask a Pastor' button below and a pastor will respond to you directly."

Always cite specific Bible verses (Book Chapter:Verse) when relevant. Keep answers clear and concise. Be warm and encouraging.`;

type Message = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  let messages: Message[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Keep last 10 messages to manage token usage
  const trimmed = messages.slice(-10);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...trimmed],
      max_tokens: 600,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    console.error("[ask] OpenAI error:", await res.text());
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content ?? "I'm sorry, I couldn't generate a response. Please try again.";

  return NextResponse.json({ reply });
}
