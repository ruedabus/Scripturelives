/**
 * GET /api/churches/[name] — church detail: stats + full member roster
 */

import { NextRequest, NextResponse } from "next/server";
import { getChurches, getChurchMembers } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const { name } = await params;
  const churchName = decodeURIComponent(name);

  try {
    const [allChurches, members] = await Promise.all([
      getChurches(200),
      getChurchMembers(churchName),
    ]);

    const stat = allChurches.find(
      (c) => c.church_name.toLowerCase() === churchName.toLowerCase()
    );

    if (!stat && members.length === 0) {
      return NextResponse.json({ error: "Church not found" }, { status: 404 });
    }

    return NextResponse.json(
      { stat: stat ?? null, members },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
