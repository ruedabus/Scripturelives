"use client";

/**
 * /matchmaking/play/[code]
 *
 * Auto-host 1v1 matchmaking game. Both clients independently:
 *  • Poll state every 1 s
 *  • Submit answers
 *  • Auto-call reveal_answer when time expires (idempotent on the server)
 *  • Auto-call next_question after 4 s of "revealed"
 *  • Auto-call advance_bracket when "advancing"
 */

import React, {
  useState, useEffect, useCallback, useRef, Suspense,
} from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loader2, Trophy, Zap, CheckCircle2, XCircle, Crown } from "lucide-react";
import type { GameRoom, BracketMatch, TournamentQuestion } from "@/lib/tournamentTypes";

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = GameRoom["phase"];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function doAction(code: string, playerId: string, action: string, payload = {}) {
  const res = await fetch("/api/tournament/action", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ code, playerId, action, payload }),
  });
  return res.json();
}

// ── Countdown bar ─────────────────────────────────────────────────────────────

function CountdownBar({ startedAt, limitSec }: { startedAt: number; limitSec: number }) {
  const [pct, setPct] = useState(100);
  useEffect(() => {
    const iv = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      setPct(Math.max(0, ((limitSec - elapsed) / limitSec) * 100));
    }, 100);
    return () => clearInterval(iv);
  }, [startedAt, limitSec]);

  const color = pct > 60 ? "bg-green-500" : pct > 30 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-100 rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Player score strip ────────────────────────────────────────────────────────

function ScoreStrip({
  room, myId, match,
}: { room: GameRoom; myId: string; match: BracketMatch | null }) {
  const players = Object.values(room.players);
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      {players.map((p) => {
        const isMe     = p.id === myId;
        const score    = match?.matchScore[p.id] ?? 0;
        const answered = match
          ? (match.answers[p.id]?.length ?? 0) > room.currentQuestionIndex
          : false;
        return (
          <div
            key={p.id}
            className={`flex-1 flex flex-col items-center p-3 rounded-xl border ${
              isMe
                ? "bg-amber-500/20 border-amber-400/50"
                : "bg-white/10 border-white/20"
            }`}
          >
            <span className="text-2xl">{p.avatarEmoji}</span>
            <span className={`font-bold text-sm truncate max-w-full ${isMe ? "text-amber-300" : "text-white"}`}>
              {p.name}{isMe ? " (You)" : ""}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xl font-black text-white">{score}</span>
              {answered && <CheckCircle2 size={14} className="text-green-400" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Question display ──────────────────────────────────────────────────────────

function QuestionCard({
  q, room, myId, code, match, onAnswer,
}: {
  q: TournamentQuestion;
  room: GameRoom;
  myId: string;
  code: string;
  match: BracketMatch;
  onAnswer: () => void;
}) {
  const [selected,   setSelected]   = useState<string | null>(null);
  const [verseInput, setVerseInput] = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const [buzzed,     setBuzzed]     = useState(false);

  // Reset when question changes
  useEffect(() => {
    setSelected(null);
    setVerseInput("");
    setSubmitted(false);
    setBuzzed(false);
  }, [q.id]);

  const alreadyAnswered = (match.answers[myId]?.length ?? 0) > room.currentQuestionIndex;

  const submitAnswer = async (answer: string) => {
    if (submitted || alreadyAnswered) return;
    setSubmitted(true);
    await doAction(code, myId, "submit_answer", { answer });
    onAnswer();
  };

  const buzzIn = async () => {
    if (buzzed || room.buzzedPlayerId) return;
    setBuzzed(true);
    await doAction(code, myId, "buzz_in", {});
  };

  // ── MC ──────────────────────────────────────────────────────────────────────
  if (q.type === "mc") {
    return (
      <div className="flex flex-col gap-3 w-full">
        {(q.options ?? []).map((opt) => (
          <button
            key={opt}
            disabled={submitted || alreadyAnswered}
            onClick={() => { setSelected(opt); submitAnswer(opt); }}
            className={`w-full p-3 rounded-xl text-left font-medium border transition-all ${
              selected === opt
                ? "bg-amber-500 border-amber-400 text-black"
                : submitted || alreadyAnswered
                ? "bg-white/5 border-white/10 text-indigo-300 cursor-default"
                : "bg-white/10 border-white/20 text-white hover:bg-white/20 active:bg-amber-500/30"
            }`}
          >
            {opt}
          </button>
        ))}
        {(submitted || alreadyAnswered) && (
          <p className="text-center text-indigo-300 text-sm">Waiting for opponent…</p>
        )}
      </div>
    );
  }

  // ── Buzz ────────────────────────────────────────────────────────────────────
  if (q.type === "buzz") {
    const isBuzzed   = room.phase === "buzzed";
    const myBuzz     = room.buzzedPlayerId === myId;
    const theirBuzz  = isBuzzed && !myBuzz;

    if (theirBuzz) {
      const buzzer = room.players[room.buzzedPlayerId!];
      return (
        <div className="text-center py-4">
          <Zap size={32} className="text-amber-400 mx-auto mb-2" />
          <p className="text-white font-bold">{buzzer?.name} buzzed in!</p>
          <p className="text-indigo-300 text-sm mt-1">Waiting for their answer…</p>
        </div>
      );
    }

    if (myBuzz) {
      return (
        <div className="flex flex-col gap-3 w-full">
          <p className="text-amber-300 font-bold text-center">You buzzed in! Type your answer:</p>
          <input
            autoFocus
            value={verseInput}
            onChange={(e) => setVerseInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verseInput.trim() && doAction(code, myId, "buzz_answer", { answer: verseInput.trim() })}
            placeholder="Type answer…"
            className="w-full p-3 rounded-xl bg-white/10 border border-amber-400/50 text-white placeholder-indigo-400 outline-none"
          />
          <button
            onClick={() => verseInput.trim() && doAction(code, myId, "buzz_answer", { answer: verseInput.trim() })}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
          >
            Submit Answer
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-4 w-full">
        <button
          onClick={buzzIn}
          disabled={isBuzzed}
          className="w-full py-6 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-black text-2xl rounded-2xl transition-all disabled:opacity-40 flex items-center justify-center gap-3"
        >
          <Zap size={28} />
          BUZZ IN
        </button>
        {isBuzzed && <p className="text-indigo-300 text-sm">Someone else buzzed first!</p>}
      </div>
    );
  }

  // ── Verse completion ────────────────────────────────────────────────────────
  if (q.type === "verse") {
    return (
      <div className="flex flex-col gap-3 w-full">
        {q.verseRef && (
          <p className="text-amber-300 text-sm text-center font-medium">📖 {q.verseRef}</p>
        )}
        <input
          autoFocus={!submitted && !alreadyAnswered}
          value={verseInput}
          onChange={(e) => setVerseInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitted && verseInput.trim() && submitAnswer(verseInput.trim())}
          disabled={submitted || alreadyAnswered}
          placeholder="Complete the verse…"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-indigo-400 outline-none disabled:opacity-50"
        />
        <button
          onClick={() => verseInput.trim() && submitAnswer(verseInput.trim())}
          disabled={submitted || alreadyAnswered || !verseInput.trim()}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl disabled:opacity-40"
        >
          Submit
        </button>
        {(submitted || alreadyAnswered) && (
          <p className="text-center text-indigo-300 text-sm">Waiting for opponent…</p>
        )}
      </div>
    );
  }

  return null;
}

// ── Reveal card ───────────────────────────────────────────────────────────────

function RevealCard({
  room, myId, match,
}: { room: GameRoom; myId: string; match: BracketMatch }) {
  const q          = room.currentQuestion!;
  const myAns      = (match.answers[myId] ?? []).at(-1);
  const players    = Object.values(room.players);
  const questionWinner = players.find((p) => {
    const ans = (match.answers[p.id] ?? []).at(-1);
    return ans?.correct;
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Correct answer */}
      <div className="bg-green-900/40 border border-green-500/40 rounded-xl p-4 text-center">
        <p className="text-green-300 text-xs uppercase font-bold mb-1">Correct Answer</p>
        <p className="text-white font-semibold">{q.answer}</p>
      </div>

      {/* My result */}
      <div className={`flex items-center gap-3 p-3 rounded-xl border ${
        myAns?.correct
          ? "bg-green-900/30 border-green-500/40"
          : "bg-red-900/30 border-red-500/40"
      }`}>
        {myAns?.correct
          ? <CheckCircle2 size={22} className="text-green-400 shrink-0" />
          : <XCircle      size={22} className="text-red-400   shrink-0" />}
        <div>
          <p className="text-white text-sm font-medium">
            {myAns?.correct ? "You got it! 🎉" : "Not quite"}
          </p>
          {myAns?.answer && (
            <p className="text-indigo-300 text-xs">Your answer: {myAns.answer}</p>
          )}
        </div>
        {myAns?.correct && (
          <span className="ml-auto text-green-400 font-bold">+{myAns.pointsEarned ?? q.points}</span>
        )}
      </div>

      {/* Question winner */}
      {questionWinner && (
        <p className="text-center text-amber-300 text-sm font-medium">
          ✅ {questionWinner.name} wins this question
        </p>
      )}

      <p className="text-center text-indigo-400 text-xs">Next question loading…</p>
    </div>
  );
}

// ── Final result screen ───────────────────────────────────────────────────────

function ResultScreen({
  room, myId, onRematch,
}: { room: GameRoom; myId: string; onRematch: () => void }) {
  const router  = useRouter();
  const players = Object.values(room.players);
  const me      = room.players[myId];
  const match   = room.bracket[0]; // 1v1: always one match
  const myScore = match?.matchScore[myId] ?? 0;
  const oppId   = players.find((p) => p.id !== myId)?.id ?? "";
  const oppScore= match?.matchScore[oppId] ?? 0;
  const won     = myScore > oppScore;
  const tied    = myScore === oppScore;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center justify-center gap-8 text-white px-4 py-12">

      <div className="text-center">
        <div className="text-7xl mb-4">
          {won ? "🏆" : tied ? "🤝" : "💪"}
        </div>
        <h1 className={`text-3xl font-black ${won ? "text-amber-300" : tied ? "text-indigo-300" : "text-white"}`}>
          {won ? "Victory!" : tied ? "Draw!" : "Good Fight!"}
        </h1>
        <p className="text-indigo-300 mt-1">
          {won ? "You won the match" : tied ? "It was a tie" : "You'll get them next time"}
        </p>
      </div>

      {/* Score card */}
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-around">
          {players.map((p) => {
            const isMe  = p.id === myId;
            const score = match?.matchScore[p.id] ?? 0;
            const isWin = match ? score > (match.matchScore[p.id === players[0].id ? players[1]?.id : players[0]?.id] ?? 0) : false;
            return (
              <div key={p.id} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <span className="text-4xl">{p.avatarEmoji}</span>
                  {isWin && <Crown size={16} className="text-amber-400 absolute -top-2 -right-2" />}
                </div>
                <p className={`font-bold text-sm ${isMe ? "text-amber-300" : "text-white"}`}>
                  {p.name}{isMe ? " (You)" : ""}
                </p>
                <p className="text-4xl font-black text-white">{score}</p>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-4 text-indigo-400 text-sm">
          Best of {match?.questions.length ?? 5} questions
        </div>
      </div>

      {/* ELO note */}
      <p className="text-indigo-400 text-sm text-center">
        ELO rating updated · Check the{" "}
        <button
          onClick={() => router.push("/leaderboard")}
          className="text-amber-400 hover:text-amber-300 underline"
        >
          leaderboard
        </button>
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={onRematch}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg rounded-xl"
        >
          ⚡ Find Another Match
        </button>
        <button
          onClick={() => router.push("/tournament")}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl"
        >
          Tournament Lobby
        </button>
      </div>
    </div>
  );
}

// ── Main game component ───────────────────────────────────────────────────────

function MatchmakingGame({ code, myId }: { code: string; myId: string }) {
  const router   = useRouter();
  const [room, setRoom]   = useState<GameRoom | null>(null);
  const [error, setError] = useState("");

  // Track which phase-transitions we've already triggered (idempotency on client)
  const revealedAtRef    = useRef<number | null>(null);
  const advancingFiredRef= useRef(false);
  const answerSubmitted  = useRef(false);

  // ── Poll ─────────────────────────────────────────────────────────────────
  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/tournament?code=${code}`, { cache: "no-store" });
      if (!res.ok) { setError("Room not found"); return; }
      setError("");
      const r: GameRoom = await res.json();
      setRoom(r);
    } catch { setError("Connection lost"); }
  }, [code]);

  useEffect(() => {
    poll();
    const iv = setInterval(poll, 1500);
    return () => clearInterval(iv);
  }, [poll]);

  // ── Auto-host: fire reveal after time limit ───────────────────────────────
  useEffect(() => {
    if (!room || room.phase !== "question" || !room.currentQuestion || !room.questionStartedAt) return;

    const limitMs = room.currentQuestion.timeLimitSec * 1000;
    const remaining = limitMs - (Date.now() - room.questionStartedAt);
    if (remaining <= 0) {
      // Time already expired, reveal now
      doAction(code, myId, "reveal_answer", {}).catch(() => {});
      return;
    }

    const t = setTimeout(() => {
      doAction(code, myId, "reveal_answer", {}).catch(() => {});
    }, remaining + 200); // +200ms grace

    return () => clearTimeout(t);
  }, [room?.currentQuestionIndex, room?.questionStartedAt, code, myId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-host: advance after 4 s of "revealed" ────────────────────────────
  useEffect(() => {
    if (!room || room.phase !== "revealed") return;

    // Only start the countdown once per reveal
    const now = Date.now();
    if (revealedAtRef.current === null) revealedAtRef.current = now;

    const t = setTimeout(() => {
      revealedAtRef.current = null;
      doAction(code, myId, "next_question", {}).catch(() => {});
    }, 4000);

    return () => clearTimeout(t);
  }, [room?.phase, room?.currentQuestionIndex, code, myId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-host: advance bracket when "advancing" ───────────────────────────
  useEffect(() => {
    if (!room || room.phase !== "advancing") return;
    if (advancingFiredRef.current) return;
    advancingFiredRef.current = true;
    const t = setTimeout(() => {
      advancingFiredRef.current = false;
      doAction(code, myId, "advance_bracket", {}).catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [room?.phase, code, myId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset answerSubmitted when question changes
  useEffect(() => {
    answerSubmitted.current = false;
  }, [room?.currentQuestionIndex]);

  // ── Complete ──────────────────────────────────────────────────────────────
  if (room?.phase === "complete") {
    return (
      <ResultScreen
        room={room}
        myId={myId}
        onRematch={() => router.push("/matchmaking")}
      />
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!room) {
    return (
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
        {error
          ? <p className="text-red-400 text-center px-4">{error}</p>
          : <Loader2 size={40} className="text-amber-400 animate-spin" />}
      </div>
    );
  }

  const match   = room.bracket.find((m) => m.id === room.currentMatchId) ?? null;
  const q       = room.currentQuestion;
  const phase   = room.phase;
  const players = Object.values(room.players);
  const qNum    = room.currentQuestionIndex + 1;
  const qTotal  = match?.questions.length ?? 5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center px-4 py-6 text-white gap-5">

      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between">
        <span className="text-indigo-400 text-sm">⚔️ Quick Match</span>
        <span className="text-indigo-400 text-sm">Q {qNum} / {qTotal}</span>
      </div>

      {/* Score strip */}
      <ScoreStrip room={room} myId={myId} match={match} />

      {/* Question card */}
      {(phase === "question" || phase === "buzzed") && q && (
        <div className="w-full max-w-md flex flex-col gap-4">
          {/* Timer bar */}
          {room.questionStartedAt && (
            <CountdownBar startedAt={room.questionStartedAt} limitSec={q.timeLimitSec} />
          )}

          {/* Category badge */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-purple-700/50 text-purple-300 text-xs rounded-full">
              {q.category}
            </span>
            <span className="px-2 py-0.5 bg-indigo-700/50 text-indigo-300 text-xs rounded-full capitalize">
              {q.difficulty}
            </span>
            <span className="ml-auto text-amber-400 text-sm font-bold">+{q.points} pts</span>
          </div>

          {/* Question text */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-white font-semibold leading-relaxed">{q.text}</p>
          </div>

          {/* Answer inputs */}
          {match && (
            <QuestionCard
              q={q}
              room={room}
              myId={myId}
              code={code}
              match={match}
              onAnswer={() => { answerSubmitted.current = true; }}
            />
          )}
        </div>
      )}

      {/* Reveal card */}
      {phase === "revealed" && q && match && (
        <div className="w-full max-w-md">
          <RevealCard room={room} myId={myId} match={match} />
        </div>
      )}

      {/* Transitioning */}
      {(phase === "advancing" || phase === "matchup" || phase === "seeding") && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <Loader2 size={36} className="text-amber-400 animate-spin" />
          <p className="text-indigo-300">Next question…</p>
        </div>
      )}

      {/* Lobby (waiting for game to start) */}
      {phase === "lobby" && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <Loader2 size={36} className="text-amber-400 animate-spin" />
          <p className="text-indigo-300">Starting match…</p>
          <div className="flex items-center gap-3 mt-4">
            {players.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1">
                <span className="text-3xl">{p.avatarEmoji}</span>
                <span className="text-indigo-300 text-xs">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ── Search params wrapper ─────────────────────────────────────────────────────

function GameWithParams({ code }: { code: string }) {
  const searchParams = useSearchParams();
  const myId = searchParams.get("playerId") ?? "";

  if (!myId) {
    return (
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
        <p className="text-red-400">Missing player ID. Please rejoin from matchmaking.</p>
      </div>
    );
  }

  return <MatchmakingGame code={code} myId={myId} />;
}

// ── Page export ───────────────────────────────────────────────────────────────

export default function MatchmakingPlayPage() {
  const params = useParams();
  const code   = (params?.code as string ?? "").toUpperCase();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
        <Loader2 size={40} className="text-amber-400 animate-spin" />
      </div>
    }>
      <GameWithParams code={code} />
    </Suspense>
  );
}
