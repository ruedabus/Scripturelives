/**
 * POST /api/matchmaking   — enter the queue (or instant-match if opponent found)
 * DELETE /api/matchmaking — leave the queue
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, getProfile } from "@/lib/auth";
import {
  enterQueue, findOpponent, updateQueueEntry, removeFromQueue,
} from "@/lib/matchmaking";
import { createRoom, updateRoom } from "@/lib/tournamentStore";
import {
  generateBracket, pickQuestions, resetUsedQuestions,
} from "@/lib/bracket";
import type { GameRoom, GameSettings, Player } from "@/lib/tournamentTypes";

// ── Helpers ──────────────────────────────────────────────────────────────────

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
function generateCode(): string {
  return Array.from({ length: 4 }, () =>
    CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join("");
}

// ── POST — enter queue / instant match ───────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth required
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json(
      { error: "Sign in to use Quick Match" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const categories: string[] = Array.isArray(body.categories)
    ? body.categories
    : ["Old Testament", "Gospels", "New Testament", "Letters & Epistles"];

  // Load profile for display name + ELO
  const profile = await getProfile(user.id);
  if (!profile) {
    return NextResponse.json(
      { error: "Set up your profile first to use Quick Match" },
      { status: 400 }
    );
  }

  // ── Try to find an opponent ──────────────────────────────────────────────
  const opponent = await findOpponent(user.id);

  if (opponent) {
    // ── MATCH FOUND ─────────────────────────────────────────────────────────
    const code = generateCode();
    const p1Id = `mm-${Date.now()}-p1`;
    const p2Id = `mm-${Date.now() + 1}-p2`;

    const player1: Player = {
      id:             p1Id,
      name:           profile.display_name,
      avatarEmoji:    profile.avatar_url ?? "👑",
      joinedAt:       Date.now(),
      supabaseUserId: user.id,
      score: 0, wins: 0, correctAnswers: 0, buzzWins: 0,
      verseCorrect: 0, eliminated: false, placement: null,
    };
    const player2: Player = {
      id:             p2Id,
      name:           opponent.display_name,
      avatarEmoji:    opponent.avatar_emoji,
      joinedAt:       Date.now(),
      supabaseUserId: opponent.user_id,
      score: 0, wins: 0, correctAnswers: 0, buzzWins: 0,
      verseCorrect: 0, eliminated: false, placement: null,
    };

    const settings: GameSettings = {
      questionsPerMatch:      5,
      finalQuestionsPerMatch: 5,
      categories:             opponent.categories.length > 0
        ? [...new Set([...categories, ...opponent.categories])]
        : categories,
      difficulties:           ["easy", "medium", "hard"],
      includeAiQuestions:     false,
    };

    // Create the room with both players pre-loaded
    const room: GameRoom = {
      code,
      hostId:               "matchmaking",   // signals auto-host mode
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

    // Generate bracket + start first question immediately
    await updateRoom(code, (r) => {
      resetUsedQuestions();
      const bracket   = generateBracket(
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

    // Mark opponent as matched with game info
    await updateQueueEntry(opponent.user_id, {
      status:     "matched",
      room_code:  code,
      player_id:  p2Id,
      matched_at: new Date().toISOString(),
    });

    // Don't leave current user in queue (they go straight to game)
    await removeFromQueue(user.id);

    return NextResponse.json({
      status:   "matched",
      roomCode: code,
      playerId: p1Id,
    });
  }

  // ── No opponent available — join the queue ───────────────────────────────
  await enterQueue({
    user_id:      user.id,
    display_name: profile.display_name,
    avatar_emoji: profile.avatar_url ?? "👑",
    elo:          profile.elo,
    categories,
  });

  return NextResponse.json({ status: "waiting" });
}

// ── DELETE — cancel matchmaking ──────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await removeFromQueue(user.id);
  return NextResponse.json({ ok: true });
}
