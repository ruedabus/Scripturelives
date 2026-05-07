"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Users, Zap, BookOpen, Loader2, ChevronDown, ChevronUp, BarChart2, LogIn, ArrowRight } from "lucide-react";
import { TOURNAMENT_CATEGORIES } from "@/lib/tournamentTypes";
import { useAuth } from "@/lib/authClient";
import AuthModal from "@/components/AuthModal";
import Link from "next/link";

const GOLD  = "#C9952A";
const NAVY  = "#1a2640";

const ALL_CATEGORY_IDS = TOURNAMENT_CATEGORIES.map((c) => c.id);

export default function TournamentLanding() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const [mode,         setMode]         = useState<"home" | "host" | "join">("home");
  const [hostName,     setHostName]     = useState("");
  const [joinCode,     setJoinCode]     = useState("");
  const [joinName,     setJoinName]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([...ALL_CATEGORY_IDS]);

  const toggleCategory = (id: string) =>
    setSelectedCats((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((c) => c !== id) : prev) : [...prev, id]
    );

  const allSelected = selectedCats.length === ALL_CATEGORY_IDS.length;
  const toggleAll   = () => setSelectedCats(allSelected ? [ALL_CATEGORY_IDS[0]] : [...ALL_CATEGORY_IDS]);

  const createGame = async () => {
    if (!hostName.trim()) { setError("Enter your name"); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName: hostName.trim(), categories: selectedCats }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create game");
      router.push(`/tournament/host/${data.code}?hostId=${data.hostId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  };

  const joinGame = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code || code.length !== 4) { setError("Enter a valid 4-letter code"); return; }
    if (!joinName.trim())           { setError("Enter your name"); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/tournament/action", {
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
    <div className="min-h-screen flex flex-col" style={{ background: "#faf8f3" }}>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}

      {/* ── Top nav ── */}
      <header className="sticky top-0 z-40 bg-white flex items-center justify-between px-5 h-14" style={{ borderBottom: "1px solid #ede8de" }}>
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-bold text-base" style={{ color: GOLD }}>+</span>
          <span className="font-bold text-sm" style={{ color: NAVY }}>Scripture Lives</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/churches" className="text-xs font-semibold transition hover:opacity-70" style={{ color: "#6b7280" }}>⛪ Churches</Link>
          <Link href="/leaderboard" className="hidden sm:flex items-center gap-1 text-xs font-semibold transition hover:opacity-70" style={{ color: "#6b7280" }}>
            <BarChart2 size={13} /> Leaderboard
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile/me" className="text-xs font-semibold transition hover:opacity-70" style={{ color: GOLD }}>👤 My Profile</Link>
              <button onClick={() => logout()} className="text-xs transition hover:opacity-70" style={{ color: "#9ca3af" }}>Sign out</button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition hover:brightness-110 text-white"
              style={{ background: GOLD }}>
              <LogIn size={12} /> Sign In
            </button>
          )}
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ minHeight: "480px" }}>
        {/* Full-bleed Bible Bowl photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bible-bowl.png"
          alt="Bible Bowl competition"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: "center 25%" }}
        />
        {/* Gradient overlays: dark top for readability + fade to cream at bottom */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,38,64,0.72) 0%, rgba(26,38,64,0.45) 55%, #faf8f3 100%)" }} />

        <div className="relative z-10 px-4 pt-14 pb-24 text-center max-w-xl mx-auto">
          {/* Gold accent rule */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background: GOLD }} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>Scripture Lives presents</span>
            <div className="h-px w-10" style={{ background: GOLD }} />
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-white mb-1 leading-none" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            Bible Bowl
          </h1>
          <p className="text-sm font-black uppercase tracking-[0.2em] mb-4" style={{ color: GOLD }}>
            Truth · Faith · Victory
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
            Tournament-style Bible trivia for youth groups.<br />Join from your phone. Compete for the crown.
          </p>

          {/* Feature chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              { icon: <Trophy size={12} />,   label: "Bracket Tournament" },
              { icon: <Zap size={12} />,      label: "Lightning Buzz-in"  },
              { icon: <BookOpen size={12} />, label: "Verse Completion"   },
              { icon: <Users size={12} />,    label: "Up to 16 Players"   },
            ].map((f) => (
              <span key={f.label}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}>
                {f.icon} {f.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 px-4 py-8 max-w-md mx-auto w-full -mt-4">

        {mode === "home" && (
          <div className="flex flex-col gap-3">

            {/* Host */}
            <button type="button" onClick={() => { setMode("host"); setError(""); }}
              className="group rounded-2xl p-6 text-left transition hover:-translate-y-0.5 hover:shadow-xl text-white"
              style={{ background: GOLD, boxShadow: `0 4px 20px rgba(201,149,42,0.35)` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-black">Host a Game</p>
                  <p className="text-sm mt-1 opacity-80">Create a room · share the code · run the tournament</p>
                </div>
                <Trophy size={32} className="opacity-80 group-hover:scale-110 transition-transform" />
              </div>
            </button>

            {/* Join */}
            <button type="button" onClick={() => { setMode("join"); setError(""); }}
              className="group rounded-2xl p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg bg-white"
              style={{ border: "1px solid #ede8de", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-black" style={{ color: NAVY }}>Join a Game</p>
                  <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Enter the 4-letter room code to play</p>
                </div>
                <Users size={32} style={{ color: NAVY }} className="opacity-50 group-hover:opacity-80 group-hover:scale-110 transition" />
              </div>
            </button>

            {/* Quick Match */}
            <button type="button" onClick={() => router.push("/matchmaking")}
              className="group rounded-2xl p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg bg-white"
              style={{ border: `1px solid rgba(201,149,42,0.3)`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-black flex items-center gap-2" style={{ color: NAVY }}>
                    ⚡ Quick Match
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ background: GOLD }}>NEW</span>
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#6b7280" }}>1v1 head-to-head against players worldwide</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>Requires sign-in · ELO rated</p>
                </div>
                <span className="text-3xl group-hover:scale-110 transition-transform">🌍</span>
              </div>
            </button>

            {/* Solo Practice */}
            <button type="button" onClick={() => router.push("/solo")}
              className="group rounded-2xl p-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg bg-white"
              style={{ border: "1px solid #ede8de", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-black" style={{ color: NAVY }}>📖 Solo Practice</p>
                  <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Quiz yourself against the clock</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>No sign-in needed · 5, 10, or 20 questions</p>
                </div>
                <span className="text-3xl group-hover:scale-110 transition-transform">🏆</span>
              </div>
            </button>

            <Link href="/" className="text-center text-sm font-semibold mt-1 transition hover:opacity-70" style={{ color: GOLD }}>
              ← Back to Scripture Lives
            </Link>
          </div>
        )}

        {/* ── Host form ── */}
        {mode === "host" && (
          <div className="rounded-2xl bg-white p-7" style={{ border: "1px solid #ede8de", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <button onClick={() => setMode("home")} className="text-sm font-semibold mb-5 transition hover:opacity-70" style={{ color: GOLD }}>← Back</button>
            <h2 className="text-2xl font-black mb-1" style={{ color: NAVY }}>Host a Tournament</h2>
            <p className="text-sm mb-6" style={{ color: "#6b7280" }}>Your students will join with a room code</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>Your Name</label>
                <input value={hostName} onChange={(e) => setHostName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && createGame()}
                  placeholder="Pastor Mike, Coach Sarah…" maxLength={30}
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ border: "1px solid #ddd6c8", background: "#faf8f3", color: NAVY }} />
              </div>

              <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs font-semibold transition hover:opacity-70 w-full"
                style={{ color: "#6b7280" }}>
                {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showAdvanced ? "Hide" : "Show"} category settings
                <span className="ml-auto text-xs" style={{ color: "#9ca3af" }}>{selectedCats.length}/{ALL_CATEGORY_IDS.length} selected</span>
              </button>

              {showAdvanced && (
                <div className="rounded-xl p-4 space-y-3" style={{ background: "#faf8f3", border: "1px solid #ede8de" }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Question Categories</p>
                    <button type="button" onClick={toggleAll} className="text-[10px] font-bold transition hover:opacity-70" style={{ color: GOLD }}>
                      {allSelected ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {TOURNAMENT_CATEGORIES.map((cat) => {
                      const on = selectedCats.includes(cat.id);
                      return (
                        <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition"
                          style={{
                            background: on ? "rgba(201,149,42,0.08)" : "white",
                            border: on ? `1px solid rgba(201,149,42,0.4)` : "1px solid #ede8de",
                          }}>
                          <span className="text-lg leading-none">{cat.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs leading-snug" style={{ color: on ? NAVY : "#6b7280" }}>{cat.label}</p>
                            <p className="text-[10px] leading-snug" style={{ color: "#9ca3af" }}>{cat.desc}</p>
                          </div>
                          <div className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition"
                            style={{ background: on ? GOLD : "white", borderColor: on ? GOLD : "#ddd6c8" }}>
                            {on && <span className="text-[8px] text-white font-black">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="pt-3" style={{ borderTop: "1px solid #ede8de" }}>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "#9ca3af" }}>Difficulty Progression</p>
                    <div className="flex gap-1 text-[10px]">
                      {[
                        { label: "Round 1", color: "#22c55e", desc: "Easy"     },
                        { label: "Round 2", color: "#eab308", desc: "Mixed"    },
                        { label: "Semis",   color: "#f97316", desc: "Med/Hard" },
                        { label: "Finals",  color: "#ef4444", desc: "Hard"     },
                      ].map((r) => (
                        <div key={r.label} className="flex-1 text-center">
                          <div className="rounded-full h-1.5 w-full mb-1" style={{ background: r.color }} />
                          <p className="font-bold" style={{ color: NAVY }}>{r.label}</p>
                          <p style={{ color: "#9ca3af" }}>{r.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

              <button type="button" onClick={createGame} disabled={loading}
                className="w-full rounded-xl font-black py-3.5 flex items-center justify-center gap-2 transition hover:brightness-110 disabled:opacity-50 text-white"
                style={{ background: GOLD }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Trophy size={18} /> Create Game Room</>}
              </button>
            </div>
          </div>
        )}

        {/* ── Join form ── */}
        {mode === "join" && (
          <div className="rounded-2xl bg-white p-7" style={{ border: "1px solid #ede8de", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <button onClick={() => setMode("home")} className="text-sm font-semibold mb-5 transition hover:opacity-70" style={{ color: GOLD }}>← Back</button>
            <h2 className="text-2xl font-black mb-1" style={{ color: NAVY }}>Join a Game</h2>
            <p className="text-sm mb-6" style={{ color: "#6b7280" }}>Get the room code from your youth pastor</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>Room Code</label>
                <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
                  placeholder="JOHN" maxLength={4}
                  className="w-full rounded-xl px-4 py-3 text-3xl font-black tracking-[0.3em] text-center focus:outline-none focus:ring-2"
                  style={{ border: "1px solid #ddd6c8", background: "#faf8f3", color: NAVY }} />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>Your Name</label>
                <input value={joinName} onChange={(e) => setJoinName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && joinGame()}
                  placeholder="Enter your name" maxLength={20}
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ border: "1px solid #ddd6c8", background: "#faf8f3", color: NAVY }} />
              </div>

              {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

              <button type="button" onClick={joinGame} disabled={loading}
                className="w-full rounded-xl font-black py-3.5 flex items-center justify-center gap-2 transition hover:brightness-110 disabled:opacity-50 text-white"
                style={{ background: NAVY }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={18} /> Join Game</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-xs" style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}>
        Scripture Lives · Bible Bowl · Free for youth groups
      </footer>
    </div>
  );
}
