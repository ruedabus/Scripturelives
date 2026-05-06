"use client";

/**
 * StreakBadge — shows a 🔥 flame with the current streak count.
 * Clicking expands a panel with:
 *   • Current + best streak
 *   • Total days read
 *   • 30-day calendar heatmap
 *   • Motivational message on milestones
 *
 * Also renders a toast notification when the streak advances.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  loadStreak,
  recordRead,
  getMilestoneMessage,
  isStreakAtRisk,
  todayString,
  type StreakData,
} from "@/lib/streak";

// ── Toast ─────────────────────────────────────────────────────────────────────

type ToastProps = {
  streak: number;
  milestone: string | null;
  onDone: () => void;
};

function StreakToast({ streak, milestone, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in"
      style={{
        animation: "slideDown 0.4s ease, fadeOut 0.5s ease 3.3s forwards",
      }}
    >
      <div
        className="rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl"
        style={{ background: "linear-gradient(135deg,#b45309,#92400e)", border: "1px solid rgba(251,191,36,0.4)" }}
      >
        <span className="text-2xl select-none">🔥</span>
        <div>
          <p className="text-amber-100 font-bold text-sm leading-tight">
            {streak}-day streak!
          </p>
          {milestone && (
            <p className="text-amber-200 text-xs mt-0.5 max-w-[220px] leading-snug">{milestone}</p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px) scale(0.9); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)      scale(1);   }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── 30-day calendar grid ──────────────────────────────────────────────────────

function CalendarGrid({ readDates }: { readDates: string[] }) {
  const readSet = new Set(readDates);
  const today   = todayString();

  // Build last 35 days (5 weeks × 7) so we always show complete weeks
  const days: { date: string; inMonth: boolean }[] = [];
  for (let i = 34; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({ date: str, inMonth: true });
  }

  const labels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div>
      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {labels.map((l, i) => (
          <div key={i} className="text-center text-[9px] font-bold text-stone-500 uppercase">{l}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Offset so first day aligns to correct weekday */}
        {(() => {
          const firstDay = new Date(days[0].date).getDay(); // 0=Sun
          const blanks   = Array.from({ length: firstDay });
          return (
            <>
              {blanks.map((_, i) => <div key={`blank-${i}`} />)}
              {days.map(({ date }) => {
                const read    = readSet.has(date);
                const isToday = date === today;
                return (
                  <div
                    key={date}
                    title={date}
                    className={`rounded-md aspect-square flex items-center justify-center text-[10px] font-semibold transition
                      ${isToday
                        ? read
                          ? "bg-amber-500 text-stone-900 ring-2 ring-amber-300 ring-offset-1 ring-offset-stone-800"
                          : "bg-stone-700 text-amber-400 ring-2 ring-amber-500 ring-offset-1 ring-offset-stone-800"
                        : read
                          ? "bg-amber-600 text-stone-900"
                          : "bg-stone-700/60 text-stone-600"
                      }`}
                  >
                    {new Date(date + "T00:00:00").getDate()}
                  </div>
                );
              })}
            </>
          );
        })()}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = {
  /** Call this from outside to trigger a read for the day */
  triggerRead?: boolean;
};

export default function StreakBadge({ triggerRead }: Props) {
  const [data,      setData]      = useState<StreakData | null>(null);
  const [open,      setOpen]      = useState(false);
  const [toast,     setToast]     = useState<{ streak: number; milestone: string | null } | null>(null);
  const panelRef                  = useRef<HTMLDivElement>(null);
  const buttonRef                 = useRef<HTMLButtonElement>(null);

  // Load on mount (client-only)
  useEffect(() => {
    setData(loadStreak());
  }, []);

  // Record today's read whenever triggerRead flips to true
  const lastTriggerRef = useRef(false);
  useEffect(() => {
    if (!triggerRead || triggerRead === lastTriggerRef.current) return;
    lastTriggerRef.current = triggerRead;

    const { data: updated, isNewDay } = recordRead();
    setData(updated);

    if (isNewDay) {
      const milestone = getMilestoneMessage(updated.currentStreak);
      setToast({ streak: updated.currentStreak, milestone });
    }
  }, [triggerRead]);

  // Close panel when clicking outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const dismissToast = useCallback(() => setToast(null), []);

  if (!data) return null; // SSR guard

  const atRisk = isStreakAtRisk(data);
  const hasStreak = data.currentStreak > 0;

  return (
    <>
      {/* Toast */}
      {toast && (
        <StreakToast streak={toast.streak} milestone={toast.milestone} onDone={dismissToast} />
      )}

      {/* Badge button */}
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          title={hasStreak ? `${data.currentStreak}-day streak — click for details` : "Start your reading streak today!"}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold transition select-none
            ${open
              ? "bg-amber-500 text-stone-900"
              : atRisk && hasStreak
                ? "bg-orange-900/80 text-orange-300 hover:bg-orange-800 ring-1 ring-orange-500 animate-pulse"
                : hasStreak
                  ? "bg-stone-700 hover:bg-stone-600 text-amber-400"
                  : "bg-stone-700 hover:bg-stone-600 text-stone-400"
            }`}
        >
          <span className="text-base leading-none">{hasStreak ? "🔥" : "✦"}</span>
          <span className={`text-xs leading-none ${open ? "text-stone-900" : hasStreak ? "text-amber-400" : "text-stone-400"}`}>
            {hasStreak ? data.currentStreak : "0"}
          </span>
        </button>

        {/* Expanded panel */}
        {open && (
          <div
            ref={panelRef}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden shadow-2xl z-40"
            style={{ background: "#1c1917", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-stone-700">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-white font-bold text-base leading-tight">
                    {data.currentStreak > 0 ? `${data.currentStreak}-Day Streak` : "No streak yet"}
                  </p>
                  <p className="text-stone-400 text-xs mt-0.5">Daily reading streak</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-stone-500 hover:text-white text-sm transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-stone-700 border-b border-stone-700">
              {[
                { label: "Current",  value: data.currentStreak, icon: "🔥" },
                { label: "Best",     value: data.bestStreak,    icon: "🏆" },
                { label: "Total",    value: data.totalDaysRead,  icon: "📖" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex flex-col items-center py-3 px-2">
                  <span className="text-lg mb-0.5">{icon}</span>
                  <span className="text-amber-400 font-bold text-lg leading-none">{value}</span>
                  <span className="text-stone-500 text-[10px] mt-0.5 uppercase tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="px-4 pt-3 pb-3">
              <p className="text-stone-400 text-[10px] font-semibold uppercase tracking-widest mb-2">Last 35 Days</p>
              <CalendarGrid readDates={data.readDates} />
            </div>

            {/* At-risk nudge */}
            {atRisk && data.currentStreak > 0 && (
              <div className="mx-4 mb-3 rounded-xl px-3 py-2.5 flex items-center gap-2"
                style={{ background: "rgba(234,88,12,0.15)", border: "1px solid rgba(234,88,12,0.3)" }}>
                <span className="text-lg shrink-0">⚠️</span>
                <p className="text-orange-300 text-xs leading-snug">
                  Read today to keep your {data.currentStreak}-day streak alive!
                </p>
              </div>
            )}

            {/* No streak yet — encouragement */}
            {data.currentStreak === 0 && (
              <div className="mx-4 mb-3 rounded-xl px-3 py-2.5"
                style={{ background: "rgba(161,107,38,0.12)", border: "1px solid rgba(217,119,6,0.25)" }}>
                <p className="text-amber-400 text-xs leading-snug text-center">
                  📖 Start reading today to begin your streak!
                </p>
              </div>
            )}

            {/* Best streak badge */}
            {data.bestStreak >= 7 && (
              <div className="px-4 pb-4">
                <div className="rounded-xl px-3 py-2 text-center"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <p className="text-amber-500 text-[11px] font-semibold">
                    🏆 Personal best: {data.bestStreak} days
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
