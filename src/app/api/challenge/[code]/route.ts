/**
 * GET  /api/challenge/[code]  — get challenge status (public)
 * POST /api/challenge/[code]  — accept a challenge (auth required)
 * DELETE /api/challenge/[code] — decline / cancel a challenge
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, getProfile } from "@/lib/auth";
import { getChallenge, acceptChallenge, declineChallenge } from "@/lib/challenges";
import { createRoom, updateRoom } from "@/lib/tournamentStore";
import { generateBracket, resetUsedQuestions } from "@/lib/bracket";
import type { GameRoom, GameSettings, Player } from "@/lib/tournamentTypes";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
function genRoomCode(): string {
  return Array.from({ length: 4 }, () =>
    CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join("");
}

// ── GET — challenge info ──────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const challenge = await getChallenge(code.toUpperCase());
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  // Check expiry
  if (new Date(challenge.expires_at) < new Date() && challenge.status === "pending") {
    return NextResponse.json({ ...challenge, status: "expired" });
  }

  return NextResponse.json(challenge);
}

// ── POST — accept challenge ───────────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Sign in to accept a challenge" }, { status: 401 });
  }

  const challenge = await getChallenge(code.toUpperCase());
  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }
  if (challenge.status !== "pending") {
    return NextResponse.json({ error: `Challenge is already ${challenge.status}` }, { status: 409 });
  }
  if (new Date(challenge.expires_at) < new Date()) {
    return NextResponse.json({ error: "Challenge has expired" }, { status: 410 });
  }
  if (challenge.challenger_id === user.id) {
    return NextResponse.json({ error: "You can't accept your own challenge" }, { status: 400 });
  }

  // Load the accepting player's profile
  const profile = await getProfile(user.id);
  if (!profile) {
    return NextResponse.json({ error: "Set up your profile first" }, { status: 400 });
  }

  const roomCode          = genRoomCode();
  const p1Id              = challenge.challenger_player_id;
  const p2Id              = `ch-${Date.now()}-p2`;

  const categories = challenge.categories.length > 0
    ? challenge.categories
    : ["Old Testament", "Gospels", "New Testament", "Letters & Epistles"];

  const player1: Player = {
    id:             p1Id,
    name:           challenge.challenger_name,
    avatarEmoji:    challenge.challenger_emoji,
    joinedAt:       Date.now(),
    supabaseUserId: challenge.challenger_id,
    score: 0, wins: 0, correctAnswers: 0, buzzWins: 0,
    verseCorrect: 0, eliminated: false, placement: null,
  };
  const player2: Player = {
    id:             p2Id,
    name:           profile.display_name,
    avatarEmoji:    profile.avatar_url ?? "⚔️",
    joinedAt:       Date.now(),
    supabaseUserId: user.id,
    score: 0, wins: 0, correctAnswers: 0, buzzWins: 0,
    verseCorrect: 0, eliminated: false, placement: null,
  };

  const settings: GameSettings = {
    questionsPerMatch:      5,
    finalQuestionsPerMatch: 5,
    categories,
    difficulties:           ["easy", "medium", "hard"],
    includeAiQuestions:     false,
  };

  // Create the game room
  const room: GameRoom = {
    code:                 roomCode,
    hostId:               "matchmaking",
    createdAt:            Date.now(),
    phase:                "lobby",
    players:              { [p1Id]: player1, [p2Id]: player2 },
    bracket:              [],
    currentMatchId:       null,
    currentQuestionIndex: 0,
    currentQuestion:      null,
    questionStartedAt:    null,
    buzzedPlayerId:       null,
    buzzedAt:             null,
    settings,
    awards:               [],
    chatMessages:         [],
    lastUpdated:          Date.now(),
  };

  await createRoom(room);

  // Seed bracket and start first question
  await updateRoom(roomCode, (r) => {
    resetUsedQuestions();
    const bracket    = generateBracket(
      [player1, player2],
      r.settings.questionsPerMatch,
      r.settings.difficulties,
      r.settings.categories
    );
    const firstMatch = bracket[0];
    const firstQ     = firstMatch?.questions[0] ?? null;
    const activeBracket = bracket.map((m) =>
      m.id === firstMatch?.id ? { ...m, status: "active" as const } : m
    );
    return {
      ...r,
      bracket:              activeBracket,
      currentMatchId:       firstMatch?.id ?? null,
      currentQuestionIndex: 0,
      currentQuestion:      firstQ,
      questionStartedAt:    firstQ ? Date.now() : null,
      phase:                firstMatch ? "question" : "lobby",
    };
  });

  // Mark challenge as accepted with room info
  await acceptChallenge(code.toUpperCase(), p2Id, roomCode);

  return NextResponse.json({
    roomCode,
    playerId: p2Id,          // the accepting player's ID
  });
}

// ── DELETE — decline / cancel ─────────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code }  = await params;
  const user      = await getAuthUser(req);
  const challenge = await getChallenge(code.toUpperCase());

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  // Only challenger or challenged can cancel
  if (user && (user.id === challenge.challenger_id)) {
    await declineChallenge(code.toUpperCase());
    return NextResponse.json({ ok: true });
  }

  // Anonymous decline is fine too (challenged player may not be logged in yet)
  await declineChallenge(code.toUpperCase());
  return NextResponse.json({ ok: true });
}
