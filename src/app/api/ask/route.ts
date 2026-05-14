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

CRITICAL RULE — NO EXCEPTIONS: If the user asks ANYTHING that involves personal opinion, personal advice, relationships, finances, health, life decisions, emotional support, or personal guidance of any kind, you MUST respond with EXACTLY this message and nothing else:
"That sounds like a personal question — please submit it to our Bible Teacher using the 'Ask a Pastor' button below. They'll respond to you personally by email."

Do not elaborate, do not add Scripture, do not offer alternatives. Just that exact message.

Always cite specific Bible verses (Book Chapter:Verse) when relevant. Keep answers clear and concise. Be warm and encouraging.`;

type Message = { role: "user" | "assistant"; content: string };

async function saveToChatLogs(
  supabaseUrl: string,
  serviceRoleKey: string,
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<string | null> {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/chat_logs`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ session_id: sessionId, role, content }),
    });
    if (res.ok) {
      const rows = await res.json();
      return rows?.[0]?.id ?? null;
    }
  } catch (err) {
    console.error("[ask] Supabase save error:", err);
  }
  return null;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI not configured" }, { status: 500 });
  }

  let messages: Message[];
  let sessionId: string;
  try {
    const body = await req.json();
    messages = body.messages;
    sessionId = body.sessionId ?? "unknown";
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
  const reply =
    data.choices?.[0]?.message?.content ??
    "I'm sorry, I couldn't generate a response. Please try again.";

  // Save to chat_logs if Supabase is configured
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let assistantMessageId: string | null = null;

  if (supabaseUrl && serviceRoleKey) {
    // Save the last user message
    const lastUserMessage = [...trimmed].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      await saveToChatLogs(
        supabaseUrl,
        serviceRoleKey,
        sessionId,
        "user",
        lastUserMessage.content
      );
    }
    // Save the assistant reply and capture its ID
    assistantMessageId = await saveToChatLogs(
      supabaseUrl,
      serviceRoleKey,
      sessionId,
      "assistant",
      reply
    );
  }

  return NextResponse.json({ reply, sessionId, messageId: assistantMessageId });
}
