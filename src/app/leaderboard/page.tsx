"use client";

import { useState, useEffect } from "react";
import { Trophy, ChevronRight } from "lucide-react";
import type { UserProfile } from "@/lib/auth";
import Link from "next/link";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD  = "#C9952A";
const NAVY  = "#1a2640";

type ChurchEntry = {
  church_name:  string;
  church_city:  string | null;
  country:      string | null;
  total_wins:   number;
  total_points: number;
  player_count: number;
};

const FLAG: Record<string, string> = {
  US:"🇺🇸",GB:"🇬🇧",CA:"🇨🇦",AU:"🇦🇺",NZ:"🇳🇿",ZA:"🇿🇦",NG:"🇳🇬",KE:"🇰🇪",
  GH:"🇬🇭",BR:"🇧🇷",MX:"🇲🇽",PH:"🇵🇭",IN:"🇮🇳",KR:"🇰🇷",OTHER:"🌍",
};

const MEDAL = ["🥇","🥈","🥉"];

export default function LeaderboardPage() {
  const [tab,      setTab]      = useState<"global" | "church">("global");
  const [players,  setPlayers]  = useState<UserProfile[]>([]);
  const [churches, setChurches] = useState<ChurchEntry[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [offset,   setOffset]   = useState(0);
  const LIMIT = 50;

  useEffect(() => {
    setLoading(true);
    const url = tab === "global"
      ? `/api/leaderboard?type=global&limit=${LIMIT}&offset=${offset}`
      : `/api/leaderboard?type=church&limit=50`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (tab === "global") setPlayers(data as UserProfile[]);
        else setChurches(data as ChurchEntry[]);
      })
      .finally(() => setLoading(false));
  }, [tab, offset]);

  const rankLabel = (i: number) => {
    const abs = offset + i;
    return abs < 3 ? MEDAL[abs] : `#${abs + 1}`;
  };

  return (
    <div className="min-h-screen" style={{ background: "#faf8f3" }}>

      {/* ── Sticky nav ── */}
      <nav
        className="sticky top-0 z-20 bg-white px-5 py-3 flex items-center gap-3"
        style={{ borderBottom: "1px solid #ede8de" }}
      >
        <Link href="/" className="text-sm font-semibold transition hover:opacity-70" style={{ color: GOLD }}>
          ← Back
        </Link>
        <span style={{ color: "#ddd6c8" }}>|</span>
        <span className="text-sm font-bold" style={{ color: NAVY }}>Bible Bowl Rankings</span>
      </nav>

      {/* ── Hero ── */}
      <header
        className="relative overflow-hidden text-center"
        style={{ background: NAVY, borderBottom: "1px solid #ede8de" }}
      >
        {/* Background texture */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bible-hero.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.08 }}
        />
        <div className="relative z-10 px-5 py-16 max-w-2xl mx-auto">
          {/* Gold rule + label */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background: GOLD }} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>Scripture Lives</span>
            <div className="h-px w-10" style={{ background: GOLD }} />
          </div>

          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-3">
            Bible Bowl <span style={{ color: GOLD }}>Rankings</span>
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            Youth groups competing worldwide · Updated live
          </p>

          {/* Tab switcher */}
          <div
            className="mt-8 inline-flex rounded-xl p-1 gap-1"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            {([["global","🌍 Global Players"],["church","⛪ Churches"]] as const).map(([t, label]) => (
              <button
                key={t}
                onClick={() => { setTab(t); setOffset(0); }}
                className="px-5 py-2 rounded-lg text-sm font-bold transition"
                style={
                  tab === t
                    ? { background: GOLD, color: "white" }
                    : { color: "rgba(255,255,255,0.55)" }
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-3xl mx-auto px-4 py-10 pb-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${GOLD} transparent ${GOLD} ${GOLD}` }}
            />
          </div>
        ) : tab === "global" ? (
          <>
            {players.length === 0 ? (
              <EmptyState type="players" />
            ) : (
              <div className="space-y-2">
                {players.map((p, i) => {
                  const isTop = offset + i < 3;
                  return (
                    <Link key={p.id} href={`/profile/${p.username}`}>
                      <div
                        className="flex items-center gap-4 rounded-2xl px-4 py-3.5 transition hover:-translate-y-0.5"
                        style={{
                          background: isTop ? "rgba(201,149,42,0.07)" : "white",
                          border: isTop ? `1px solid rgba(201,149,42,0.35)` : "1px solid #ede8de",
                          boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        {/* Rank */}
                        <div
                          className="w-10 text-center text-sm font-black shrink-0"
                          style={{ color: isTop ? GOLD : "#9ca3af" }}
                        >
                          {rankLabel(i)}
                        </div>

                        {/* Avatar */}
                        <div className="text-2xl shrink-0">{p.avatar_url ?? "✝️"}</div>

                        {/* Name + church */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate" style={{ color: NAVY }}>
                            {p.display_name}
                            <span className="text-xs font-normal ml-1.5" style={{ color: "#9ca3af" }}>
                              @{p.username}
                            </span>
                          </p>
                          {p.church_name && (
                            <p className="text-xs truncate" style={{ color: "#6b7280" }}>
                              {FLAG[p.country ?? ""] ?? "🌍"} {p.church_name}
                              {p.church_city ? `, ${p.church_city}` : ""}
                            </p>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-5 shrink-0 text-right">
                          <div className="hidden sm:block text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>ELO</p>
                            <p className="font-black text-sm" style={{ color: GOLD }}>{p.elo}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>W</p>
                            <p className="font-black text-sm" style={{ color: "#16a34a" }}>{p.games_won}</p>
                          </div>
                          <div className="hidden sm:block text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Played</p>
                            <p className="font-black text-sm" style={{ color: NAVY }}>{p.games_played}</p>
                          </div>
                          {p.win_streak >= 3 && (
                            <div className="text-sm font-bold" style={{ color: "#ea580c" }}>
                              🔥{p.win_streak}
                            </div>
                          )}
                        </div>

                        <ChevronRight size={16} style={{ color: "#d1c9b8" }} className="shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {players.length > 0 && (
              <div className="flex justify-center gap-3 mt-6">
                {offset > 0 && (
                  <button
                    onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                    className="rounded-xl px-5 py-2 text-sm font-semibold transition hover:opacity-80"
                    style={{ background: "white", border: "1px solid #ede8de", color: NAVY }}
                  >
                    ← Prev
                  </button>
                )}
                {players.length === LIMIT && (
                  <button
                    onClick={() => setOffset(offset + LIMIT)}
                    className="rounded-xl px-5 py-2 text-sm font-semibold transition hover:opacity-80"
                    style={{ background: GOLD, color: "white" }}
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          // ── Church leaderboard ──
          <>
            {churches.length === 0 ? (
              <EmptyState type="churches" />
            ) : (
              <div className="space-y-2">
                {churches.map((c, i) => {
                  const isTop = i < 3;
                  return (
                    <div
                      key={c.church_name}
                      className="flex items-center gap-4 rounded-2xl px-4 py-3.5"
                      style={{
                        background: isTop ? "rgba(201,149,42,0.07)" : "white",
                        border: isTop ? "1px solid rgba(201,149,42,0.35)" : "1px solid #ede8de",
                        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div
                        className="w-10 text-center text-sm font-black shrink-0"
                        style={{ color: isTop ? GOLD : "#9ca3af" }}
                      >
                        {i < 3 ? MEDAL[i] : `#${i + 1}`}
                      </div>
                      <div className="text-2xl shrink-0">{FLAG[c.country ?? ""] ?? "🌍"}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate" style={{ color: NAVY }}>{c.church_name}</p>
                        {c.church_city && (
                          <p className="text-xs" style={{ color: "#6b7280" }}>{c.church_city}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-5 shrink-0">
                        <div className="text-center">
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Wins</p>
                          <p className="font-black text-sm" style={{ color: "#16a34a" }}>{c.total_wins}</p>
                        </div>
                        <div className="hidden sm:block text-center">
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Points</p>
                          <p className="font-black text-sm" style={{ color: GOLD }}>{c.total_points.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Players</p>
                          <p className="font-black text-sm" style={{ color: NAVY }}>{c.player_count}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── CTA ── */}
        <div
          className="mt-10 rounded-2xl px-6 py-8 text-center"
          style={{ background: NAVY }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
            Ready to claim your spot?
          </p>
          <Link
            href="/tournament"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3 font-black text-sm transition hover:opacity-90"
            style={{ background: GOLD, color: "white" }}
          >
            <Trophy size={16} /> Play Bible Bowl
          </Link>
          <div className="mt-4">
            <Link
              href="/"
              className="text-xs font-semibold transition hover:opacity-70"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              ← Back to Scripture Lives
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="bg-white px-5 py-6 text-center"
        style={{ borderTop: "1px solid #ede8de" }}
      >
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          Rankings update after every match ·{" "}
          <span className="font-bold" style={{ color: GOLD }}>Scripture Lives</span>
        </p>
      </footer>
    </div>
  );
}

function EmptyState({ type }: { type: "players" | "churches" }) {
  return (
    <div
      className="text-center py-16 rounded-2xl"
      style={{ background: "white", border: "1px solid #ede8de" }}
    >
      <div className="text-5xl mb-4">{type === "players" ? "🏆" : "⛪"}</div>
      <p className="text-xl font-black mb-2" style={{ color: NAVY }}>No rankings yet</p>
      <p className="text-sm" style={{ color: "#6b7280" }}>
        {type === "players"
          ? "Be the first to sign up and play — your name goes here!"
          : "Create an account, add your church, and start competing!"}
      </p>
    </div>
  );
}
