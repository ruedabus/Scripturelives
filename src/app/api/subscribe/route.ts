/**
 * POST /api/subscribe
 * Sign up for daily devotional emails.
 *
 * Saves to Supabase `devotional_subscribers` table (same DB as tournament).
 * Sends a confirmation email via Resend when RESEND_API_KEY is configured.
 *
 * Table schema (run once in Supabase SQL Editor):
 *   create table devotional_subscribers (
 *     id         uuid        default gen_random_uuid() primary key,
 *     email      text        unique not null,
 *     name       text,
 *     active     boolean     default true,
 *     created_at timestamptz default now()
 *   );
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

// ── Supabase REST (same env vars as tournamentStore) ──────────────────────────
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
const TABLE = () => `${SUPABASE_URL?.replace(/\/+$/, "")}/rest/v1/devotional_subscribers`;

// ── In-memory fallback for local dev ─────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;
if (!g.__subMem) g.__subMem = new Set<string>();
const memEmails: Set<string> = g.__subMem;

// ── Resend emails ─────────────────────────────────────────────────────────────
const FROM_EMAIL  = "devotionals@scripturelives.com";
const ADMIN_EMAIL = process.env.EMAIL_TO || "info@scripturelives.com";
const RESEND_URL  = "https://api.resend.com/emails";

async function sendConfirmation(name: string | null, email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const displayName = name?.trim() || "Friend";

  await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from:    `Scripture Lives <${FROM_EMAIL}>`,
      to:      [email],
      subject: "You're subscribed to Daily Devotionals 📖",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:40px 32px;background:#faf8f3;border-radius:12px;border:1px solid #ede8de">
          <div style="text-align:center;margin-bottom:32px">
            <p style="font-size:36px;margin:0">📖</p>
            <h1 style="color:#1a2640;font-size:22px;margin:12px 0 4px">Welcome, ${displayName}!</h1>
            <p style="color:#C9952A;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0">Daily Devotionals — Scripture Lives</p>
          </div>

          <p style="color:#1a2640;line-height:1.8;margin:0 0 20px">
            Thank you for signing up! Each day we'll send you a short devotional to
            encourage your walk with God — a verse, a reflection, and a prayer to start your morning.
          </p>

          <div style="background:white;border-radius:10px;padding:20px 24px;border:1px solid #ede8de;border-left:4px solid #C9952A;margin-bottom:28px">
            <p style="color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px">Today's Verse</p>
            <p style="color:#1a2640;font-style:italic;line-height:1.7;margin:0">
              "Your word is a lamp to my feet and a light to my path."
            </p>
            <p style="color:#C9952A;font-size:12px;font-weight:600;margin:8px 0 0">— Psalm 119:105</p>
          </div>

          <p style="color:#6b7280;font-size:13px;line-height:1.7;margin:0 0 28px">
            Your first devotional will arrive soon. In the meantime, explore our full
            library of Bible studies and articles at Scripture Lives.
          </p>

          <div style="text-align:center">
            <a href="https://scripturelives.com/devotionals"
               style="display:inline-block;background:#C9952A;color:white;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px">
              Browse Devotionals →
            </a>
          </div>

          <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:32px">
            You can unsubscribe at any time · scripturelives.com
          </p>
        </div>
      `,
    }),
  }).catch((err) => console.error("[subscribe] Resend error:", err));
}

async function sendAdminNotification(name: string | null, email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const displayName = name?.trim() || "Anonymous";
  await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from:    `Scripture Lives <${FROM_EMAIL}>`,
      to:      [ADMIN_EMAIL],
      subject: `📬 New Devotional Subscriber — ${displayName}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#faf8f3;border-radius:12px;border:1px solid #ede8de">
          <div style="text-align:center;margin-bottom:24px">
            <p style="font-size:36px;margin:0">📬</p>
            <h1 style="color:#1a2640;font-size:20px;margin:10px 0 4px">New Subscriber!</h1>
            <p style="color:#C9952A;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0">Scripture Lives — Daily Devotionals</p>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;width:70px">Name</td>
              <td style="padding:8px 0;color:#1a2640;font-weight:600">${displayName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Email</td>
              <td style="padding:8px 0"><a href="mailto:${email}" style="color:#C9952A">${email}</a></td>
            </tr>
          </table>
          <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:24px">
            Received via scripturelives.com/devotionals
          </p>
        </div>
      `,
    }),
  }).catch((err) => console.error("[subscribe] Admin notification error:", err));
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  let body: { email?: string; name?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const email = (body.email ?? "").trim().toLowerCase().slice(0, 254);
  const name  = (body.name  ?? "").trim().slice(0, 80) || null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    if (USE_SUPABASE) {
      const res = await fetch(TABLE(), {
        method:  "POST",
        headers: { ...sbHeaders(), Prefer: "resolution=ignore-duplicates,return=minimal" },
        body:    JSON.stringify({ email, name, active: true }),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => "");
        // Supabase returns 409 for unique violations but Prefer header should suppress that
        if (res.status === 409 || err.includes("duplicate")) {
          return NextResponse.json({ alreadySubscribed: true });
        }
        console.error("[subscribe] Supabase error:", err);
        throw new Error(`Supabase INSERT failed (${res.status})`);
      }
    } else {
      if (memEmails.has(email)) {
        return NextResponse.json({ alreadySubscribed: true });
      }
      memEmails.add(email);
    }

    // Fire-and-forget: welcome email to subscriber + admin notification
    sendConfirmation(name, email);
    sendAdminNotification(name, email);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[subscribe POST]", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
