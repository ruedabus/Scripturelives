"use client";

import Link from "next/link";
import { useState } from "react";
import BibleWordle from "@/components/BibleWordle";
import BibleWordSearch from "@/components/BibleWordSearch";

const GOLD  = "#C9952A";
const NAVY  = "#1a2640";
const CREAM = "#faf8f3";

type Tab = "wordle" | "wordsearch";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "wordle",     label: "Bible Wordle",  emoji: "✝️" },
  { id: "wordsearch", label: "Word Search",   emoji: "🔠" },
];

export default function GamesPage() {
  const [tab, setTab] = useState<Tab>("wordle");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: CREAM }}>

      {/* ── Language bar ── */}
      <div
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold"
        style={{ background: "#1a2640", borderBottom: "1px solid rgba(201,149,42,0.3)" }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🌐 Language:</span>
        <span
          className="px-3 py-1 rounded-full text-xs font-black"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
        >
          🇺🇸 English
        </span>
        <Link
          href="/es/gospel"
          className="px-3 py-1 rounded-full text-xs font-black transition hover:opacity-80"
          style={{ background: "#C9952A", color: "#1a2640" }}
        >
          🇪🇸 Español
        </Link>
      </div>

      {/* ── Top nav bar ──────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: "rgba(250,248,243,0.92)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #ede8de",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold transition hover:opacity-70"
          style={{ color: NAVY }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Bible Reader
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-base">🎮</span>
          <span className="text-sm font-black" style={{ color: NAVY }}>Bible Games</span>
        </div>

        <div style={{ width: 120 }} /> {/* spacer to center title */}
      </header>

      {/* ── Game tabs ─────────────────────────────────────────────────────────── */}
      <div
        className="sticky top-[53px] z-20 flex items-center gap-1 px-4 py-2 overflow-x-auto shrink-0"
        style={{ background: CREAM, borderBottom: "1px solid #ede8de" }}
      >
        {TABS.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black transition whitespace-nowrap"
            style={
              tab === id
                ? { background: NAVY, color: "#fff" }
                : { background: "#e8e0d4", color: NAVY, opacity: 0.65 }
            }
          >
            {emoji} {label}
          </button>
        ))}
        <Link
          href="/tournament"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition hover:opacity-80"
          style={{ background: NAVY, color: "white" }}
        >
          🏆 Bible Bowl
        </Link>
      </div>

      {/* ── Game content ─────────────────────────────────────────────────────── */}
      <main className="flex-1">
        {tab === "wordle"     && <BibleWordle />}
        {tab === "wordsearch" && <BibleWordSearch />}
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        className="text-center text-xs py-4 shrink-0"
        style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}
      >
        Scripture Lives · Bible Games · New puzzles every day at midnight
      </footer>
    </div>
  );
}
