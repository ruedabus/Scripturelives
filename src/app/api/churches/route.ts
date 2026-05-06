/**
 * GET /api/churches          — list all churches with aggregate stats
 * GET /api/churches?q=abc    — search by name
 */

import { NextRequest, NextResponse } from "next/server";
import { getChurches } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().toLowerCase();

  try {
    let churches = await getChurches(200);
    if (q) churches = churches.filter((c) => c.church_name.toLowerCase().includes(q));
    return NextResponse.json(
      { churches, total: churches.length },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
