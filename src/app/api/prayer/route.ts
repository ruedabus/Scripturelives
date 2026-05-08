/**
 * GET  /api/prayer          — fetch public prayer requests (newest first, limit 50)
 * POST /api/prayer          — submit a new prayer request
 *
 * Uses the same SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars as the
 * tournament store — no separate Supabase project needed.
 *
 * Table schema (run once in Supabase SQL Editor):
 *   create table prayer_requests (
 *     id         uuid        default gen_random_uuid() primary key,
 *     name       text,
 *     email      text,
 *     message    text        not null,
 *     is_public  boolean     default true,
 *     pray_count integer     default 0,
 *     created_at timestamptz default now()
 *   );
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

// ── Supabase REST helpers (same pattern as tournamentStore) ───────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_KEY);

function sbHeaders() {
  return {
    apikey:         SUPABASE_KEY!,
    Authorization:  `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}
const TABLE = () => `${SUPABASE_URL?.replace(/\/+$/, "")}/rest/v1/prayer_requests`;

// ── In-memory fallback for local dev (resets on server restart) ───────────────
type PrayerRow = {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  is_public: boolean;
  pray_count: number;
  created_at: string;
};

const memStore: PrayerRow[] = [];
function memId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
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
  if (!apiKey) return;

  const displayName = data.name?.trim() || "Anonymous";
  const visibility  = data.isPublic ? "✅ Public (visible on Prayer Wall)" : "🔒 Private";

  await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
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
            ${data.email ? `<tr>
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
            Received via scripturelives.com/prayer${data.email ? " · Reply to respond directly" : ""}
          </p>
        </div>
      `,
    }),
  }).catch((err) => console.error("[prayer] Resend error:", err));
}

// ── GET — fetch public prayers ────────────────────────────────────────────────
export async function GET() {
  try {
    if (USE_SUPABASE) {
      const res = await fetch(
        `${TABLE()}?is_public=eq.true&order=created_at.desc&limit=50&select=id,name,message,pray_count,created_at`,
        { headers: sbHeaders(), cache: "no-store" }
      );
      if (!res.ok) throw new Error(`Supabase GET ${res.status}`);
      const rows = await res.json();
      return NextResponse.json({ requests: rows ?? [] });
    } else {
      // Local dev fallback
      const rows = memStore
        .filter((r) => r.is_public)
        .slice()
        .reverse()
        .slice(0, 50)
        .map(({ id, name, message, pray_count, created_at }) => ({ id, name, message, pray_count, created_at }));
      return NextResponse.json({ requests: rows });
    }
  } catch (e) {
    console.error("[prayer GET]", e);
    return NextResponse.json({ requests: [] });
  }
}

// ── POST — submit a prayer request ───────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many submissions. Please wait a moment." }, { status: 429 });
  }

  let body: { name?: string; email?: string; message?: string; isPublic?: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const message  = (body.message ?? "").trim().slice(0, 2000);
  const name     = (body.name   ?? "").trim().slice(0, 80)  || null;
  const email    = (body.email  ?? "").trim().slice(0, 254) || null;
  const isPublic = body.isPublic !== false;

  if (message.length < 10) {
    return NextResponse.json({ error: "Please write at least a short prayer request." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    if (USE_SUPABASE) {
      const res = await fetch(TABLE(), {
        method:  "POST",
        headers: { ...sbHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({ name, email, message, is_public: isPublic, pray_count: 0 }),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => "");
        console.error("[prayer POST] Supabase error:", err);
        throw new Error(`Supabase INSERT failed (${res.status})`);
      }
    } else {
      // Local dev fallback
      memStore.push({
        id: memId(), name, email, message, is_public: isPublic,
        pray_count: 0, created_at: new Date().toISOString(),
      });
    }

    // Fire-and-forget email
    sendPrayerEmail({ name, email, message, isPublic });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[prayer POST]", e);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }
}
