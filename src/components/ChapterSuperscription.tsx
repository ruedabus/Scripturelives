"use client";

/**
 * ChapterSuperscription
 * Shows:
 *  1. Biblical superscription (KJV Psalm headings — 114 chapters)
 *  2. AI-generated chapter summary (all 1,189 canonical chapters, pre-generated)
 */

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

type Props = {
  book:    string;
  chapter: number;
  version: string;
};

export default function ChapterSuperscription({ book, chapter, version }: Props) {
  const [superscription, setSuperscription] = useState<string | null>(null);
  const [summary,        setSummary]        = useState<string | null>(null);

  // Biblical superscription — KJV only
  useEffect(() => {
    setSuperscription(null);
    if (version !== "KJV") return;
    let cancelled = false;
    fetch(`/api/superscription?book=${encodeURIComponent(book)}&chapter=${chapter}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setSuperscription(d.superscription ?? null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [book, chapter, version]);

  // AI chapter summary — all versions
  useEffect(() => {
    setSummary(null);
    let cancelled = false;
    fetch(`/api/chapter-summary?book=${encodeURIComponent(book)}&chapter=${chapter}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setSummary(d.summary ?? null); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [book, chapter]);

  if (!superscription && !summary) return null;

  return (
    <div className="mb-5 space-y-2">

      {/* Biblical superscription (Psalm headings) */}
      {superscription && (
        <div
          className="px-4 py-2.5 rounded-xl italic text-center font-serif leading-relaxed"
          style={{
            background: "rgba(180,140,60,0.08)",
            borderLeft: "3px solid #d97706",
            color:      "#78350f",
            fontSize:   "0.85em",
          }}
        >
          {superscription}
        </div>
      )}

      {/* AI chapter summary */}
      {summary && (
        <div
          className="rounded-xl px-4 py-3"
          style={{
            background:   "rgba(26,38,64,0.05)",
            border:       "1px solid rgba(26,38,64,0.12)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <BookOpen size={11} style={{ color: "#6b7280" }} />
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "#9ca3af" }}
            >
              Chapter Overview
            </span>
          </div>
          <p
            className="text-sm leading-relaxed font-serif"
            style={{ color: "#44403c" }}
          >
            {summary}
          </p>
        </div>
      )}

    </div>
  );
}
