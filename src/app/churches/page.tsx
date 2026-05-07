"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { ChurchStat } from "@/lib/auth";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD = "#C9952A";
const NAVY = "#1a2640";

const MEDALS = ["🥇", "🥈", "🥉"];

// ── Church card ───────────────────────────────────────────────────────────────
function ChurchCard({ stat, rank }: { stat: ChurchStat; rank: number }) {
  const isTop = rank < 3;
  const href  = `/churches/${encodeURIComponent(stat.church_name)}`;
  const loc   = [stat.church_city, stat.country].filter(Boolean).join(", ");

  return (
    <Link
      href={href}
      className="group rounded-2xl p-5 flex flex-col gap-4 transition hover:-translate-y-0.5"
      style={{
        background: isTop ? "rgba(201,149,42,0.06)" : "white",
        border: isTop ? "1px solid rgba(201,149,42,0.30)" : "1px solid #ede8de",
        boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{
            background: isTop ? "rgba(201,149,42,0.12)" : "#faf8f3",
            border: isTop ? "1px solid rgba(201,149,42,0.25)" : "1px solid #ede8de",
          }}
        >
          {isTop ? MEDALS[rank] : "⛪"}
        </div>

        <div className="min-w-0 flex-1">
          <h2
            className="font-bold text-base truncate leading-tight transition group-hover:opacity-70"
            style={{ color: NAVY }}
          >
            {stat.church_name}
          </h2>
          {loc && (
            <p className="text-xs mt-0.5 truncate" style={{ color: "#6b7280" }}>
              📍 {loc}
            </p>
          )}
        </div>

        <span
          className="text-xs font-black shrink-0"
          style={{ color: isTop ? GOLD : "#d1c9b8" }}
        >
          #{rank + 1}
        </span>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-4 gap-2 text-center pt-3"
        style={{ borderTop: "1px solid #f0ece3" }}
      >
        {[
          { label: "Members", value: stat.player_count },
          { label: "Wins",    value: stat.total_wins },
          { label: "Points",  value: stat.total_points.toLocaleString() },
          { label: "Avg ELO", value: stat.avg_elo },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="font-black text-sm leading-tight" style={{ color: NAVY }}>{value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: "#9ca3af" }}>
              {label}
            </p>
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
    return q
      ? churches.filter(
          (c) =>
            c.church_name.toLowerCase().includes(q) ||
            (c.church_city ?? "").toLowerCase().includes(q) ||
            (c.country ?? "").toLowerCase().includes(q)
        )
      : churches;
  }, [churches, query]);

  const totalPlayers = churches.reduce((s, c) => s + c.player_count, 0);

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
        <span className="text-sm font-bold" style={{ color: NAVY }}>Church Groups</span>
      </nav>

      {/* ── Hero ── */}
      <header
        className="relative overflow-hidden text-center"
        style={{ background: NAVY, borderBottom: "1px solid #ede8de" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bible-hero.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.08 }}
        />
        <div className="relative z-10 px-5 py-14 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background: GOLD }} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>Scripture Lives</span>
            <div className="h-px w-10" style={{ background: GOLD }} />
          </div>
          <div className="text-5xl mb-3">⛪</div>
          <h1 className="text-4xl font-black text-white leading-tight mb-3">
            Church <span style={{ color: GOLD }}>Groups</span>
          </h1>
          <p className="text-sm max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            See how churches rank in Bible Bowl. Join your church to represent them on the leaderboard.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* ── Search ── */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: "#9ca3af" }}>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by church name or city…"
            className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none"
            style={{
              background: "white",
              border: "1px solid #ede8de",
              color: NAVY,
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          />
        </div>

        {/* ── Summary bar ── */}
        {!loading && (
          <div className="flex items-center justify-between text-xs px-1" style={{ color: "#9ca3af" }}>
            <span>{churches.length} church{churches.length !== 1 ? "es" : ""} registered</span>
            <span>{totalPlayers.toLocaleString()} total players</span>
          </div>
        )}

        {/* ── List ── */}
        {loading ? (
          <div className="text-center py-16">
            <div
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mx-auto"
              style={{ borderColor: `${GOLD} transparent ${GOLD} ${GOLD}` }}
            />
            <p className="text-sm mt-4" style={{ color: "#9ca3af" }}>Loading churches…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: "white", border: "1px solid #ede8de" }}
          >
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              No churches match &ldquo;{query}&rdquo;
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((c) => (
              <ChurchCard key={c.church_name} stat={c} rank={churches.indexOf(c)} />
            ))}
          </div>
        )}

        {/* ── CTA — don't see your church? ── */}
        <div
          className="rounded-2xl px-6 py-6 text-center"
          style={{ background: NAVY }}
        >
          <p className="font-black text-base text-white mb-2">Don&apos;t see your church?</p>
          <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
            Add your church name in your profile — your wins will count toward your church&apos;s ranking automatically.
          </p>
          <Link
            href="/profile/setup"
            className="inline-block rounded-xl px-6 py-2.5 text-sm font-black transition hover:opacity-90"
            style={{ background: GOLD, color: "white" }}
          >
            Set Up Profile →
          </Link>
        </div>

        {/* ── Bottom nav links ── */}
        <div className="flex gap-4 flex-wrap justify-center pb-4 text-sm">
          <Link
            href="/leaderboard"
            className="font-semibold transition hover:opacity-70"
            style={{ color: GOLD }}
          >
            🏅 Player Leaderboard
          </Link>
          <span style={{ color: "#ddd6c8" }}>·</span>
          <Link
            href="/tournament"
            className="font-semibold transition hover:opacity-70"
            style={{ color: GOLD }}
          >
            🎮 Tournament
          </Link>
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
