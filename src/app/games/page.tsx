"use client";

import Link from "next/link";
import { useState } from "react";
import BibleWordle from "@/components/BibleWordle";
import BibleWordSearch from "@/components/BibleWordSearch";
import BiblePuzzle from "@/components/BiblePuzzle";

const GOLD  = "#C9952A";
const NAVY  = "#1a2640";
const CREAM = "#faf8f3";

type Tab = "wordle" | "wordsearch" | "puzzle";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "wordle",     label: "Bible Wordle",  emoji: "✝️" },
  { id: "wordsearch", label: "Word Search",   emoji: "🔠" },
  { id: "puzzle",     label: "Mav & Moony Puzzle", emoji: "🧩" },
];

export default function GamesPage() {
  const [tab, setTab] = useState<Tab>("wordle");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: CREAM }}>

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
        {/* Placeholder for future game */}
        <span
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap opacity-40 cursor-not-allowed select-none"
          style={{ background: "#e8e0d4", color: NAVY }}
        >
          📖 Bible Trivia — Coming soon
        </span>
      </div>

      {/* ── Game content ─────────────────────────────────────────────────────── */}
      <main className="flex-1">
        {tab === "wordle"     && <BibleWordle />}
        {tab === "wordsearch" && <BibleWordSearch />}
        {tab === "puzzle" && <BiblePuzzle />}
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
