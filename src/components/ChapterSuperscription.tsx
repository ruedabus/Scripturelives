"use client";

/**
 * ChapterSuperscription
 * Displays the biblical superscription (header) for a chapter when one exists.
 * Fetches from /api/superscription. Currently covers 114 Psalms in KJV.
 */

import { useEffect, useState } from "react";

type Props = {
  book:    string;
  chapter: number;
  version: string; // only shown for KJV (local version with the data)
};

export default function ChapterSuperscription({ book, chapter, version }: Props) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    // Only KJV has superscription data
    if (version !== "KJV") { setText(null); return; }

    setText(null);
    let cancelled = false;

    fetch(`/api/superscription?book=${encodeURIComponent(book)}&chapter=${chapter}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setText(d.superscription ?? null); })
      .catch(() => { /* silently skip */ });

    return () => { cancelled = true; };
  }, [book, chapter, version]);

  if (!text) return null;

  return (
    <div
      className="mb-5 px-4 py-3 rounded-xl italic text-center font-serif leading-relaxed"
      style={{
        background:  "rgba(180,140,60,0.08)",
        borderLeft:  "3px solid #d97706",
        color:       "#78350f",
        fontSize:    "0.85em",
      }}
    >
      {text}
    </div>
  );
}
