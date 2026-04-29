/**
 * POST /api/tournament/action
 *
 * All game actions flow through here. The request body includes:
 *   { code, playerId, action, payload? }
 */

import { NextRequest, NextResponse } from "next/server";
import { getRoom, updateRoom } from "@/lib/tournamentStore";
import {
  generateBracket, advanceWinner, getMatchWinner,
  getNextMatch, pickQuestions,
} from "@/lib/bracket";
import { BIBLE_AVATARS, AWARDS_CONFIG } from "@/lib/tournamentTypes";
import type { GameRoom, Player, MatchAnswer, Award, ChatMessage } from "@/lib/tournamentTypes";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

function sysMsg(text: string): ChatMessage {
  return { id: `msg-${Date.now()}-${Math.random()}`, type: "system", text, at: Date.now() };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { code, playerId, action, payload = {} } = body;

  if (!code || !action) {
    return NextResponse.json({ error: "Missing code or action" }, { status: 400 });
  }

  let room;
  try {
    room = await getRoom(code);
  } catch (e) {
    console.error("[POST /api/tournament/action] getRoom failed:", e);
    return NextResponse.json(
      { error: `Database error: ${e instanceof Error ? e.message : String(e)}` },
      { status: 503 }
    );
  }
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  // ── join ──────────────────────────────────────────────────────────────────
  if (action === "join") {
    if (room.phase !== "lobby") {
      return NextResponse.json({ error: "Game already started" }, { status: 409 });
    }
    const name: string = (payload.name ?? "Player").slice(0, 20);
    const existingCount = Object.keys(room.players).length;
    if (existingCount >= 16) {
      return NextResponse.json({ error: "Room is full (max 16)" }, { status: 409 });
    }
    const pid = `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const avatar = BIBLE_AVATARS[existingCount % BIBLE_AVATARS.length];
    const player: Player = {
      id: pid, name, avatarEmoji: avatar, joinedAt: Date.now(),
      score: 0, wins: 0, correctAnswers: 0, buzzWins: 0,
      verseCorrect: 0, eliminated: false, placement: null,
    };
    const updated = await updateRoom(code, (r) => ({
      ...r,
      players: { ...r.players, [pid]: player },
      chatMessages: [...r.chatMessages, sysMsg(`${name} joined the game! ${avatar}`)],
    }));
    return NextResponse.json({ playerId: pid, player, room: updated });
  }

  // ── start_tournament ──────────────────────────────────────────────────────
  if (action === "start_tournament") {
    const players = Object.values(room.players);
    if (players.length < 2) {
      return NextResponse.json({ error: "Need at least 2 players" }, { status: 400 });
    }
    const bracket = generateBracket(
      players,
      room.settings.questionsPerMatch,
      room.settings.difficulties,
      room.settings.categories
    );
    // Auto-advance byes
    let finalBracket = bracket;
    for (const m of bracket.filter((m) => m.isBye)) {
      finalBracket = advanceWinner(finalBracket, m);
    }
    const updated = await updateRoom(code, (r) => ({
      ...r,
      phase:   "seeding",
      bracket: finalBracket,
      chatMessages: [...r.chatMessages, sysMsg("🏆 Tournament bracket is set! Get ready…")],
    }));
    return NextResponse.json({ room: updated });
  }

  // ── start_match ───────────────────────────────────────────────────────────
  if (action === "start_match") {
    const matchId: string = payload.matchId;
    const updated = await updateRoom(code, (r) => ({
      ...r,
      phase:                "matchup",
      currentMatchId:       matchId,
      currentQuestionIndex: 0,
      currentQuestion:      null,
      buzzedPlayerId:       null,
      buzzedAt:             null,
      bracket: r.bracket.map((m) =>
        m.id === matchId ? { ...m, status: "active" } : m
      ),
    }));
    return NextResponse.json({ room: updated });
  }

  // ── reveal_question ───────────────────────────────────────────────────────
  if (action === "reveal_question") {
    const updated = await updateRoom(code, (r) => {
      const match = r.bracket.find((m) => m.id === r.currentMatchId);
      if (!match) return r;
      const qi = r.currentQuestionIndex;
      const q  = match.questions[qi];
      if (!q) return r;
      return {
        ...r,
        phase:             "question",
        currentQuestion:   q,
        questionStartedAt: Date.now(),
        buzzedPlayerId:    null,
        buzzedAt:          null,
      };
    });
    return NextResponse.json({ room: updated });
  }

  // ── submit_answer (MC / verse) ─────────────────────────────────────────────
  if (action === "submit_answer") {
    const answer: string = (payload.answer ?? "").slice(0, 200);
    const updated = await updateRoom(code, (r) => {
      const match = r.bracket.find((m) => m.id === r.currentMatchId);
      const q     = r.currentQuestion;
      if (!match || !q || r.phase !== "question" || q.type === "buzz") return r;

      const correct = answer.toLowerCase().trim() === q.answer.toLowerCase().trim();
      const elapsed = r.questionStartedAt ? Date.now() - r.questionStartedAt : 9999;
      const pts     = correct ? Math.round(q.points * Math.max(0.5, 1 - elapsed / (q.timeLimitSec * 2000))) : 0;

      const ans: MatchAnswer = {
        playerId:    playerId,
        answer,
        submittedAt: Date.now(),
        correct,
        pointsEarned: pts,
      };

      const existingAnswers = match.answers[playerId] ?? [];

      return {
        ...r,
        players: {
          ...r.players,
          [playerId]: {
            ...r.players[playerId],
            score:          (r.players[playerId]?.score ?? 0) + pts,
            correctAnswers: correct ? (r.players[playerId]?.correctAnswers ?? 0) + 1 : (r.players[playerId]?.correctAnswers ?? 0),
            verseCorrect:   q.type === "verse" && correct ? (r.players[playerId]?.verseCorrect ?? 0) + 1 : (r.players[playerId]?.verseCorrect ?? 0),
          },
        },
        bracket: r.bracket.map((m) =>
          m.id === match.id
            ? { ...m, answers: { ...m.answers, [playerId]: [...existingAnswers, ans] } }
            : m
        ),
      };
    });
    return NextResponse.json({ room: updated });
  }

  // ── buzz_in ───────────────────────────────────────────────────────────────
  if (action === "buzz_in") {
    const updated = await updateRoom(code, (r) => {
      if (r.phase !== "question" || r.currentQuestion?.type !== "buzz") return r;
      if (r.buzzedPlayerId) return r; // already buzzed
      return {
        ...r,
        phase:          "buzzed",
        buzzedPlayerId: playerId,
        buzzedAt:       Date.now(),
        chatMessages:   [...r.chatMessages, sysMsg(`⚡ ${r.players[playerId]?.name ?? "?"} buzzed in!`)],
      };
    });
    return NextResponse.json({ room: updated });
  }

  // ── buzz_answer ───────────────────────────────────────────────────────────
  if (action === "buzz_answer") {
    const answer: string = (payload.answer ?? "").slice(0, 200);
    const updated = await updateRoom(code, (r) => {
      if (r.phase !== "buzzed" || r.buzzedPlayerId !== playerId) return r;
      const match = r.bracket.find((m) => m.id === r.currentMatchId);
      const q     = r.currentQuestion;
      if (!match || !q) return r;

      const correct = answer.toLowerCase().trim() === q.answer.toLowerCase().trim();
      const pts     = correct ? q.points : 0;
      const ans: MatchAnswer = {
        playerId, answer, submittedAt: Date.now(),
        correct, pointsEarned: pts, buzzedAt: r.buzzedAt ?? undefined,
      };

      const existingAnswers = match.answers[playerId] ?? [];
      return {
        ...r,
        phase: "revealed",
        players: {
          ...r.players,
          [playerId]: {
            ...r.players[playerId],
            score:          (r.players[playerId]?.score ?? 0) + pts,
            buzzWins:       correct ? (r.players[playerId]?.buzzWins ?? 0) + 1 : (r.players[playerId]?.buzzWins ?? 0),
            correctAnswers: correct ? (r.players[playerId]?.correctAnswers ?? 0) + 1 : (r.players[playerId]?.correctAnswers ?? 0),
          },
        },
        bracket: r.bracket.map((m) =>
          m.id === match.id
            ? { ...m, answers: { ...m.answers, [playerId]: [...existingAnswers, ans] } }
            : m
        ),
      };
    });
    return NextResponse.json({ room: updated });
  }

  // ── reveal_answer ─────────────────────────────────────────────────────────
  if (action === "reveal_answer") {
    const updated = await updateRoom(code, (r) => {
      const match = r.bracket.find((m) => m.id === r.currentMatchId);
      const q     = r.currentQuestion;
      if (!match || !q) return r;

      const p1id = match.player1Id!;
      const p2id = match.player2Id!;
      const p1ans = (match.answers[p1id] ?? []).at(-1);
      const p2ans = (match.answers[p2id] ?? []).at(-1);

      let questionWinner: string | null = null;
      if (p1ans?.correct && !p2ans?.correct)       questionWinner = p1id;
      else if (p2ans?.correct && !p1ans?.correct)  questionWinner = p2id;
      else if (p1ans?.correct && p2ans?.correct) {
        questionWinner = (p1ans.submittedAt ?? Infinity) < (p2ans.submittedAt ?? Infinity) ? p1id : p2id;
      }

      const newMatchScore = { ...match.matchScore };
      if (questionWinner) newMatchScore[questionWinner] = (newMatchScore[questionWinner] ?? 0) + 1;

      const updatedMatch = { ...match, matchScore: newMatchScore };

      return {
        ...r,
        phase: "revealed",
        bracket: r.bracket.map((m) =>
          m.id === match.id ? updatedMatch : m
        ),
        chatMessages: questionWinner
          ? [...r.chatMessages, sysMsg(`✅ ${r.players[questionWinner]?.name ?? "?"} got it right!`)]
          : [...r.chatMessages, sysMsg("❌ No one got that one!")],
      };
    });
    return NextResponse.json({ room: updated });
  }

  // ── next_question ─────────────────────────────────────────────────────────
  if (action === "next_question") {
    const updated = await updateRoom(code, (r) => {
      const match = r.bracket.find((m) => m.id === r.currentMatchId);
      if (!match) return r;

      const nextIdx    = r.currentQuestionIndex + 1;
      const matchWinner = getMatchWinner({ ...match, matchScore: match.matchScore });

      if (matchWinner || nextIdx >= match.questions.length) {
        const winnerId = matchWinner?.winnerId ?? match.player1Id!;
        const loserId  = matchWinner?.loserId  ?? match.player2Id!;
        const updatedPlayers = {
          ...r.players,
          [winnerId]: { ...r.players[winnerId], wins: (r.players[winnerId]?.wins ?? 0) + 1 },
          [loserId]:  { ...r.players[loserId],  eliminated: true },
        };
        const updatedBracket = r.bracket.map((m) =>
          m.id === match.id
            ? { ...m, winnerId, loserId, status: "complete" as const }
            : m
        );
        const advanced = advanceWinner(updatedBracket, { ...match, winnerId, loserId, status: "complete" });

        return {
          ...r,
          phase:   "advancing",
          players: updatedPlayers,
          bracket: advanced,
          chatMessages: [...r.chatMessages,
            sysMsg(`🏆 ${r.players[winnerId]?.name ?? "?"} wins the match and advances!`),
          ],
        };
      }

      return {
        ...r,
        currentQuestionIndex: nextIdx,
        phase:                "matchup",
      };
    });
    return NextResponse.json({ room: updated });
  }

  // ── advance_bracket ───────────────────────────────────────────────────────
  if (action === "advance_bracket") {
    const updated = await updateRoom(code, (r) => {
      const next = getNextMatch(r.bracket);
      if (!next) {
        const awards = computeAwards(r);
        return { ...r, phase: "complete", awards };
      }
      return {
        ...r,
        phase:                "seeding",
        currentMatchId:       next.id,
        currentQuestionIndex: 0,
        currentQuestion:      null,
      };
    });
    return NextResponse.json({ room: updated });
  }

  // ── generate_ai_qs ────────────────────────────────────────────────────────
  if (action === "generate_ai_qs") {
    if (!OPENAI_KEY) {
      return NextResponse.json({ error: "OpenAI not configured" }, { status: 503 });
    }
    const topic: string = (payload.topic ?? "Bible").slice(0, 100);
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model:       "gpt-4o-mini",
          max_tokens:  1200,
          temperature: 0.7,
          messages: [
            {
              role:    "system",
              content: "You are a Bible curriculum expert creating youth group trivia questions. Always respond with valid JSON only.",
            },
            {
              role:    "user",
              content: `Create 6 Bible trivia questions about "${topic}". Mix easy and medium difficulty. Include 2 multiple-choice, 2 buzz-in (open answer), and 2 verse-completion questions.
Return ONLY a JSON array like this:
[
  {"id":"ai1","type":"mc","category":"Bible","difficulty":"easy","points":100,"timeLimitSec":20,"text":"question?","options":["A","B","C","D"],"answer":"A","reference":"Book chapter:verse"},
  {"id":"ai2","type":"buzz","category":"Bible","difficulty":"medium","points":200,"timeLimitSec":30,"text":"question?","answer":"answer","reference":"Book chapter:verse"},
  {"id":"ai3","type":"verse","category":"Bible","difficulty":"medium","points":200,"timeLimitSec":25,"text":"verse with ______ blank","options":["A","B","C","D"],"answer":"A","verseRef":"Book chapter:verse"}
]`,
            },
          ],
        }),
      });
      const data = await res.json();
      const raw  = data.choices?.[0]?.message?.content ?? "[]";
      const qs   = JSON.parse(raw.replace(/```json|```/g, "").trim());

      const updated = await updateRoom(code, (r) => ({
        ...r,
        bracket: r.bracket.map((m) =>
          m.id === r.currentMatchId
            ? { ...m, questions: [...m.questions, ...qs.slice(0, 3)] }
            : m
        ),
        chatMessages: [...r.chatMessages, sysMsg(`🤖 AI generated ${qs.length} questions about "${topic}"!`)],
      }));
      return NextResponse.json({ questions: qs, room: updated });
    } catch (e) {
      console.error("AI question gen error:", e);
      return NextResponse.json({ error: "AI generation failed" }, { status: 502 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// ── Award computation ────────────────────────────────────────────────────────
function computeAwards(room: GameRoom): Award[] {
  const players = Object.values(room.players);
  if (!players.length) return [];

  const awards: Award[] = [];
  const push = (pid: string, id: string) => {
    const cfg = AWARDS_CONFIG.find((a) => a.id === id);
    if (cfg) awards.push({ playerId: pid, title: cfg.title, description: cfg.desc, emoji: cfg.emoji });
  };

  const champion = players.filter((p) => !p.eliminated).sort((a, b) => b.wins - a.wins)[0];
  if (champion) push(champion.id, "champion");

  const runnerUp = players.filter((p) => p.placement === 2 || (p.eliminated && p.wins > 0))
    .sort((a, b) => b.wins - a.wins)[0];
  if (runnerUp) push(runnerUp.id, "runner_up");

  const otMaster = [...players].sort((a, b) => b.correctAnswers - a.correctAnswers)[0];
  if (otMaster) push(otMaster.id, "ot_master");

  const buzzKing = [...players].sort((a, b) => b.buzzWins - a.buzzWins)[0];
  if (buzzKing && buzzKing.buzzWins > 0) push(buzzKing.id, "buzz_king");

  const verseHero = [...players].sort((a, b) => b.verseCorrect - a.verseCorrect)[0];
  if (verseHero && verseHero.verseCorrect > 0) push(verseHero.id, "verse_hero");

  const firstOut = [...players].filter((p) => p.eliminated)
    .sort((a, b) => a.wins - b.wins)[0];
  if (firstOut) push(firstOut.id, "first_out");

  return awards;
}
