"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Users, Zap, BookOpen, ArrowRight, Loader2, ChevronDown, ChevronUp, BarChart2, LogIn } from "lucide-react";
import { TOURNAMENT_CATEGORIES } from "@/lib/tournamentTypes";
import { useAuth } from "@/lib/authClient";
import AuthModal from "@/components/AuthModal";
import Link from "next/link";

const ALL_CATEGORY_IDS = TOURNAMENT_CATEGORIES.map((c) => c.id);

export default function TournamentLanding() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const [mode,           setMode]           = useState<"home" | "host" | "join">("home");
  const [hostName,       setHostName]       = useState("");
  const [joinCode,       setJoinCode]       = useState("");
  const [joinName,       setJoinName]       = useState("");
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState("");
  const [showAdvanced,   setShowAdvanced]   = useState(false);
  const [selectedCats,   setSelectedCats]   = useState<string[]>([...ALL_CATEGORY_IDS]);

  const toggleCategory = (id: string) => {
    setSelectedCats((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((c) => c !== id) : prev  // keep at least 1
        : [...prev, id]
    );
  };

  const allSelected  = selectedCats.length === ALL_CATEGORY_IDS.length;
  const toggleAll    = () => setSelectedCats(allSelected ? [ALL_CATEGORY_IDS[0]] : [...ALL_CATEGORY_IDS]);

  // ── Host: create room ────────────────────────────────────────────────────
  const createGame = async () => {
    if (!hostName.trim()) { setError("Enter your name"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostName:   hostName.trim(),
          categories: selectedCats,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create game");
      router.push(`/tournament/host/${data.code}?hostId=${data.hostId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  };

  // ── Player: join room ────────────────────────────────────────────────────
  const joinGame = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code || code.length !== 4) { setError("Enter a valid 4-letter code"); return; }
    if (!joinName.trim()) { setError("Enter your name"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/tournament/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, action: "join", payload: { name: joinName.trim(), accessToken: user?.access_token } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to join game");
      router.push(`/tournament/play/${code}?playerId=${data.playerId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center justify-center px-4 py-12">

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}

      {/* ── Auth bar ── */}
      <div className="fixed top-0 right-0 left-0 flex items-center justify-end gap-3 px-4 py-3 bg-black/20 backdrop-blur z-40">
        <Link href="/leaderboard" className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-amber-300 font-semibold transition">
          <BarChart2 size={14} /> Leaderboard
        </Link>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-indigo-300">Signed in</span>
            <button onClick={() => logout()} className="text-xs text-white/40 hover:text-white transition">Sign out</button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-black font-bold px-3 py-1.5 rounded-lg transition"
          >
            <LogIn size={13} /> Sign In
          </button>
        )}
      </div>

      {/* ── Logo ── */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-3">✝️🏆</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Bible Bowl
        </h1>
        <p className="mt-2 text-indigo-300 text-base sm:text-lg max-w-md mx-auto">
          Tournament-style Bible trivia for youth groups. Join from your phone. Compete for the crown.
        </p>

        {/* Feature chips */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {[
            { icon: <Trophy size={13} />,   label: "Bracket Tournament"    },
            { icon: <Zap size={13} />,      label: "Lightning Buzz-in"     },
            { icon: <BookOpen size={13} />, label: "Verse Completion"      },
            { icon: <Users size={13} />,    label: "Up to 16 Players"      },
          ].map((f) => (
            <span key={f.label} className="flex items-center gap-1.5 bg-white/10 text-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-full">
              {f.icon} {f.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="w-full max-w-md">

        {mode === "home" && (
          <div className="grid gap-4">
            <button
              type="button"
              onClick={() => { setMode("host"); setError(""); }}
              className="group rounded-2xl bg-amber-500 hover:bg-amber-400 text-white p-6 text-left transition active:scale-[.98] shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-extrabold">Host a Game</p>
                  <p className="text-amber-100 text-sm mt-1">Create a room · share the code · run the tournament</p>
                </div>
                <Trophy size={32} className="opacity-80 group-hover:scale-110 transition-transform" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setMode("join"); setError(""); }}
              className="group rounded-2xl bg-white/10 hover:bg-white/20 text-white p-6 text-left transition active:scale-[.98] border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-extrabold">Join a Game</p>
                  <p className="text-indigo-300 text-sm mt-1">Enter the 4-letter room code to play</p>
                </div>
                <Users size={32} className="opacity-70 group-hover:scale-110 transition-transform" />
              </div>
            </button>

            <a href="/" className="text-center text-sm text-indigo-400 hover:text-indigo-200 transition mt-2">
              ← Back to Scripture Lives
            </a>
          </div>
        )}

        {mode === "host" && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <button onClick={() => setMode("home")} className="text-indigo-400 text-sm mb-4 hover:text-white transition">← Back</button>
            <h2 className="text-xl font-bold text-white mb-1">Host a Tournament</h2>
            <p className="text-indigo-300 text-sm mb-5">Your students will join with a room code</p>

            <div className="space-y-4">
              {/* Host name */}
              <div>
                <label className="block text-xs font-semibold text-indigo-300 mb-1">Your Name</label>
                <input
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && createGame()}
                  placeholder="Pastor Mike, Coach Sarah…"
                  maxLength={30}
                  className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Advanced settings toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-200 text-xs font-semibold transition w-full"
              >
                {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showAdvanced ? "Hide" : "Show"} category settings
                <span className="ml-auto text-indigo-600 text-[10px]">
                  {selectedCats.length}/{ALL_CATEGORY_IDS.length} selected
                </span>
              </button>

              {/* Category picker */}
              {showAdvanced && (
                <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Question Categories</p>
                    <button
                      type="button"
                      onClick={toggleAll}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-bold transition"
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {TOURNAMENT_CATEGORIES.map((cat) => {
                      const on = selectedCats.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition border text-sm
                            ${on
                              ? "bg-amber-500/20 border-amber-400/60 text-white"
                              : "bg-white/5 border-white/10 text-white/40"
                            }`}
                        >
                          <span className="text-lg leading-none">{cat.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs leading-snug">{cat.label}</p>
                            <p className="text-[10px] text-indigo-400/80 leading-snug">{cat.desc}</p>
                          </div>
                          <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center
                            ${on ? "bg-amber-500 border-amber-400" : "border-white/20"}`}>
                            {on && <span className="text-[8px] text-black font-bold">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Difficulty progression info */}
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest mb-1.5">Difficulty Progression</p>
                    <div className="flex gap-1 text-[10px]">
                      {[
                        { label: "Round 1", color: "bg-green-500", desc: "Easy" },
                        { label: "Round 2", color: "bg-yellow-500", desc: "Mixed" },
                        { label: "Semis",   color: "bg-orange-500", desc: "Med/Hard" },
                        { label: "Finals",  color: "bg-red-500",    desc: "Hard" },
                      ].map((r) => (
                        <div key={r.label} className="flex-1 text-center">
                          <div className={`${r.color} rounded-full h-1.5 w-full mb-1`} />
                          <p className="text-indigo-300 font-semibold">{r.label}</p>
                          <p className="text-indigo-500">{r.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="button"
                onClick={createGame}
                disabled={loading}
                className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-bold py-3 flex items-center justify-center gap-2 transition"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Trophy size={18} /> Create Game Room</>}
              </button>
            </div>
          </div>
        )}

        {mode === "join" && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
            <button onClick={() => setMode("home")} className="text-indigo-400 text-sm mb-4 hover:text-white transition">← Back</button>
            <h2 className="text-xl font-bold text-white mb-1">Join a Game</h2>
            <p className="text-indigo-300 text-sm mb-5">Get the room code from your youth pastor</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-indigo-300 mb-1">Room Code</label>
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
                  placeholder="JOHN"
                  maxLength={4}
                  className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-2xl font-bold tracking-widest text-center focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-300 mb-1">Your Name</label>
                <input
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && joinGame()}
                  placeholder="Enter your name"
                  maxLength={20}
                  className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="button"
                onClick={joinGame}
                disabled={loading}
                className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold py-3 flex items-center justify-center gap-2 transition"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={18} /> Join Game</>}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-8 text-indigo-500 text-xs text-center">
        Scripture Lives · Bible Bowl · Free for youth groups
      </p>
    </div>
  );
}
