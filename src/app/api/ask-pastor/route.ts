import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const RESEND_URL  = "https://api.resend.com/emails";
const GOLD        = "#C9952A";
const NAVY        = "#1a2640";

export async function POST(req: NextRequest) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }

  let name: string, email: string, question: string;
  try {
    const body = await req.json();
    name     = String(body.name     ?? "").trim().slice(0, 100);
    email    = String(body.email    ?? "").trim().slice(0, 200);
    question = String(body.question ?? "").trim().slice(0, 2000);
    if (!name || !email || !question) throw new Error();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0ece3;font-family:Georgia,serif">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding:32px 16px">
  <table width="100%" style="max-width:580px;background:#faf8f3;border-radius:16px;border:1px solid #ede8de;overflow:hidden" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:${NAVY};padding:28px 32px;text-align:center">
        <p style="color:${GOLD};font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 6px">Scripture Lives</p>
        <h1 style="color:white;font-size:22px;font-weight:900;margin:0">New Question for a Pastor</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 32px">
        <p style="color:#9ca3af;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 4px">From</p>
        <p style="color:#3a3025;font-size:15px;margin:0 0 4px;font-weight:bold">${name}</p>
        <p style="color:${GOLD};font-size:13px;margin:0 0 24px">${email}</p>

        <p style="color:#9ca3af;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 10px">Their Question</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:white;border-radius:10px;border:1px solid #ede8de;border-left:4px solid ${GOLD};padding:18px 20px">
              <p style="color:#3a3025;line-height:1.8;margin:0;font-size:15px">${question}</p>
            </td>
          </tr>
        </table>

        <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;text-align:center">
          Reply directly to this email to respond to ${name}.
        </p>
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const emailRes = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:     "Scripture Lives <devotionals@scripturelives.com>",
      to:       ["info@scripturelives.com"],
      reply_to: email,
      subject:  `✝ Pastor Question from ${name}`,
      html,
    }),
  });

  if (!emailRes.ok) {
    console.error("[ask-pastor] Resend error:", await emailRes.text());
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
