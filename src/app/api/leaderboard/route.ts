/**
 * GET /api/leaderboard?type=global&limit=50&offset=0
 * GET /api/leaderboard?type=church&limit=20
 */

import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard, getChurchLeaderboard } from "@/lib/auth";

export async function GET(req: NextRequest) {
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
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
