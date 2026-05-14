/**
 * GET /api/devotionals/send
 *
 * Called every morning by a Vercel cron job (see vercel.json).
 * Fetches all active subscribers from Supabase, picks today's devotional
 * (English or Spanish based on each subscriber's language preference),
 * and sends each one a beautiful HTML email via Resend.
 *
 * Protected by CRON_SECRET — Vercel passes this automatically when the
 * cron triggers the route. You can also call it manually:
 *   curl -H "Authorization: Bearer <CRON_SECRET>" https://scripturelives.com/api/devotionals/send
 *
 * Required env vars:
 *   CRON_SECRET               — any long random string you choose
 *   RESEND_API_KEY            — your Resend API key
 *   SUPABASE_URL              — your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — Supabase service role key
 */

import { NextRequest, NextResponse } from "next/server";
import { DEVOTIONALS } from "@/data/devotionals";
import { DEVOTIONALS_ES } from "@/data/devotionals-es";

export const runtime  = "nodejs";
export const maxDuration = 60; // Vercel Pro allows up to 300s; hobby cap is 60s

// ── Helpers ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_URL   = "https://api.resend.com/emails";
const FROM_EMAIL   = "Scripture Lives <devotionals@scripturelives.com>";
const GOLD         = "#C9952A";
const NAVY         = "#1a2640";

function sbHeaders() {
  return {
    apikey:        SUPABASE_KEY!,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

/** Day-of-year index (1-based), same formula as the website */
function todayIndex(length: number): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return ((dayOfYear - 1) % length + length) % length;
}

// ── Subscriber type ───────────────────────────────────────────────────────────
type Subscriber = {
  email: string;
  name:  string | null;
  language: string | null;
};

// ── Email HTML builder ────────────────────────────────────────────────────────
function buildEmail(
  sub: Subscriber,
  dev: { title: string; reference: string; verse: string; reflection: string; prayer: string; icon: string },
  lang: "en" | "es",
  dayNum: number,
): string {
  const isES        = lang === "es";
  const displayName = sub.name?.trim() || (isES ? "Amigo" : "Friend");
  const siteUrl     = isES
    ? `https://scripturelives.com/es/devotionals/${dayNum}`
    : `https://scripturelives.com/devotionals`;

  const labels = isES ? {
    greeting:    `Buenos días, ${displayName}`,
    subhead:     "Devocional de Hoy",
    verseLabel:  "Versículo",
    refLabel:    "Reflexión",
    prayerLabel: "Oración",
    cta:         "Leer en el sitio →",
    unsubscribe: "Cancelar suscripción",
    footer:      "Recibiste este correo porque te suscribiste en scripturelives.com",
  } : {
    greeting:    `Good morning, ${displayName}`,
    subhead:     "Today's Devotional",
    verseLabel:  "Verse",
    refLabel:    "Reflection",
    prayerLabel: "Prayer",
    cta:         "Read on the site →",
    unsubscribe: "Unsubscribe",
    footer:      "You received this because you subscribed at scripturelives.com",
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ece3;font-family:Georgia,serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:32px 16px">

  <!-- Card -->
  <table width="100%" style="max-width:580px;background:#faf8f3;border-radius:16px;border:1px solid #ede8de;overflow:hidden" cellpadding="0" cellspacing="0">

    <!-- Header -->
    <tr>
      <td style="background:${NAVY};padding:32px 32px 24px;text-align:center">
        <p style="font-size:44px;margin:0 0 12px">${dev.icon}</p>
        <p style="color:${GOLD};font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 8px">
          Scripture Lives · ${labels.subhead}
        </p>
        <h1 style="color:white;font-size:24px;font-weight:900;margin:0;line-height:1.3">
          ${dev.title}
        </h1>
        <p style="color:${GOLD};font-size:13px;font-weight:600;margin:8px 0 0">${dev.reference}</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:28px 32px 0">

        <!-- Verse -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
          <tr>
            <td style="background:white;border-radius:10px;border:1px solid #ede8de;border-left:4px solid ${GOLD};padding:18px 20px">
              <p style="color:#9ca3af;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 8px">
                ${labels.verseLabel}
              </p>
              <p style="color:#3a3025;font-style:italic;line-height:1.8;margin:0;font-size:15px">
                "${dev.verse}"
              </p>
              <p style="color:${GOLD};font-size:12px;font-weight:700;margin:10px 0 0">${dev.reference}</p>
            </td>
          </tr>
        </table>

        <!-- Reflection -->
        <p style="color:#9ca3af;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 8px">
          ${labels.refLabel}
        </p>
        <p style="color:#3a3025;line-height:1.85;font-size:14px;margin:0 0 24px">
          ${dev.reflection}
        </p>

        <!-- Prayer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
          <tr>
            <td style="background:${NAVY};border-radius:10px;padding:18px 20px">
              <p style="color:${GOLD};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 8px">
                🙏 ${labels.prayerLabel}
              </p>
              <p style="color:rgba(255,255,255,0.88);font-style:italic;line-height:1.8;font-size:13px;margin:0">
                ${dev.prayer}
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding:0 32px 28px;text-align:center">
        <a href="${siteUrl}"
           style="display:inline-block;background:${GOLD};color:${NAVY};text-decoration:none;font-weight:900;font-size:14px;padding:14px 32px;border-radius:10px;letter-spacing:0.02em">
          ${labels.cta}
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f0ece3;padding:16px 32px;text-align:center;border-top:1px solid #ede8de">
        <p style="color:#9ca3af;font-size:11px;margin:0 0 4px">${labels.footer}</p>
        <a href="https://scripturelives.com/unsubscribe?email=${encodeURIComponent(sub.email)}"
           style="color:#9ca3af;font-size:11px">${labels.unsubscribe}</a>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

// ── GET handler ───────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // ── Auth: Vercel sends Authorization: Bearer <CRON_SECRET> automatically ──
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization") ?? "";
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // ── Require Supabase + Resend ─────────────────────────────────────────────
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  // ── Pick today's devotionals ──────────────────────────────────────────────
  const enIdx  = todayIndex(DEVOTIONALS.length);
  const esIdx  = todayIndex(DEVOTIONALS_ES.length);
  const devEN  = DEVOTIONALS[enIdx];
  const devES  = DEVOTIONALS_ES[esIdx];
  const dayNum = esIdx + 1;

  // ── Fetch all active subscribers ──────────────────────────────────────────
  const subRes = await fetch(
    `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/devotional_subscribers?active=eq.true&select=email,name,language`,
    { headers: sbHeaders() }
  );
  if (!subRes.ok) {
    const err = await subRes.text().catch(() => "");
    console.error("[devotionals/send] Supabase fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
  const subscribers: Subscriber[] = await subRes.json();

  if (!subscribers.length) {
    return NextResponse.json({ sent: 0, message: "No active subscribers" });
  }

  // ── Build and send emails in batches of 100 (Resend batch limit) ──────────
  let sent = 0;
  let failed = 0;
  const BATCH = 100;

  for (let i = 0; i < subscribers.length; i += BATCH) {
    const batch = subscribers.slice(i, i + BATCH);

    const emails = batch.map((sub) => {
      const lang  = sub.language === "es" ? "es" : "en";
      const dev   = lang === "es" ? devES : devEN;
      const subjectEN = `📖 ${devEN.title} — ${devEN.reference}`;
      const subjectES = `📖 ${devES.title} — ${devES.reference}`;

      return {
        from:    FROM_EMAIL,
        to:      [sub.email],
        subject: lang === "es" ? subjectES : subjectEN,
        html:    buildEmail(sub, dev, lang, dayNum),
      };
    });

    const batchRes = await fetch(`${RESEND_URL}/batch`, {
      method:  "POST",
      headers: {
        Authorization:  `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emails),
    });

    if (batchRes.ok) {
      sent += batch.length;
    } else {
      const err = await batchRes.text().catch(() => "");
      console.error(`[devotionals/send] Resend batch error (batch ${i}):`, err);
      failed += batch.length;
    }
  }

  console.log(`[devotionals/send] Done — sent: ${sent}, failed: ${failed}`);
  return NextResponse.json({
    sent,
    failed,
    enTitle:  devEN.title,
    esTitle:  devES.title,
    date:     new Date().toISOString(),
  });
}
