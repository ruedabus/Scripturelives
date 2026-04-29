/**
 * POST /api/challenge — create a new challenge (auth required)
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, getProfile } from "@/lib/auth";
import { createChallenge, generateChallengeCode } from "@/lib/challenges";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in to send a challenge" }, { status: 401 });
  }

  const profile = await getProfile(user.id);
  if (!profile) {
    return NextResponse.json({ error: "Set up your profile first" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const categories: string[] = Array.isArray(body.categories) ? body.categories : [];

  // Pre-assign the challenger's in-game player ID
  const challengerPlayerId = `ch-${Date.now()}-p1`;
  const code               = generateChallengeCode();

  const challenge = await createChallenge({
    code,
    challenger_id:        user.id,
    challenger_name:      profile.display_name,
    challenger_emoji:     profile.avatar_url ?? "👑",
    challenger_elo:       profile.elo,
    challenger_player_id: challengerPlayerId,
    categories,
  });

  if (!challenge) {
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 });
  }

  return NextResponse.json({
    code,
    challengerPlayerId,
    url: `/challenge/${code}`,
  });
}
