"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authClient";
import type { UserProfile, EnrichedMatch } from "@/lib/auth";

// ── ELO rank tiers ────────────────────────────────────────────────────────────

type Rank = { label: string; color: string; bg: string; border: string; min: number };

const RANKS: Rank[] = [
  { label: "Unranked",  color: "#9ca3af", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.3)", min: 0    },
  { label: "Bronze",    color: "#cd7f32", bg: "rgba(205,127,50,0.12)",  border: "rgba(205,127,50,0.35)",  min: 800  },
  { label: "Silver",    color: "#c0c0c0", bg: "rgba(192,192,192,0.12)", border: "rgba(192,192,192,0.35)", min: 1000 },
  { label: "Gold",      color: "#ffd700", bg: "rgba(255,215,0,0.12)",   border: "rgba(255,215,0,0.35)",   min: 1200 },
  { label: "Platinum",  color: "#66d9e8", bg: "rgba(102,217,232,0.12)", border: "rgba(102,217,232,0.35)", min: 1500 },
  { label: "Diamond",   color: "#a78bfa", bg: "rgba(167,139,250,0.14)", border: "rgba(167,139,250,0.4)",  min: 1800 },
];

function getRank(elo: number): Rank {
  return [...RANKS].reverse().find((r) => elo >= r.min) ?? RANKS[0];
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl p-4 flex flex-col items-center text-center"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <span className="text-2xl mb-1">{icon}</span>
      <p className="text-white font-bold text-xl leading-tight">{value}</p>
      {sub && <p className="text-indigo-300 text-xs font-semibold mt-0.5">{sub}</p>}
      <p className="text-stone-500 text-[10px] uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

// ── Match row ─────────────────────────────────────────────────────────────────

function MatchRow({ match }: { match: EnrichedMatch }) {
  const date = new Date(match.played_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition hover:bg-white/5"
      style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
      {/* Result pill */}
      <span
        className="shrink-0 w-10 text-center rounded-lg py-1 text-xs font-bold"
        style={match.won
          ? { background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }
          : { background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}
      >
        {match.won ? "WIN" : "LOSS"}
      </span>

      {/* Avatar + name */}
      <span className="text-xl shrink-0">{match.opponent_avatar ?? "📖"}</span>
      <Link
        href={`/profile/${match.opponent_id}`}
        className="flex-1 text-stone-200 text-sm font-semibold hover:text-amber-400 transition truncate"
      >
        {match.opponent_name}
      </Link>

      {/* Score */}
      <span className="text-stone-400 text-sm font-mono shrink-0">
        <span className={match.won ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{match.my_score}</span>
        <span className="text-stone-600 mx-1">–</span>
        <span>{match.opponent_score}</span>
      </span>

      {/* Category */}
      {match.category && (
        <span className="shrink-0 hidden sm:inline text-[10px] text-indigo-400 bg-indigo-900/40 px-2 py-0.5 rounded-full border border-indigo-800 truncate max-w-[80px]">
          {match.category}
        </span>
      )}

      {/* Date */}
      <span className="shrink-0 text-stone-600 text-xs">{date}</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { username }         = useParams<{ username: string }>();
  const { user }             = useAuth();
  const router               = useRouter();

  const [profile,  setProfile]  = useState<UserProfile | null>(null);
  const [matches,  setMatches]  = useState<EnrichedMatch[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied,   setCopied]   = useState(false);

  const isOwnProfile = !!user && profile?.id === user.id;

  // ── Fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setNotFound(false);

    fetch(`/api/profile?username=${encodeURIComponent(username)}&matches=true`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setProfile(data.profile ?? data);
        setMatches(data.matches ?? []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  // ── Share ────────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${profile?.display_name} on Scripture Lives`, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0e17" }}>
        <div className="text-indigo-400 text-lg animate-pulse">Loading profile…</div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0f0e17" }}>
        <p className="text-5xl">🔍</p>
        <h1 className="text-white font-bold text-2xl">Profile not found</h1>
        <p className="text-stone-400 text-sm">@{username} doesn&apos;t exist yet.</p>
        <Link href="/tournament" className="mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 text-sm transition">
          Back to Tournament
        </Link>
      </div>
    );
  }

  const rank       = getRank(profile.elo ?? 0);
  const winRate    = profile.games_played > 0
    ? Math.round((profile.games_won / profile.games_played) * 100)
    : 0;
  const joinYear   = new Date(profile.created_at).getFullYear();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#0f0e17 0%,#12102a 100%)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Back nav */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-400 hover:text-white text-sm transition"
        >
          ← Back
        </button>

        {/* ── Hero card ──────────────────────────────────────────────────────── */}
        <div className="rounded-3xl overflow-hidden relative"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", border: "1px solid rgba(99,102,241,0.3)" }}>

          {/* Rank glow strip */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${rank.color}, transparent)` }} />

          <div className="px-6 pt-6 pb-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-lg"
                  style={{ background: "rgba(0,0,0,0.35)", border: `2px solid ${rank.color}40` }}
                >
                  {profile.avatar_url ?? "📖"}
                </div>
                <div>
                  <h1 className="text-white font-extrabold text-2xl leading-tight">{profile.display_name}</h1>
                  <p className="text-indigo-300 text-sm mt-0.5">@{profile.username}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Rank badge */}
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold"
                      style={{ background: rank.bg, border: `1px solid ${rank.border}`, color: rank.color }}
                    >
                      ⚔️ {rank.label}
                    </span>
                    {/* ELO */}
                    <span className="text-amber-400 font-bold text-sm">{profile.elo ?? 1000} ELO</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {isOwnProfile ? (
                  <Link
                    href="/profile/setup"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4 py-2 transition"
                  >
                    ✏️ Edit Profile
                  </Link>
                ) : (
                  <Link
                    href="/challenge/new"
                    className="rounded-xl font-bold text-sm px-4 py-2 transition"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", color: "white" }}
                  >
                    ⚡ Challenge
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  className={`rounded-xl font-semibold text-sm px-4 py-2 transition ${copied ? "bg-green-600 text-white" : "bg-white/10 hover:bg-white/15 text-stone-300"}`}
                >
                  {copied ? "✓ Copied!" : "🔗 Share"}
                </button>
              </div>
            </div>

            {/* Church / location */}
            {(profile.church_name || profile.church_city || profile.country) && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {profile.church_name && (
                  <span className="flex items-center gap-1.5 text-stone-300 text-xs bg-white/5 rounded-full px-3 py-1 border border-white/8">
                    ⛪ {profile.church_name}
                  </span>
                )}
                {(profile.church_city || profile.country) && (
                  <span className="flex items-center gap-1.5 text-stone-400 text-xs bg-white/5 rounded-full px-3 py-1 border border-white/8">
                    📍 {[profile.church_city, profile.country].filter(Boolean).join(", ")}
                  </span>
                )}
                <span className="text-stone-600 text-xs ml-auto">Member since {joinYear}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon="🎮" label="Games"     value={profile.games_played}  />
          <StatCard icon="🏆" label="Win Rate"  value={`${winRate}%`}         sub={`${profile.games_won}W · ${profile.games_played - profile.games_won}L`} />
          <StatCard icon="⭐" label="Points"    value={profile.total_points?.toLocaleString() ?? 0} />
          <StatCard icon="🔥" label="Best Streak" value={profile.best_streak ?? 0} sub={profile.win_streak > 0 ? `${profile.win_streak} active` : undefined} />
        </div>

        {/* ── ELO progress bar ───────────────────────────────────────────────── */}
        <div className="rounded-2xl px-5 py-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚔️</span>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{rank.label}</p>
                <p className="text-stone-500 text-[10px] uppercase tracking-widest">Current Rank</p>
              </div>
            </div>
            <span className="font-mono text-amber-400 font-bold">{profile.elo ?? 1000}</span>
          </div>

          {/* Progress to next rank */}
          {(() => {
            const elo  = profile.elo ?? 1000;
            const curr = getRank(elo);
            const nextRankIdx = RANKS.findIndex((r) => r.label === curr.label) + 1;
            const next = RANKS[nextRankIdx];
            if (!next) return (
              <div className="text-center text-amber-400 text-xs font-bold py-1">✨ Maximum Rank!</div>
            );
            const pct = Math.min(100, Math.round(((elo - curr.min) / (next.min - curr.min)) * 100));
            return (
              <div>
                <div className="flex justify-between text-[10px] text-stone-500 mb-1.5">
                  <span>{curr.label} ({curr.min})</span>
                  <span className="font-semibold" style={{ color: next.color }}>{next.label} ({next.min})</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${curr.color}, ${next.color})` }}
                  />
                </div>
                <p className="text-stone-500 text-[10px] text-right mt-1">{next.min - elo} ELO to {next.label}</p>
              </div>
            );
          })()}
        </div>

        {/* ── Match history ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-bold text-base">Recent Matches</h2>
            <span className="text-stone-500 text-xs">{matches.length} game{matches.length !== 1 ? "s" : ""}</span>
          </div>

          {matches.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-4xl mb-3">🎮</p>
              <p className="text-stone-400 text-sm">No matches played yet.</p>
              {isOwnProfile && (
                <Link href="/tournament"
                  className="mt-4 inline-block rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 transition">
                  Play Now
                </Link>
              )}
            </div>
          ) : (
            <div className="p-3 flex flex-col gap-1.5">
              {matches.map((m) => <MatchRow key={m.id} match={m} />)}
            </div>
          )}
        </div>

        {/* ── Quick links ────────────────────────────────────────────────────── */}
        <div className="flex gap-3 flex-wrap justify-center pb-4">
          <Link href="/leaderboard" className="text-indigo-400 hover:text-indigo-300 text-sm transition">
            🏅 Leaderboard
          </Link>
          <span className="text-stone-700">·</span>
          <Link href="/tournament" className="text-indigo-400 hover:text-indigo-300 text-sm transition">
            🎮 Tournament
          </Link>
          <span className="text-stone-700">·</span>
          <Link href="/matchmaking" className="text-indigo-400 hover:text-indigo-300 text-sm transition">
            ⚡ Quick Match
          </Link>
        </div>

      </div>
    </div>
  );
}
