import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TO_EMAIL   = process.env.EMAIL_TO   || "info@scripturelives.com";
const FROM_EMAIL = process.env.EMAIL_FROM || "contact@scripturelives.com";
const RESEND_URL = "https://api.resend.com/emails";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Fail gracefully if key not yet configured — log server-side only
      console.error("[contact] RESEND_API_KEY is not set");
      return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
    }

    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        from:    `Scripture Lives Contact <${FROM_EMAIL}>`,
        to:      [TO_EMAIL],
        replyTo: email.trim(),
        subject: `New message from ${name.trim()} — Scripture Lives`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;background:#faf8f3;border-radius:12px;border:1px solid #ede8de">
            <div style="text-align:center;margin-bottom:24px">
              <h1 style="color:#1a2640;font-size:22px;margin:0">Scripture Lives</h1>
              <p style="color:#C9952A;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:4px 0 0">New Contact Message</p>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
              <tr><td style="padding:8px 0;color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;width:80px">From</td>
                  <td style="padding:8px 0;color:#1a2640;font-weight:600">${name.trim()}</td></tr>
              <tr><td style="padding:8px 0;color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Email</td>
                  <td style="padding:8px 0"><a href="mailto:${email.trim()}" style="color:#C9952A">${email.trim()}</a></td></tr>
            </table>
            <div style="background:white;border-radius:10px;padding:20px;border:1px solid #ede8de">
              <p style="color:#9ca3af;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 10px">Message</p>
              <p style="color:#1a2640;line-height:1.7;margin:0;white-space:pre-wrap">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </div>
            <p style="color:#9ca3af;font-size:11px;text-align:center;margin-top:24px">
              Sent via scripturelives.com/contact · Reply directly to this email to respond.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[contact] Resend error:", err);
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] Unexpected error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
