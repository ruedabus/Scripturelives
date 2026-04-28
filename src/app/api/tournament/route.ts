/**
 * POST /api/tournament  — create a new game room
 * GET  /api/tournament?code=XXXX  — poll current game state
 */

import { NextRequest, NextResponse } from "next/server";
import { createRoom, getRoom } from "@/lib/tournamentStore";
import { generateBracket, resetUsedQuestions } from "@/lib/bracket";
import { BIBLE_AVATARS } from "@/lib/tournamentTypes";
import type { GameRoom, GameSettings } from "@/lib/tournamentTypes";

// Four-letter codes using Bible-friendly words / letters
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

function generateCode(): string {
  return Array.from({ length: 4 }, () =>
    CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join("");
}

// ── POST — create room ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const hostName: string = (body.hostName ?? "Host").slice(0, 30);

  let code = generateCode();
  // Avoid collisions
  let attempts = 0;
  while (getRoom(code) && attempts < 10) { code = generateCode(); attempts++; }

  const hostId = `host-${Date.now()}`;
  const settings: GameSettings = {
    questionsPerMatch:      body.questionsPerMatch      ?? 3,
    finalQuestionsPerMatch: body.finalQuestionsPerMatch ?? 5,
    categories:             body.categories             ?? ["Old Testament", "New Testament"],
    difficulties:           body.difficulties           ?? ["easy", "medium"],
    includeAiQuestions:     body.includeAiQuestions     ?? false,
    aiTopic:                body.aiTopic,
  };

  resetUsedQuestions();

  const room: GameRoom = {
    code,
    hostId,
    createdAt:             Date.now(),
    phase:                 "lobby",
    players:               {},
    bracket:               [],
    currentMatchId:        null,
    currentQuestionIndex:  0,
    currentQuestion:       null,
    questionStartedAt:     null,
    buzzedPlayerId:        null,
    buzzedAt:              null,
    settings,
    awards:                [],
    chatMessages:          [],
    lastUpdated:           Date.now(),
  };

  createRoom(room);

  return NextResponse.json({ code, hostId });
}

// ── GET — poll state ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get("code")?.toUpperCase();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const room = getRoom(code);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  // Strip sensitive info (host id) before sending to players
  const { hostId: _h, ...safeRoom } = room;
  return NextResponse.json(safeRoom, {
    headers: { "Cache-Control": "no-store" },
  });
}
