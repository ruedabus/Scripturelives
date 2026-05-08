/**
 * GET  /api/prayer          — fetch public prayer requests (newest first, limit 50)
 * POST /api/prayer          — submit a new prayer request
 *
 * Stores in Supabase `prayer_requests` table.
 * Optionally emails Steven via Resend when RESEND_API_KEY is set.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

// ── Supabase server client ────────────────────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Resend email ──────────────────────────────────────────────────────────────
const TO_EMAIL   = "ruedabus1@yahoo.com";
const FROM_EMAIL = "prayer@scripturelives.com";
const RESEND_URL = "https://api.resend.com/emails";

async function sendPrayerEmail(data: {
  name: string | null;
  email: string | null;
  message: string;
  isPublic: boolean;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // silently skip if not configured

  const displayName = data.name?.trim() || "Anonymous";
  const visibility  = data.isPublic ? "✅ Public (visible on Prayer Wall)" : "🔒 Private (not shown publicly)";

  await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:    `Scripture Lives Prayer Wall <${FROM_EMAIL}>`,
      to:      [TO_EMAIL],
      replyTo: data.email?.trim() || undefined,
      subject: `🙏 New Prayer Request from ${displayName} — Scripture Lives`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#faf8f3;border-radius:12px;border:1px solid #ede8de">
          <div style="text-align:center;margin-bottom:28px">
            <p style="font-size:40px;margin:0">🙏</p>
            <h1 style="color:#1a2640;font-size:22px;margin:8px 0 0">New Prayer Request</h1>
            <p style="color:#C9952A;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:4px 0 0">Scripture Lives Prayer Wall</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr>
              <td style="padding:8px 0;color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;width:90px">From</td>
              <td style="padding:8px 0;color:#1a2640;font-weight:600">${displayName}</td>
            </tr>
            ${data.email ? `
            <tr>
              <td style="padding:8px 0;color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Email</td>
              <td style="padding:8px 0"><a href="mailto:${data.email.trim()}" style="color:#C9952A">${data.email.trim()}</a></td>
            </tr>` : ""}
            <tr>
              <td style="padding:8px 0;color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Visibility</td>
              <td style="padding:8px 0;color:#1a2640">${visibility}</td>
            </tr>
          </table>

          <div style="background:white;border-radius:10px;padding:24px;border:1px solid #ede8de;border-left:4px solid #C9952A">
            <p style="color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px">Prayer Request</p>
            <p style="color:#1a2640;line-height:1.8;margin:0;white-space:pre-wrap">${data.message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>

          <blockquote style="margin:24px 0;border-left:3px solid #C9952A;padding-left:16px;color:#6b7280;font-style:italic;font-size:13px">
            "The prayer of a righteous person is powerful and effective." — James 5:16
          </blockquote>

          <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:24px">
            Received via scripturelives.com/prayer
            ${data.email ? " · Reply to this email to respond directly to the requester" : ""}
          </p>
        </div>
      `,
    }),
  }).catch((err) => console.error("[prayer] Resend error:", err));
}

// ── GET — fetch public prayers ─────────────────────────────────────────────────
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("id, name, message, pray_count, created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ requests: data ?? [] });
  } catch (e) {
    console.error("[prayer GET]", e);
    return NextResponse.json({ requests: [] });
  }
}

// ── POST — submit a prayer request ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many submissions. Please wait a moment." }, { status: 429 });
  }

  let body: { name?: string; email?: string; message?: string; isPublic?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const message  = (body.message ?? "").trim().slice(0, 2000);
  const name     = (body.name   ?? "").trim().slice(0, 80) || null;
  const email    = (body.email  ?? "").trim().slice(0, 254) || null;
  const isPublic = body.isPublic !== false; // default public

  if (message.length < 10) {
    return NextResponse.json({ error: "Please write at least a short prayer request." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("prayer_requests").insert({
      name,
      email,
      message,
      is_public: isPublic,
      pray_count: 0,
    });
    if (error) throw error;

    // Fire-and-forget email
    sendPrayerEmail({ name, email, message, isPublic });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[prayer POST]", e);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }
}
