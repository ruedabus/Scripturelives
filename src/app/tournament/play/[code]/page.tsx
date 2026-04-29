"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Trophy, Zap, Loader2, CheckCircle2, XCircle,
  Crown, Star, Users,
} from "lucide-react";
import type { GameRoom, BracketMatch } from "@/lib/tournamentTypes";
import { getRoundName, getTotalRounds } from "@/lib/tournamentTypes";

// ── Polling hook ─────────────────────────────────────────────────────────────

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

  return { room, error };
}

// ── Action helper ─────────────────────────────────────────────────────────────

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

// ── Mini bracket (phone-sized) ─────────────────────────────────────────────────

function MiniBracket({ room, myId }: { room: GameRoom; myId: string }) {
  const players      = room.players;
  const totalRounds  = getTotalRounds(Object.keys(players).length);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-start gap-4 min-w-max">
        {Array.from({ length: totalRounds }, (_, i) => i + 1).map((r) => {
          const rMatches = room.bracket.filter((m) => m.round === r);
          return (
            <div key={r} className="flex flex-col gap-3 shrink-0 min-w-[130px]">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest text-center">
                {getRoundName(r, totalRounds)}
              </p>
              {rMatches.map((m) => {
                const p1 = m.player1Id ? players[m.player1Id] : null;
                const p2 = m.player2Id ? players[m.player2Id] : null;
                const isActive = room.currentMatchId === m.id;
                const myMatch  = m.player1Id === myId || m.player2Id === myId;
                return (
                  <div key={m.id} className={`rounded-xl border text-xs overflow-hidden
                    ${isActive ? "border-amber-400 bg-amber-900/30" : myMatch ? "border-indigo-400/60 bg-indigo-900/30" : "border-white/10 bg-white/5"}`}>
                    {[p1, p2].map((p, idx) => (
                      <div key={idx}>
                        {idx === 1 && <div className="h-px bg-white/10" />}
                        <div className={`flex items-center gap-1.5 px-2 py-1.5
                          ${m.winnerId === p?.id ? "bg-amber-500/20" : p?.eliminated ? "opacity-30" : ""}
                          ${p?.id === myId ? "text-amber-200" : "text-white/70"}`}>
                          <span className="text-sm">{p?.avatarEmoji ?? "?"}</span>
                          <span className="truncate flex-1 font-medium">{p?.name ?? "TBD"}</span>
                          {m.matchScore[p?.id ?? ""] > 0 && (
                            <span className="text-[10px] text-amber-400 font-bold">{m.matchScore[p?.id ?? ""]}</span>
                          )}
                          {m.winnerId === p?.id && <Trophy size={10} className="text-amber-400 shrink-0" />}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
        {/* Champion slot */}
        <div className="flex flex-col items-center gap-2 shrink-0 min-w-[90px]">
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Champ</p>
          <div className="rounded-xl border-2 border-amber-400/60 bg-amber-900/20 px-3 py-2 text-center min-h-[44px] flex items-center justify-center w-full">
            {(() => {
              const champ = Object.values(players).find((p) => !p.eliminated);
              return room.phase === "complete" && champ
                ? <div><div className="text-lg">{champ.avatarEmoji}</div><p className="text-[10px] text-amber-300 font-bold">{champ.name}</p></div>
                : <Crown size={16} className="text-amber-400/40" />;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main player page ──────────────────────────────────────────────────────────

export default function PlayerPage({ params }: { params: Promise<{ code: string }> }) {
  const [code, setCode] = useState("");
  useEffect(() => { params.then((p) => setCode(p.code.toUpperCase())); }, [params]);

  const searchParams = useSearchParams();
  const playerId     = searchParams.get("playerId") ?? "";

  const { room, error } = useGameRoom(code);

  // Action state
  const [acting,   setActing]   = useState(false);
  const [buzzAnim, setBuzzAnim] = useState(false);

  // Answer state
  const [selectedMC,    setSelectedMC]    = useState<string | null>(null);
  const [buzzAnswerTxt, setBuzzAnswerTxt] = useState("");
  const [submitted,     setSubmitted]     = useState(false);

  // Reset answer state on new question
  const lastQId = useRef<string | null>(null);
  useEffect(() => {
    if (!room?.currentQuestion) return;
    if (room.currentQuestion.id !== lastQId.current) {
      lastQId.current = room.currentQuestion.id;
      setSelectedMC(null);
      setBuzzAnswerTxt("");
      setSubmitted(false);
    }
  }, [room?.currentQuestion]);

  const act = useCallback(async (action: string, payload = {}) => {
    if (acting || !code || !playerId) return;
    setActing(true);
    await doAction(code, playerId, action, payload);
    setActing(false);
  }, [acting, code, playerId]);

  const buzzIn = async () => {
    if (acting || submitted) return;
    setBuzzAnim(true);
    setTimeout(() => setBuzzAnim(false), 300);
    setActing(true);
    await doAction(code, playerId, "buzz_in", {});
    setActing(false);
  };

  const submitMC = async (answer: string) => {
    if (submitted) return;
    setSelectedMC(answer);
    setSubmitted(true);
    await act("submit_answer", { answer });
  };

  const submitBuzzAnswer = async () => {
    if (!buzzAnswerTxt.trim() || submitted) return;
    setSubmitted(true);
    await act("buzz_answer", { answer: buzzAnswerTxt.trim() });
  };

  // ── Loading / error states ────────────────────────────────────────────────
  if (!code || !playerId) return null;

  if (error) return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <XCircle size={48} className="text-red-400" />
      <p className="text-white font-bold text-xl">{error}</p>
      <a href="/tournament" className="text-indigo-400 text-sm hover:text-white transition">← Back to Bible Bowl</a>
    </div>
  );

  if (!room) return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
      <Loader2 size={36} className="text-indigo-400 animate-spin" />
    </div>
  );

  const me       = room.players[playerId];
  const curMatch: BracketMatch | undefined = room.bracket.find((m) => m.id === room.currentMatchId);
  const inMatch  = curMatch?.player1Id === playerId || curMatch?.player2Id === playerId;
  const opponent = inMatch && curMatch
    ? room.players[curMatch.player1Id === playerId ? (curMatch.player2Id ?? "") : (curMatch.player1Id ?? "")]
    : null;

  const isBuzzed    = room.buzzedPlayerId === playerId;
  const otherBuzzed = !!room.buzzedPlayerId && room.buzzedPlayerId !== playerId;

  const totalRounds = getTotalRounds(Object.keys(room.players).length);

  // ── LOBBY ─────────────────────────────────────────────────────────────────
  if (room.phase === "lobby") {
    const players = Object.values(room.players);
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 flex flex-col px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">✝️🏆</div>
          <h1 className="text-3xl font-extrabold text-white">Bible Bowl</h1>
          <p className="text-indigo-300 text-sm mt-1">Room <span className="text-amber-300 font-bold tracking-widest">{code}</span></p>
        </div>

        {/* My card */}
        {me && (
          <div className="bg-amber-500/20 border-2 border-amber-400 rounded-2xl p-4 text-center mb-6">
            <div className="text-5xl mb-2">{me.avatarEmoji}</div>
            <p className="text-xl font-extrabold text-white">{me.name}</p>
            <p className="text-amber-300 text-sm font-semibold mt-1">You're in! ✓</p>
          </div>
        )}

        {/* Other players */}
        <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3 text-center">
          {players.length} player{players.length !== 1 ? "s" : ""} joined
        </p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {players.filter((p) => p.id !== playerId).map((p) => (
            <div key={p.id} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
              <div className="text-3xl mb-1">{p.avatarEmoji}</div>
              <p className="text-xs font-semibold text-white truncate">{p.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto text-center">
          <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm animate-pulse">
            <Loader2 size={16} className="animate-spin" />
            Waiting for host to start…
          </div>
        </div>
      </div>
    );
  }

  // ── SEEDING (bracket just revealed, before first match) ─────────────────
  if (room.phase === "seeding") {
    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col px-4 py-6">
        <PlayerHeader me={me} code={code} />

        <div className="mt-6">
          <h2 className="text-lg font-bold text-white mb-4 text-center">Tournament Bracket</h2>
          <div className="bg-white/5 rounded-2xl p-3">
            <MiniBracket room={room} myId={playerId} />
          </div>
        </div>

        {me && !me.eliminated && (
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm animate-pulse">
              <Loader2 size={16} className="animate-spin" />
              Waiting for next match…
            </div>
          </div>
        )}
        {me?.eliminated && <EliminatedBanner name={me.name} />}
      </div>
    );
  }

  // ── MATCHUP INTRO ─────────────────────────────────────────────────────────
  if (room.phase === "matchup" && curMatch) {
    const p1 = curMatch.player1Id ? room.players[curMatch.player1Id] : null;
    const p2 = curMatch.player2Id ? room.players[curMatch.player2Id] : null;

    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col px-4 py-6">
        <PlayerHeader me={me} code={code} />

        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
            {getRoundName(curMatch.round, totalRounds)}
          </p>

          {inMatch ? (
            <>
              <div className="bg-amber-500/20 border-2 border-amber-400 rounded-2xl px-6 py-5 w-full">
                <p className="text-amber-300 text-sm font-bold uppercase tracking-wider mb-3">You're up!</p>
                <div className="flex items-center justify-center gap-6">
                  <div>
                    <div className="text-4xl mb-1">{me?.avatarEmoji}</div>
                    <p className="text-white font-bold text-sm">{me?.name}</p>
                    <p className="text-indigo-400 text-xs">{me?.wins} win{me?.wins !== 1 ? "s" : ""}</p>
                  </div>
                  <span className="text-indigo-500 font-extrabold text-2xl">VS</span>
                  <div>
                    <div className="text-4xl mb-1">{opponent?.avatarEmoji}</div>
                    <p className="text-white font-bold text-sm">{opponent?.name}</p>
                    <p className="text-indigo-400 text-xs">{opponent?.wins} win{opponent?.wins !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>
              <p className="text-indigo-300 text-sm">
                {curMatch.questions.length} questions · {curMatch.questions.map((q) => q.type === "mc" ? "📋" : q.type === "buzz" ? "⚡" : "📖").join(" ")}
              </p>
              <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm animate-pulse">
                <Loader2 size={16} className="animate-spin" />
                Waiting for host to reveal question…
              </div>
            </>
          ) : (
            <>
              <p className="text-indigo-300 text-base">👀 Spectating</p>
              <div className="flex items-center gap-6 text-center">
                <div>
                  <div className="text-4xl mb-1">{p1?.avatarEmoji}</div>
                  <p className="text-white font-semibold text-sm">{p1?.name}</p>
                </div>
                <span className="text-indigo-500 font-extrabold text-2xl">VS</span>
                <div>
                  <div className="text-4xl mb-1">{p2?.avatarEmoji}</div>
                  <p className="text-white font-semibold text-sm">{p2?.name}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── QUESTION ACTIVE ────────────────────────────────────────────────────────
  if ((room.phase === "question" || room.phase === "buzzed") && room.currentQuestion) {
    const q = room.currentQuestion;

    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col px-4 py-4">
        <PlayerHeader me={me} code={code} compact />

        {/* Type + timer bar */}
        <div className="flex items-center gap-3 mt-4 mb-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            q.type === "buzz"  ? "bg-yellow-500/30 text-yellow-300" :
            q.type === "verse" ? "bg-purple-500/30 text-purple-300" :
            "bg-blue-500/30 text-blue-300"
          }`}>
            {q.type === "buzz" ? "⚡ BUZZ-IN" : q.type === "verse" ? "📖 VERSE" : "📋 MULTIPLE CHOICE"}
          </span>
          <span className="text-xs text-indigo-400 ml-auto">
            Q{room.currentQuestionIndex + 1} of {curMatch?.questions.length ?? "?"}
          </span>
        </div>

        {room.questionStartedAt && (
          <CountdownBar startedAt={room.questionStartedAt} limitSec={q.timeLimitSec} />
        )}

        {/* Question text */}
        <div className="bg-white/10 rounded-2xl p-5 mt-4">
          <p className="text-lg font-bold leading-snug text-white text-center">{q.text}</p>
          {q.verseRef && (
            <p className="text-center text-indigo-300 text-sm mt-2">— {q.verseRef}</p>
          )}
        </div>

        {/* ── BUZZ type ── */}
        {q.type === "buzz" && inMatch && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-6">
            {!room.buzzedPlayerId && (
              /* Giant buzz button */
              <button
                onClick={buzzIn}
                disabled={acting}
                className={`w-64 h-64 rounded-full font-extrabold text-3xl flex flex-col items-center justify-center gap-3
                  shadow-2xl transition-all active:scale-95 select-none
                  ${buzzAnim
                    ? "bg-yellow-300 text-black scale-105"
                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                  }`}
              >
                <Zap size={56} />
                BUZZ IN!
              </button>
            )}

            {isBuzzed && !submitted && (
              /* Player buzzed — answer input */
              <div className="w-full space-y-3">
                <p className="text-yellow-300 font-bold text-center text-lg">⚡ You buzzed in! Answer now:</p>
                <input
                  autoFocus
                  value={buzzAnswerTxt}
                  onChange={(e) => setBuzzAnswerTxt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitBuzzAnswer()}
                  placeholder="Type your answer…"
                  className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-4 text-lg focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={submitBuzzAnswer}
                  disabled={acting || !buzzAnswerTxt.trim()}
                  className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-extrabold py-4 text-lg transition"
                >
                  {acting ? <Loader2 size={20} className="animate-spin mx-auto" /> : "Submit Answer"}
                </button>
              </div>
            )}

            {isBuzzed && submitted && (
              <div className="text-center">
                <CheckCircle2 size={48} className="text-amber-400 mx-auto mb-2" />
                <p className="text-white font-bold">Answer submitted!</p>
                <p className="text-indigo-400 text-sm">Waiting for host…</p>
              </div>
            )}

            {otherBuzzed && (
              <div className="text-center bg-white/5 rounded-2xl p-6 w-full">
                <p className="text-yellow-300 font-bold text-lg">
                  ⚡ {room.players[room.buzzedPlayerId!]?.name} buzzed in!
                </p>
                <p className="text-indigo-400 text-sm mt-1">Waiting for their answer…</p>
              </div>
            )}
          </div>
        )}

        {/* Buzz type, spectating */}
        {q.type === "buzz" && !inMatch && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 mt-6">
            <div className="text-5xl mb-1">👀</div>
            <p className="text-indigo-300 font-semibold">Spectating buzz round</p>
            {room.buzzedPlayerId ? (
              <p className="text-yellow-300 font-bold">⚡ {room.players[room.buzzedPlayerId]?.name} buzzed in!</p>
            ) : (
              <p className="text-indigo-500 text-sm animate-pulse">Waiting for buzz-in…</p>
            )}
          </div>
        )}

        {/* ── MC / Verse type ── */}
        {(q.type === "mc" || q.type === "verse") && inMatch && q.options && (
          <div className="flex flex-col gap-3 mt-5">
            {q.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected = selectedMC === opt;
              return (
                <button
                  key={i}
                  onClick={() => !submitted && submitMC(opt)}
                  disabled={submitted || acting}
                  className={`w-full rounded-xl px-5 py-4 text-left font-semibold text-base transition active:scale-[.98]
                    ${isSelected
                      ? "bg-amber-500 text-black border-2 border-amber-400"
                      : submitted
                        ? "bg-white/5 text-white/40 border border-white/10 cursor-default"
                        : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                    }`}
                >
                  <span className={`font-extrabold mr-3 ${isSelected ? "text-black" : "text-indigo-400"}`}>{letter}.</span>
                  {opt}
                </button>
              );
            })}
            {submitted && (
              <p className="text-center text-amber-400 text-sm font-semibold mt-1">
                <CheckCircle2 size={14} className="inline mr-1" />
                Answer locked in — waiting for host…
              </p>
            )}
          </div>
        )}

        {/* MC / Verse, spectating */}
        {(q.type === "mc" || q.type === "verse") && !inMatch && q.options && (
          <div className="flex flex-col gap-2 mt-4 opacity-60">
            {q.options.map((opt, i) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-sm text-white/60">
                <span className="text-indigo-500 mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>{opt}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── ANSWER REVEALED ────────────────────────────────────────────────────────
  if (room.phase === "revealed" && room.currentQuestion) {
    const q      = room.currentQuestion;
    const match  = curMatch;
    const p1     = match?.player1Id ? room.players[match.player1Id] : null;
    const p2     = match?.player2Id ? room.players[match.player2Id] : null;
    const myScore = match?.matchScore[playerId] ?? 0;
    const oppScore = opponent ? match?.matchScore[opponent.id] ?? 0 : 0;

    // Determine if I got this question right
    const myLastAns = match?.answers[playerId]?.at(-1);
    const iGotIt    = myLastAns?.correct;

    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col px-4 py-4">
        <PlayerHeader me={me} code={code} compact />

        {/* Result feedback (only if in match) */}
        {inMatch && (
          <div className={`rounded-2xl p-4 text-center mt-5 border-2
            ${iGotIt ? "bg-green-500/20 border-green-400" : "bg-white/5 border-white/10"}`}>
            {iGotIt
              ? <p className="text-green-300 font-extrabold text-xl">✅ Got it!</p>
              : <p className="text-indigo-400 font-bold text-lg">Not this time</p>
            }
          </div>
        )}

        {/* Correct answer */}
        <div className="bg-green-500/20 border border-green-400 rounded-2xl px-5 py-4 text-center mt-4">
          <p className="text-xs text-green-300 font-bold uppercase mb-1">Correct Answer</p>
          <p className="text-2xl font-extrabold text-green-300">{q.answer}</p>
          {q.reference && (
            <p className="text-green-400/70 text-sm mt-1">— {q.reference}</p>
          )}
        </div>

        {/* Match score */}
        {inMatch && p1 && p2 && (
          <div className="flex items-center justify-center gap-8 text-center mt-5">
            <div>
              <p className="text-3xl font-extrabold text-amber-300">{match?.matchScore[p1.id] ?? 0}</p>
              <p className="text-xs text-white/50 mt-0.5">{p1.name}</p>
            </div>
            <div className="text-white/20 text-lg">—</div>
            <div>
              <p className="text-3xl font-extrabold text-amber-300">{match?.matchScore[p2.id] ?? 0}</p>
              <p className="text-xs text-white/50 mt-0.5">{p2.name}</p>
            </div>
          </div>
        )}

        {inMatch && (
          <p className="text-center text-indigo-400 text-sm mt-4 animate-pulse">
            Waiting for host to continue…
          </p>
        )}

        {!inMatch && (
          <p className="text-center text-indigo-500 text-sm mt-4 animate-pulse">👀 Spectating…</p>
        )}
      </div>
    );
  }

  // ── ADVANCING (between matches) ───────────────────────────────────────────
  if (room.phase === "advancing") {
    // Did the current/last match involve this player?
    const lastMatch = room.bracket.find((m) => m.status === "complete" &&
      (m.player1Id === playerId || m.player2Id === playerId));
    const iWon = lastMatch?.winnerId === playerId;
    const iLost = lastMatch?.loserId === playerId;

    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col px-4 py-6">
        <PlayerHeader me={me} code={code} />

        {iWon && (
          <div className="bg-amber-500/20 border-2 border-amber-400 rounded-2xl p-5 text-center mt-6">
            <div className="text-5xl mb-2">🎉</div>
            <p className="text-2xl font-extrabold text-amber-300">You advanced!</p>
            <p className="text-amber-200/70 text-sm mt-1">Great job — get ready for the next round</p>
          </div>
        )}

        {iLost && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center mt-6">
            <div className="text-5xl mb-2">😔</div>
            <p className="text-xl font-bold text-white/80">Better luck next time</p>
            <p className="text-indigo-400 text-sm mt-1">You're out — but keep watching!</p>
          </div>
        )}

        {!iWon && !iLost && (
          <div className="text-center mt-8">
            <p className="text-indigo-300">Bracket updating…</p>
          </div>
        )}

        <div className="mt-8">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 text-center">Bracket</p>
          <div className="bg-white/5 rounded-2xl p-3">
            <MiniBracket room={room} myId={playerId} />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-indigo-400 text-sm animate-pulse">
          <Loader2 size={16} className="animate-spin" />
          Waiting for host…
        </div>
      </div>
    );
  }

  // ── COMPLETE ──────────────────────────────────────────────────────────────
  if (room.phase === "complete") {
    const players  = Object.values(room.players).sort((a, b) => b.score - a.score);
    const champion = players.find((p) => !p.eliminated);
    const isChamp  = champion?.id === playerId;
    const myAwards = room.awards.filter((a) => a.playerId === playerId);

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col px-4 py-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-3xl font-extrabold text-white">Tournament Over!</h1>
        </div>

        {/* Champion highlight */}
        {champion && (
          <div className={`rounded-2xl p-5 text-center mb-5 border-2
            ${isChamp ? "bg-amber-500/30 border-amber-400" : "bg-white/10 border-white/20"}`}>
            <div className="text-5xl mb-2">{champion.avatarEmoji}</div>
            <p className="text-2xl font-extrabold text-amber-300">{champion.name}</p>
            <p className="text-amber-200/70 text-sm">🏆 Champion of Champions</p>
            {isChamp && <p className="text-amber-300 font-bold mt-2">That's you! 🎉</p>}
          </div>
        )}

        {/* My awards */}
        {myAwards.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 text-center">Your Awards</p>
            <div className="grid grid-cols-2 gap-3">
              {myAwards.map((a, i) => (
                <div key={i} className="bg-amber-500/20 border border-amber-400/60 rounded-xl p-3 text-center">
                  <div className="text-3xl mb-1">{a.emoji}</div>
                  <p className="text-xs font-bold text-amber-300">{a.title}</p>
                  <p className="text-xs text-indigo-300/70 mt-0.5">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All awards */}
        {room.awards.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 text-center">All Awards</p>
            <div className="grid grid-cols-2 gap-2">
              {room.awards.map((a, i) => (
                <div key={i} className={`rounded-xl p-2.5 text-center border
                  ${a.playerId === playerId ? "bg-amber-500/20 border-amber-400/60" : "bg-white/5 border-white/10"}`}>
                  <div className="text-2xl mb-0.5">{a.emoji}</div>
                  <p className="text-[11px] font-bold text-amber-300 leading-tight">{a.title}</p>
                  <p className="text-[11px] text-indigo-300/70">{room.players[a.playerId]?.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final standings */}
        <div className="mb-6">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 text-center">Final Standings</p>
          <div className="bg-white/5 rounded-2xl overflow-hidden">
            {players.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 px-4 py-3
                ${p.id === playerId ? "bg-amber-500/10" : ""}
                ${i < players.length - 1 ? "border-b border-white/5" : ""}`}>
                <span className="text-sm font-bold text-white/40 w-5 text-center">{i + 1}</span>
                <span className="text-xl">{p.avatarEmoji}</span>
                <span className="font-semibold text-sm flex-1 text-white truncate">{p.name}</span>
                <span className="text-xs font-bold text-amber-400">{p.score} pts</span>
                {i === 0 && <Trophy size={14} className="text-amber-400 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/tournament"
            className="block w-full text-center rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-4 transition"
          >
            Play Again
          </a>
          <a
            href="/"
            className="block w-full text-center rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white font-semibold py-3 transition"
          >
            Exit Game
          </a>
        </div>
      </div>
    );
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
      <Loader2 size={32} className="text-indigo-400 animate-spin" />
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

function PlayerHeader({
  me, code, compact = false,
}: {
  me: ReturnType<typeof Object.values<import("@/lib/tournamentTypes").Player>>[number] | undefined;
  code: string;
  compact?: boolean;
}) {
  if (!me) return null;
  return (
    <div className={`flex items-center gap-3 ${compact ? "py-1" : "py-2"}`}>
      <div className="text-2xl">{me.avatarEmoji}</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm truncate">{me.name}</p>
        <p className="text-indigo-400 text-xs">Room {code}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-amber-400 font-extrabold text-sm">{me.score} pts</p>
        <p className="text-indigo-500 text-xs">{me.wins} win{me.wins !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
}

function EliminatedBanner({ name }: { name: string }) {
  return (
    <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
      <div className="text-4xl mb-2">😔</div>
      <p className="text-white font-bold">{name}, you've been eliminated</p>
      <p className="text-indigo-400 text-sm mt-1">Keep watching — cheer your favorites on!</p>
    </div>
  );
}
