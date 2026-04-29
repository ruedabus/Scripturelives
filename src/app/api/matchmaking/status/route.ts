/**
 * GET /api/matchmaking/status
 * Authenticated players poll this to check if they've been matched.
 * Returns: { status: "waiting" | "matched" | "not_found", roomCode?, playerId? }
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getQueueEntry } from "@/lib/matchmaking";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entry = await getQueueEntry(user.id);
  if (!entry) {
    return NextResponse.json({ status: "not_found" });
  }

  // Clean up expired waiting entries
  if (entry.status === "waiting" && new Date(entry.expires_at) < new Date()) {
    return NextResponse.json({ status: "expired" });
  }

  if (entry.status === "matched" && entry.room_code && entry.player_id) {
    return NextResponse.json({
      status:   "matched",
      roomCode: entry.room_code,
      playerId: entry.player_id,
    });
  }

  return NextResponse.json({ status: entry.status });
}
