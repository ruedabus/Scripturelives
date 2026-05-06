"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { ChurchStat } from "@/lib/auth";

// ── Medal for top 3 ───────────────────────────────────────────────────────────
const MEDALS = ["🥇", "🥈", "🥉"];

// ── Church card ───────────────────────────────────────────────────────────────
function ChurchCard({ stat, rank }: { stat: ChurchStat; rank: number }) {
  const medal  = MEDALS[rank] ?? null;
  const href   = `/churches/${encodeURIComponent(stat.church_name)}`;
  const loc    = [stat.church_city, stat.country].filter(Boolean).join(", ");

  return (
    <Link
      href={href}
      className="group rounded-2xl p-5 flex flex-col gap-3 transition hover:scale-[1.01] hover:border-indigo-500/50"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)" }}
        >
          {medal ?? "⛪"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {rank < 3 && <span className="text-base">{medal}</span>}
            <h2 className="text-white font-bold text-base truncate group-hover:text-amber-400 transition leading-tight">
              {stat.church_name}
            </h2>
          </div>
          {loc && <p className="text-stone-500 text-xs mt-0.5 truncate">📍 {loc}</p>}
        </div>
        <span className="text-stone-600 text-xs shrink-0">#{rank + 1}</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Members",  value: stat.player_count },
          { label: "Wins",     value: stat.total_wins },
          { label: "Points",   value: stat.total_points.toLocaleString() },
          { label: "Avg ELO",  value: stat.avg_elo },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-white font-bold text-sm leading-tight">{value}</p>
            <p className="text-stone-600 text-[10px] uppercase tracking-wide mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ChurchesPage() {
  const [churches, setChurches] = useState<ChurchStat[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [query,    setQuery]    = useState("");

  useEffect(() => {
    fetch("/api/churches?limit=200")
      .then((r) => r.json())
      .then((d) => setChurches(d.churches ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? churches.filter((c) => c.church_name.toLowerCase().includes(q) || (c.church_city ?? "").toLowerCase().includes(q) || (c.country ?? "").toLowerCase().includes(q)) : churches;
  }, [churches, query]);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#0f0e17 0%,#12102a 100%)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-3">⛪</div>
          <h1 className="text-white font-extrabold text-3xl tracking-tight">Church Groups</h1>
          <p className="text-indigo-300 text-sm mt-2 max-w-sm mx-auto">
            See how churches rank in Bible Bowl. Join your church to represent them on the leaderboard.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm pointer-events-none">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by church name or city…"
            className="w-full pl-9 pr-4 py-3 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* Summary bar */}
        {!loading && (
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>{churches.length} church{churches.length !== 1 ? "es" : ""} registered</span>
            <span>{churches.reduce((s, c) => s + c.player_count, 0).toLocaleString()} total players</span>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-16 text-indigo-400 animate-pulse">Loading churches…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-stone-400 text-sm">No churches match &ldquo;{query}&rdquo;</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((c, i) => (
              <ChurchCard key={c.church_name} stat={c} rank={churches.indexOf(c)} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          className="rounded-2xl px-6 py-5 text-center"
          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}
        >
          <p className="text-white font-bold text-base mb-1">Don&apos;t see your church?</p>
          <p className="text-indigo-300 text-sm mb-4">
            Add your church name in your profile — your wins will count toward your church&apos;s ranking automatically.
          </p>
          <Link
            href="/profile/setup"
            className="inline-block rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-5 py-2.5 transition"
          >
            Set Up Profile →
          </Link>
        </div>

        {/* Nav */}
        <div className="flex gap-3 flex-wrap justify-center pb-4 text-sm">
          <Link href="/leaderboard" className="text-indigo-400 hover:text-indigo-300 transition">🏅 Player Leaderboard</Link>
          <span className="text-stone-700">·</span>
          <Link href="/tournament"  className="text-indigo-400 hover:text-indigo-300 transition">🎮 Tournament</Link>
        </div>

      </div>
    </div>
  );
}
