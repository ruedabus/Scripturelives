import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let messageId: string;
  let reason: string | undefined;

  try {
    const body = await req.json();
    messageId = body.messageId;
    reason = body.reason;
    if (!messageId) throw new Error("Missing messageId");
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceRoleKey) {
    try {
      await fetch(
        `${supabaseUrl}/rest/v1/chat_logs?id=eq.${encodeURIComponent(messageId)}`,
        {
          method: "PATCH",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ flagged: true, flag_reason: reason ?? null }),
        }
      );
    } catch (err) {
      console.error("[flag-message] Supabase error:", err);
    }
  }

  return NextResponse.json({ success: true });
}
