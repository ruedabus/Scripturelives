/**
 * GET /api/leaderboard?type=global&limit=50&offset=0
 * GET /api/leaderboard?type=church&limit=20
 */

import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard, getChurchLeaderboard } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const rl = rateLimit(getClientIp(req), { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  try {
    const { searchParams } = new URL(req.url);
    const type   = searchParams.get("type") ?? "global";
    const limit  = Math.min(100, parseInt(searchParams.get("limit")  ?? "50"));
    const offset = Math.max(0,   parseInt(searchParams.get("offset") ?? "0"));

    if (type === "church") {
      const data = await getChurchLeaderboard(limit);
      return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
    }

    const data = await getLeaderboard(limit, offset);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("[leaderboard]", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
