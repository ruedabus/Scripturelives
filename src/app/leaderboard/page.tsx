"use client";

import { useState, useEffect } from "react";
import { Trophy, Church, Globe, Zap, Star, Users, ChevronRight } from "lucide-react";
import type { UserProfile } from "@/lib/auth";
import Link from "next/link";

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

export default function LeaderboardPage() {
  const [tab,     setTab]     = useState<"global" | "church">("global");
  const [players, setPlayers] = useState<UserProfile[]>([]);
  const [churches,setChurches]= useState<ChurchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset,  setOffset]  = useState(0);
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

  const rankMedal = (i: number) => {
    const abs = offset + i;
    if (abs === 0) return "🥇";
    if (abs === 1) return "🥈";
    if (abs === 2) return "🥉";
    return `#${abs + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 text-white">

      {/* Header */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-6 text-center">
        <div className="text-5xl mb-3">🏆</div>
        <h1 className="text-4xl font-extrabold text-amber-300 tracking-tight">Bible Bowl Rankings</h1>
        <p className="text-indigo-300 mt-2 text-sm">
          Youth groups competing worldwide · Updated live
        </p>

        {/* Tabs */}
        <div className="mt-6 inline-flex bg-white/10 rounded-xl p-1 gap-1">
          {([["global","🌍 Global Players"],["church","⛪ Churches"]] as const).map(([t, label]) => (
            <button
              key={t}
              onClick={() => { setTab(t); setOffset(0); }}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
                tab === t ? "bg-amber-500 text-black" : "text-indigo-300 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === "global" ? (
          <>
            {players.length === 0 ? (
              <EmptyState type="players" />
            ) : (
              <div className="space-y-2">
                {players.map((p, i) => (
                  <Link key={p.id} href={`/profile/${p.username}`}>
                    <div className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition cursor-pointer
                      ${offset + i < 3
                        ? "bg-amber-500/15 border border-amber-400/30 hover:bg-amber-500/25"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-10 text-center text-sm font-bold text-amber-300 shrink-0">
                        {rankMedal(i)}
                      </div>

                      {/* Avatar */}
                      <div className="text-2xl shrink-0">{p.avatar_url ?? "✝️"}</div>

                      {/* Name + church */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">
                          {p.display_name}
                          <span className="text-white/30 text-xs font-normal ml-1.5">@{p.username}</span>
                        </p>
                        {p.church_name && (
                          <p className="text-xs text-indigo-400 truncate">
                            {FLAG[p.country ?? ""] ?? "🌍"} {p.church_name}{p.church_city ? `, ${p.church_city}` : ""}
                          </p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-right shrink-0">
                        <div className="hidden sm:block text-center">
                          <p className="text-xs text-indigo-400">ELO</p>
                          <p className="font-bold text-amber-300">{p.elo}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-indigo-400">W</p>
                          <p className="font-bold text-green-400">{p.games_won}</p>
                        </div>
                        <div className="hidden sm:block text-center">
                          <p className="text-xs text-indigo-400">Played</p>
                          <p className="font-bold">{p.games_played}</p>
                        </div>
                        {p.win_streak >= 3 && (
                          <div className="text-orange-400 text-sm font-bold" title="Win streak">
                            🔥{p.win_streak}
                          </div>
                        )}
                      </div>

                      <ChevronRight size={16} className="text-white/20 shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {players.length > 0 && (
              <div className="flex justify-center gap-3 mt-6">
                {offset > 0 && (
                  <button
                    onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                    className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2 text-sm font-semibold transition"
                  >
                    ← Prev
                  </button>
                )}
                {players.length === LIMIT && (
                  <button
                    onClick={() => setOffset(offset + LIMIT)}
                    className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2 text-sm font-semibold transition"
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          // Church leaderboard
          <>
            {churches.length === 0 ? (
              <EmptyState type="churches" />
            ) : (
              <div className="space-y-2">
                {churches.map((c, i) => (
                  <div key={c.church_name} className={`flex items-center gap-4 rounded-xl px-4 py-3.5
                    ${i < 3
                      ? "bg-amber-500/15 border border-amber-400/30"
                      : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <div className="w-10 text-center text-sm font-bold text-amber-300 shrink-0">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
                    </div>
                    <div className="text-2xl shrink-0">{FLAG[c.country ?? ""] ?? "🌍"}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{c.church_name}</p>
                      {c.church_city && (
                        <p className="text-xs text-indigo-400">{c.church_city}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="text-xs text-indigo-400">Wins</p>
                        <p className="font-bold text-green-400">{c.total_wins}</p>
                      </div>
                      <div className="hidden sm:block text-center">
                        <p className="text-xs text-indigo-400">Points</p>
                        <p className="font-bold text-amber-300">{c.total_points.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-indigo-400">Players</p>
                        <p className="font-bold">{c.player_count}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-indigo-400 text-sm mb-3">Ready to claim your spot?</p>
          <Link
            href="/tournament"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-8 py-3 transition"
          >
            <Trophy size={18} /> Play Bible Bowl
          </Link>
          <span className="mx-3 text-white/20">·</span>
          <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-200 transition">
            ← Back to Scripture Lives
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ type }: { type: "players" | "churches" }) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">{type === "players" ? "🏆" : "⛪"}</div>
      <p className="text-xl font-bold text-white mb-2">No rankings yet</p>
      <p className="text-indigo-400 text-sm">
        {type === "players"
          ? "Be the first to sign up and play — your name goes here!"
          : "Create an account, add your church, and start competing!"}
      </p>
    </div>
  );
}
