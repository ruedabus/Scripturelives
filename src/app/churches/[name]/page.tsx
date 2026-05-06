"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { ChurchStat, UserProfile } from "@/lib/auth";

// ── ELO rank colour ───────────────────────────────────────────────────────────
function eloColor(elo: number): string {
  if (elo >= 1800) return "#a78bfa"; // Diamond
  if (elo >= 1500) return "#66d9e8"; // Platinum
  if (elo >= 1200) return "#ffd700"; // Gold
  if (elo >= 1000) return "#c0c0c0"; // Silver
  if (elo >= 800)  return "#cd7f32"; // Bronze
  return "#9ca3af";                  // Unranked
}

function eloLabel(elo: number): string {
  if (elo >= 1800) return "Diamond";
  if (elo >= 1500) return "Platinum";
  if (elo >= 1200) return "Gold";
  if (elo >= 1000) return "Silver";
  if (elo >= 800)  return "Bronze";
  return "Unranked";
}

// ── Member row ────────────────────────────────────────────────────────────────
function MemberRow({ member, rank }: { member: UserProfile; rank: number }) {
  const color = eloColor(member.elo ?? 0);
  const medals = ["🥇", "🥈", "🥉"];
  const winRate = member.games_played > 0
    ? Math.round((member.games_won / member.games_played) * 100)
    : 0;

  return (
    <Link
      href={`/profile/${member.username}`}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition hover:bg-white/5"
      style={{ border: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Rank */}
      <span className="w-6 text-center shrink-0 text-sm">
        {rank < 3 ? medals[rank] : <span className="text-stone-600 text-xs">#{rank + 1}</span>}
      </span>

      {/* Avatar */}
      <span className="text-2xl shrink-0">{member.avatar_url ?? "📖"}</span>

      {/* Name + username */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm truncate leading-tight">{member.display_name}</p>
        <p className="text-stone-500 text-xs truncate">@{member.username}</p>
      </div>

      {/* ELO badge */}
      <span
        className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
        style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}
      >
        {member.elo ?? 1000}
      </span>

      {/* Win rate */}
      <div className="shrink-0 text-right hidden sm:block">
        <p className="text-white text-xs font-semibold">{winRate}%</p>
        <p className="text-stone-600 text-[10px]">{member.games_played}G</p>
      </div>
    </Link>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center rounded-2xl px-4 py-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <span className="text-2xl mb-1">{icon}</span>
      <p className="text-white font-bold text-lg leading-tight">{value}</p>
      <p className="text-stone-500 text-[10px] uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ChurchDetailPage() {
  const { name }                    = useParams<{ name: string }>();
  const router                      = useRouter();
  const churchName                  = decodeURIComponent(name ?? "");

  const [stat,     setStat]     = useState<ChurchStat | null>(null);
  const [members,  setMembers]  = useState<UserProfile[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied,   setCopied]   = useState(false);

  useEffect(() => {
    if (!churchName) return;
    setLoading(true);
    fetch(`/api/churches/${encodeURIComponent(churchName)}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setStat(d.stat ?? null);
        setMembers(d.members ?? []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [churchName]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: `${churchName} on Scripture Lives`, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0e17" }}>
      <p className="text-indigo-400 animate-pulse">Loading…</p>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0f0e17" }}>
      <p className="text-5xl">⛪</p>
      <h1 className="text-white font-bold text-2xl">Church not found</h1>
      <Link href="/churches" className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 text-sm transition">
        Browse Churches
      </Link>
    </div>
  );

  const loc       = [stat?.church_city, stat?.country].filter(Boolean).join(", ");
  const topPlayer = members[0];
  const totalWins = stat?.total_wins   ?? members.reduce((s, m) => s + (m.games_won ?? 0), 0);
  const totalPts  = stat?.total_points ?? members.reduce((s, m) => s + (m.total_points ?? 0), 0);
  const avgElo    = members.length > 0 ? Math.round(members.reduce((s, m) => s + (m.elo ?? 1000), 0) / members.length) : 0;
  const topElo    = members[0]?.elo ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#0f0e17 0%,#12102a 100%)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Back */}
        <button type="button" onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-400 hover:text-white text-sm transition">
          ← Back
        </button>

        {/* Hero */}
        <div className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", border: "1px solid rgba(99,102,241,0.35)" }}>
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,transparent,#818cf8,transparent)" }} />
          <div className="px-6 pt-6 pb-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{ background: "rgba(0,0,0,0.3)", border: "2px solid rgba(99,102,241,0.4)" }}>
                  ⛪
                </div>
                <div>
                  <h1 className="text-white font-extrabold text-2xl leading-tight">{churchName}</h1>
                  {loc && <p className="text-indigo-300 text-sm mt-0.5">📍 {loc}</p>}
                  <p className="text-stone-400 text-xs mt-1">{members.length} member{members.length !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <Link
                  href={`/profile/setup`}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-4 py-2 transition"
                >
                  ✞ Join Church
                </Link>
                <button type="button" onClick={handleShare}
                  className={`rounded-xl font-semibold text-sm px-4 py-2 transition ${copied ? "bg-green-600 text-white" : "bg-white/10 hover:bg-white/15 text-stone-300"}`}>
                  {copied ? "✓ Copied!" : "🔗 Share"}
                </button>
              </div>
            </div>

            {/* Top player spotlight */}
            {topPlayer && (
              <Link href={`/profile/${topPlayer.username}`}
                className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/5"
                style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-2xl">{topPlayer.avatar_url ?? "📖"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-0.5">🏆 Top Player</p>
                  <p className="text-white font-bold text-sm truncate">{topPlayer.display_name}</p>
                </div>
                <span className="text-xs font-bold shrink-0" style={{ color: eloColor(topPlayer.elo ?? 0) }}>
                  {eloLabel(topPlayer.elo ?? 0)} · {topPlayer.elo ?? 1000}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatPill icon="👥" label="Members"   value={members.length} />
          <StatPill icon="🏆" label="Total Wins" value={totalWins} />
          <StatPill icon="⭐" label="Points"     value={totalPts.toLocaleString()} />
          <StatPill icon="⚔️" label="Avg ELO"   value={avgElo} />
        </div>

        {/* ELO distribution bar */}
        {members.length > 0 && (
          <div className="rounded-2xl px-5 py-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-stone-400 text-[10px] font-semibold uppercase tracking-widest mb-3">ELO Distribution</p>
            <div className="flex rounded-full overflow-hidden h-3 gap-px">
              {[
                { label: "Diamond",  min: 1800, color: "#a78bfa" },
                { label: "Platinum", min: 1500, color: "#66d9e8" },
                { label: "Gold",     min: 1200, color: "#ffd700" },
                { label: "Silver",   min: 1000, color: "#c0c0c0" },
                { label: "Bronze",   min: 800,  color: "#cd7f32" },
                { label: "Unranked", min: 0,    color: "#4b5563" },
              ].map(({ label, min, color }) => {
                const next = [1800, 1500, 1200, 1000, 800, 0];
                const count = members.filter((m) => (m.elo ?? 0) >= min).length - members.filter((m) => {
                  const idx = [1800,1500,1200,1000,800,0].indexOf(min);
                  return idx > 0 && (m.elo ?? 0) >= [1800,1500,1200,1000,800,0][idx - 1];
                }).length;
                const pct = members.length > 0 ? (count / members.length) * 100 : 0;
                if (pct === 0) return null;
                return (
                  <div key={label} title={`${label}: ${count}`} style={{ width: `${pct}%`, background: color }} />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {[
                { label: "Diamond",  min: 1800, color: "#a78bfa" },
                { label: "Platinum", min: 1500, color: "#66d9e8" },
                { label: "Gold",     min: 1200, color: "#ffd700" },
                { label: "Silver",   min: 1000, color: "#c0c0c0" },
                { label: "Bronze",   min: 800,  color: "#cd7f32" },
                { label: "Unranked", min: 0,    color: "#4b5563" },
              ].map(({ label, min, color }) => {
                const count = members.filter((m) => (m.elo ?? 0) >= min && (m.elo ?? 0) < (min === 1800 ? 99999 : [99999,1800,1500,1200,1000,800][["Diamond","Platinum","Gold","Silver","Bronze","Unranked"].indexOf(label)])).length;
                if (count === 0) return null;
                return (
                  <div key={label} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] text-stone-500">{label} {count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Member roster */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-bold text-base">Members</h2>
            <span className="text-stone-500 text-xs">{members.length} player{members.length !== 1 ? "s" : ""}</span>
          </div>

          {members.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-4xl mb-3">👥</p>
              <p className="text-stone-400 text-sm">No members yet. Be the first to join!</p>
            </div>
          ) : (
            <div className="p-3 flex flex-col gap-1.5">
              {members.map((m, i) => <MemberRow key={m.id} member={m} rank={i} />)}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex gap-3 flex-wrap justify-center pb-4 text-sm">
          <Link href="/churches"    className="text-indigo-400 hover:text-indigo-300 transition">⛪ All Churches</Link>
          <span className="text-stone-700">·</span>
          <Link href="/leaderboard" className="text-indigo-400 hover:text-indigo-300 transition">🏅 Leaderboard</Link>
          <span className="text-stone-700">·</span>
          <Link href="/tournament"  className="text-indigo-400 hover:text-indigo-300 transition">🎮 Tournament</Link>
        </div>

      </div>
    </div>
  );
}
