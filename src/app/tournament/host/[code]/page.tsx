"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Trophy, Users, Zap, ChevronRight, Loader2, CheckCircle2,
  XCircle, Clock, SkipForward, Sparkles, Crown,
} from "lucide-react";
import type { GameRoom, BracketMatch, Player } from "@/lib/tournamentTypes";
import { getRoundName, getTotalRounds } from "@/lib/tournamentTypes";

// ── Hooks ────────────────────────────────────────────────────────────────────

function useGameRoom(code: string) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = useCallback(async () => {
    if (!code) return;                  // wait until code is resolved from params
    try {
      const res = await fetch(`/api/tournament?code=${code}`, { cache: "no-store" });
      if (!res.ok) { setError("Room not found"); return; }
      setError("");                     // clear any previous error on success
      setRoom(await res.json());
    } catch { setError("Connection lost"); }
  }, [code]);

  useEffect(() => {
    poll();
    timerRef.current = setInterval(poll, 1500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [poll]);

  return { room, setRoom, error };
}

// ── Action helper ─────────────────────────────────────────────────────────────
async function doAction(code: string, action: string, payload = {}) {
  const res = await fetch("/api/tournament/action", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ code, action, payload }),
  });
  return res.json();
}

// ── Countdown timer component ─────────────────────────────────────────────────
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
    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-100 rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Bracket visual ────────────────────────────────────────────────────────────
function BracketView({ room }: { room: GameRoom }) {
  const players   = room.players;
  const matches   = room.bracket;
  const totalRounds = getTotalRounds(Object.keys(players).length);

  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);

  return (
    <div className="flex items-start gap-6 overflow-x-auto pb-4">
      {rounds.map((r) => {
        const rMatches = matches.filter((m) => m.round === r);
        return (
          <div key={r} className="flex flex-col gap-4 shrink-0 min-w-[160px]">
            <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest text-center">
              {getRoundName(r, totalRounds)}
            </p>
            <div className="flex flex-col gap-6 justify-around flex-1">
              {rMatches.map((m) => (
                <BracketMatchCard
                  key={m.id}
                  match={m}
                  players={players}
                  isActive={room.currentMatchId === m.id}
                />
              ))}
            </div>
          </div>
        );
      })}
      {/* Champion */}
      <div className="flex flex-col items-center gap-2 shrink-0 min-w-[120px]">
        <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">Champion</p>
        <div className="rounded-xl border-2 border-amber-400 bg-amber-900/40 px-4 py-3 text-center min-h-[56px] flex items-center justify-center">
          {(() => {
            const champ = Object.values(players).find((p) => !p.eliminated);
            if (champ && room.phase === "complete") {
              return (
                <div>
                  <div className="text-2xl">{champ.avatarEmoji}</div>
                  <p className="text-xs font-bold text-amber-300">{champ.name}</p>
                </div>
              );
            }
            return <Crown size={24} className="text-amber-400 opacity-40" />;
          })()}
        </div>
      </div>
    </div>
  );
}

function BracketMatchCard({
  match, players, isActive,
}: {
  match: BracketMatch;
  players: Record<string, Player>;
  isActive: boolean;
}) {
  const p1 = match.player1Id ? players[match.player1Id] : null;
  const p2 = match.player2Id ? players[match.player2Id] : null;

  return (
    <div className={`rounded-xl border ${isActive ? "border-amber-400 bg-amber-900/40 shadow-lg shadow-amber-500/20" : "border-white/20 bg-white/5"} overflow-hidden`}>
      <PlayerSlot player={p1} isWinner={match.winnerId === p1?.id} score={match.matchScore[p1?.id ?? ""] ?? 0} />
      <div className="h-px bg-white/10" />
      <PlayerSlot player={p2} isWinner={match.winnerId === p2?.id} score={match.matchScore[p2?.id ?? ""] ?? 0} />
      {match.isBye && (
        <p className="text-[10px] text-center text-white/30 py-0.5">BYE</p>
      )}
    </div>
  );
}

function PlayerSlot({ player, isWinner, score }: { player: Player | null; isWinner: boolean; score: number }) {
  if (!player) {
    return <div className="px-3 py-2 text-xs text-white/20 italic">TBD</div>;
  }
  return (
    <div className={`flex items-center gap-2 px-3 py-2 ${isWinner ? "bg-amber-500/20" : player.eliminated ? "opacity-40" : ""}`}>
      <span className="text-base">{player.avatarEmoji}</span>
      <span className={`text-xs font-semibold truncate flex-1 ${isWinner ? "text-amber-300" : "text-white"}`}>
        {player.name}
      </span>
      {score > 0 && (
        <span className="text-[10px] font-bold text-amber-400 bg-amber-900/60 px-1.5 py-0.5 rounded-full">{score}</span>
      )}
      {isWinner && <Trophy size={12} className="text-amber-400 shrink-0" />}
    </div>
  );
}

// ── Main host page ────────────────────────────────────────────────────────────
export default function HostPage({ params }: { params: Promise<{ code: string }> }) {
  const [code, setCode] = useState("");
  useEffect(() => { params.then((p) => setCode(p.code.toUpperCase())); }, [params]);

  const searchParams = useSearchParams();
  const hostId = searchParams.get("hostId") ?? "";

  const { room, error } = useGameRoom(code);
  const [acting, setActing]     = useState(false);
  const [aiTopic, setAiTopic]   = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [timer, setTimer]       = useState(0);

  // Countdown display
  useEffect(() => {
    if (!room?.questionStartedAt || !room.currentQuestion) return;
    const iv = setInterval(() => {
      const elapsed = Math.floor((Date.now() - room.questionStartedAt!) / 1000);
      setTimer(Math.max(0, room.currentQuestion!.timeLimitSec - elapsed));
    }, 500);
    return () => clearInterval(iv);
  }, [room?.questionStartedAt, room?.currentQuestion]);

  const act = async (action: string, payload = {}) => {
    if (acting || !code) return;
    setActing(true);
    await doAction(code, action, payload);
    setActing(false);
  };

  const generateAI = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    await doAction(code, "generate_ai_qs", { topic: aiTopic });
    setAiLoading(false);
    setAiTopic("");
  };

  if (!code) return null;
  if (error) return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center text-white">
      <p>Error: {error}</p>
    </div>
  );
  if (!room) return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
      <Loader2 size={32} className="text-indigo-400 animate-spin" />
    </div>
  );

  const players    = Object.values(room.players);
  const curMatch   = room.bracket.find((m) => m.id === room.currentMatchId);
  const p1         = curMatch?.player1Id ? room.players[curMatch.player1Id] : null;
  const p2         = curMatch?.player2Id ? room.players[curMatch.player2Id] : null;
  const totalRounds = getTotalRounds(players.length);

  return (
    <div className="min-h-screen bg-indigo-950 text-white flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="bg-black/30 border-b border-white/10 px-6 py-3 flex items-center gap-4 shrink-0">
        <div className="text-xl font-extrabold">✝️ Bible Bowl</div>
        <div className="ml-4 bg-amber-500 text-black font-bold text-xl px-4 py-1 rounded-xl tracking-widest">
          {code}
        </div>
        <span className="text-indigo-300 text-sm">Join at scripturelives.com/tournament</span>
        <div className="ml-auto flex items-center gap-3">
          <Users size={16} className="text-indigo-400" />
          <span className="text-sm font-semibold text-indigo-200">{players.length} players</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            room.phase === "lobby"    ? "bg-blue-500/30 text-blue-300"   :
            room.phase === "question" ? "bg-green-500/30 text-green-300" :
            room.phase === "complete" ? "bg-amber-500/30 text-amber-300" :
            "bg-purple-500/30 text-purple-300"
          }`}>
            {room.phase.toUpperCase()}
          </span>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">

        {/* ── Main area ─────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">

          {/* LOBBY */}
          {room.phase === "lobby" && (
            <div className="flex flex-col items-center gap-8 py-6">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold mb-2">Waiting for Players</h2>
                <p className="text-indigo-300">Students join at <span className="text-amber-300 font-bold">scripturelives.com/tournament</span> with code <span className="text-amber-300 font-bold">{code}</span></p>
              </div>
              {/* Player list */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
                {players.map((p) => (
                  <div key={p.id} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                    <div className="text-3xl mb-1">{p.avatarEmoji}</div>
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-dashed border-white/10">
                    <div className="text-3xl mb-1 opacity-20">👤</div>
                    <p className="text-xs text-white/20">Waiting…</p>
                  </div>
                ))}
              </div>
              {players.length >= 2 && (
                <button
                  onClick={() => act("start_tournament")}
                  disabled={acting}
                  className="rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xl px-10 py-4 flex items-center gap-3 shadow-2xl transition active:scale-95 disabled:opacity-50"
                >
                  {acting ? <Loader2 size={22} className="animate-spin" /> : <><Trophy size={22} /> Start Tournament!</>}
                </button>
              )}
              {players.length < 2 && (
                <p className="text-indigo-400 text-sm">Need at least 2 players to start</p>
              )}
            </div>
          )}

          {/* BRACKET SEEDING */}
          {(room.phase === "seeding" || room.phase === "advancing") && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-extrabold text-center">Tournament Bracket</h2>
              <div className="bg-white/5 rounded-2xl p-4 overflow-x-auto">
                <BracketView room={room} />
              </div>
              {getNextMatch(room.bracket) && (
                <div className="flex flex-col items-center gap-3">
                  {(() => {
                    const next = getNextMatch(room.bracket);
                    const np1 = next?.player1Id ? room.players[next.player1Id] : null;
                    const np2 = next?.player2Id ? room.players[next.player2Id] : null;
                    return (
                      <>
                        <p className="text-indigo-300 text-sm">Next matchup:</p>
                        <p className="text-2xl font-extrabold">
                          {np1?.avatarEmoji} {np1?.name} <span className="text-indigo-400 mx-3">vs</span> {np2?.name} {np2?.avatarEmoji}
                        </p>
                        <button
                          onClick={() => { const nm = getNextMatch(room.bracket); if (nm) act("start_match", { matchId: nm.id }); }}
                          disabled={acting}
                          className="rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-3 flex items-center gap-2 transition"
                        >
                          <ChevronRight size={20} /> Begin Matchup
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* MATCHUP INTRO */}
          {room.phase === "matchup" && curMatch && p1 && p2 && (
            <div className="flex flex-col items-center gap-6 py-4">
              <h2 className="text-xl font-bold text-indigo-300">{getRoundName(curMatch.round, totalRounds)}</h2>
              <div className="flex items-center gap-8 text-center">
                <div>
                  <div className="text-6xl mb-2">{p1.avatarEmoji}</div>
                  <p className="text-2xl font-extrabold">{p1.name}</p>
                  <p className="text-indigo-400 text-sm">{p1.wins} wins</p>
                </div>
                <div className="text-4xl font-black text-indigo-500">VS</div>
                <div>
                  <div className="text-6xl mb-2">{p2.avatarEmoji}</div>
                  <p className="text-2xl font-extrabold">{p2.name}</p>
                  <p className="text-indigo-400 text-sm">{p2.wins} wins</p>
                </div>
              </div>
              <p className="text-indigo-300 text-sm">
                Best of {curMatch.questions.length} questions · {curMatch.questions.map((q) => q.type === "mc" ? "📋" : q.type === "buzz" ? "⚡" : "📖").join(" ")}
              </p>
              <button
                onClick={() => act("reveal_question")}
                disabled={acting}
                className="rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3 flex items-center gap-2 text-lg transition"
              >
                {acting ? <Loader2 size={18} className="animate-spin" /> : <>Reveal Question {room.currentQuestionIndex + 1}</>}
              </button>
            </div>
          )}

          {/* QUESTION ACTIVE */}
          {(room.phase === "question" || room.phase === "buzzed") && room.currentQuestion && (
            <div className="flex flex-col gap-4">
              {/* Question header */}
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  room.currentQuestion.type === "buzz"  ? "bg-yellow-500/30 text-yellow-300" :
                  room.currentQuestion.type === "verse" ? "bg-purple-500/30 text-purple-300" :
                  "bg-blue-500/30 text-blue-300"
                }`}>
                  {room.currentQuestion.type === "buzz" ? "⚡ BUZZ-IN" : room.currentQuestion.type === "verse" ? "📖 VERSE COMPLETION" : "📋 MULTIPLE CHOICE"}
                </span>
                <span className="text-xs text-indigo-400">Q{room.currentQuestionIndex + 1} of {curMatch?.questions.length ?? "?"}</span>
                <span className="ml-auto text-2xl font-extrabold text-amber-400">{timer}s</span>
              </div>

              {room.questionStartedAt && room.currentQuestion && (
                <CountdownBar startedAt={room.questionStartedAt} limitSec={room.currentQuestion.timeLimitSec} />
              )}

              {/* Question text */}
              <div className="bg-white/10 rounded-2xl p-6">
                <p className="text-2xl sm:text-3xl font-bold leading-snug text-center">
                  {room.currentQuestion.text}
                </p>
                {room.currentQuestion.verseRef && (
                  <p className="text-center text-indigo-300 text-sm mt-2">— {room.currentQuestion.verseRef}</p>
                )}
              </div>

              {/* MC options */}
              {room.currentQuestion.type !== "buzz" && room.currentQuestion.options && (
                <div className="grid grid-cols-2 gap-3">
                  {room.currentQuestion.options.map((opt, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold">
                      <span className="text-indigo-400 mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                    </div>
                  ))}
                </div>
              )}

              {/* Buzz-in status */}
              {room.currentQuestion.type === "buzz" && (
                <div className="text-center py-4">
                  {room.buzzedPlayerId ? (
                    <div className="bg-yellow-500/20 border border-yellow-400 rounded-2xl p-4">
                      <p className="text-yellow-300 font-bold text-lg">⚡ {room.players[room.buzzedPlayerId]?.name} buzzed in!</p>
                      <p className="text-indigo-300 text-sm mt-1">Waiting for their answer…</p>
                    </div>
                  ) : (
                    <p className="text-indigo-400 text-lg animate-pulse">Waiting for a buzz-in…</p>
                  )}
                </div>
              )}

              {/* Host controls */}
              <div className="flex gap-3">
                <button
                  onClick={() => act("reveal_answer")}
                  disabled={acting}
                  className="flex-1 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold py-3 flex items-center justify-center gap-2 transition"
                >
                  <CheckCircle2 size={18} /> Reveal Answer
                </button>
                <button
                  onClick={() => act("next_question")}
                  disabled={acting}
                  className="rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 flex items-center gap-2 transition"
                  title="Skip question"
                >
                  <SkipForward size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ANSWER REVEALED */}
          {room.phase === "revealed" && room.currentQuestion && curMatch && (
            <div className="flex flex-col items-center gap-5 py-2">
              <div className="bg-green-500/20 border border-green-400 rounded-2xl px-6 py-4 text-center w-full max-w-lg">
                <p className="text-xs text-green-300 font-bold uppercase mb-1">Correct Answer</p>
                <p className="text-3xl font-extrabold text-green-300">{room.currentQuestion.answer}</p>
                {room.currentQuestion.reference && (
                  <p className="text-sm text-green-400/70 mt-1">— {room.currentQuestion.reference}</p>
                )}
              </div>

              {/* Match scores */}
              {p1 && p2 && (
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-4xl font-extrabold text-amber-300">{curMatch.matchScore[p1.id] ?? 0}</p>
                    <p className="text-sm text-white/60">{p1.name}</p>
                  </div>
                  <div className="text-white/30 text-xl">—</div>
                  <div>
                    <p className="text-4xl font-extrabold text-amber-300">{curMatch.matchScore[p2.id] ?? 0}</p>
                    <p className="text-sm text-white/60">{p2.name}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => act("next_question")}
                disabled={acting}
                className="rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-3 flex items-center gap-2 text-lg transition"
              >
                {acting ? <Loader2 size={18} className="animate-spin" /> : <><ChevronRight size={18} /> Continue</>}
              </button>
            </div>
          )}

          {/* MATCH ADVANCING */}
          {room.phase === "advancing" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="bg-white/5 rounded-2xl p-4 overflow-x-auto w-full">
                <BracketView room={room} />
              </div>
              <button
                onClick={() => act("advance_bracket")}
                disabled={acting}
                className="rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-8 py-3 flex items-center gap-2 text-lg transition"
              >
                {acting ? <Loader2 size={18} className="animate-spin" /> : <><ChevronRight size={18} /> Next Match</>}
              </button>
            </div>
          )}

          {/* COMPLETE */}
          {room.phase === "complete" && (
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              <div className="text-6xl">🏆</div>
              <h2 className="text-4xl font-extrabold text-amber-300">Tournament Over!</h2>

              {/* Champion */}
              {(() => {
                const champ = Object.values(room.players).find((p) => !p.eliminated);
                return champ ? (
                  <div className="bg-amber-500/20 border border-amber-400 rounded-2xl px-8 py-5">
                    <div className="text-5xl mb-2">{champ.avatarEmoji}</div>
                    <p className="text-3xl font-extrabold text-amber-300">{champ.name}</p>
                    <p className="text-amber-200/70">🏆 Champion of Champions</p>
                  </div>
                ) : null;
              })()}

              {/* Awards */}
              {room.awards.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                  {room.awards.map((a, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                      <div className="text-3xl mb-1">{a.emoji}</div>
                      <p className="text-xs font-bold text-amber-300">{a.title}</p>
                      <p className="text-xs text-indigo-300 mt-0.5">{room.players[a.playerId]?.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <a href="/tournament" className="rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-3 transition">
                Play Again
              </a>
            </div>
          )}
        </main>

        {/* ── Right sidebar ──────────────────────────────────────────── */}
        <aside className="w-64 bg-black/20 border-l border-white/10 flex flex-col shrink-0">

          {/* Players */}
          <div className="p-4 border-b border-white/10">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Players</p>
            <div className="space-y-1.5">
              {Object.values(room.players)
                .sort((a, b) => b.score - a.score)
                .map((p) => (
                  <div key={p.id} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${p.eliminated ? "opacity-40" : ""}`}>
                    <span>{p.avatarEmoji}</span>
                    <span className="text-xs font-semibold flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-amber-400 font-bold">{p.score}</span>
                    {p.eliminated && <XCircle size={12} className="text-red-400 shrink-0" />}
                  </div>
                ))}
            </div>
          </div>

          {/* AI question generator */}
          {room.phase !== "complete" && room.phase !== "lobby" && (
            <div className="p-4 border-b border-white/10">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">AI Questions</p>
              <div className="flex gap-2">
                <input
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generateAI()}
                  placeholder="e.g. Psalms"
                  className="flex-1 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 px-2 py-1.5 text-xs focus:outline-none"
                />
                <button
                  onClick={generateAI}
                  disabled={aiLoading || !aiTopic.trim()}
                  className="rounded-lg bg-purple-600 hover:bg-purple-500 text-white px-2 py-1.5 disabled:opacity-40 transition"
                >
                  {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                </button>
              </div>
            </div>
          )}

          {/* Chat / feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {[...room.chatMessages].reverse().slice(0, 20).map((m) => (
              <p key={m.id} className="text-xs text-indigo-300 leading-relaxed">{m.text}</p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ── Helper (client-side, not from lib to avoid SSR issues) ──────────────────
function getNextMatch(bracket: BracketMatch[]): BracketMatch | undefined {
  return bracket.find((m) => m.status === "pending" && !m.isBye && m.player1Id && m.player2Id);
}
