"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Columns3, X } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type BibleVersion = "KJV" | "ASV" | "WEB" | "NIV" | "NLT" | "AMP";

type BibleVerse = {
  verse: number;
  text: string;
};

type BookInfo = {
  name: string;
  chapters: number;
};

// ── Constants ──────────────────────────────────────────────────────────────
const ALL_VERSIONS: BibleVersion[] = ["KJV", "ASV", "WEB", "NIV", "NLT", "AMP"];

const VERSION_LABELS: Record<BibleVersion, string> = {
  KJV: "KJV",
  ASV: "ASV",
  WEB: "WEB",
  NIV: "NIV",
  NLT: "NLT",
  AMP: "AMP",
};

const VERSION_FULL: Record<BibleVersion, string> = {
  KJV: "King James Version",
  ASV: "American Standard Version",
  WEB: "World English Bible",
  NIV: "New International Version",
  NLT: "New Living Translation",
  AMP: "Amplified Bible",
};

const VERSION_COLORS: Record<BibleVersion, { bg: string; text: string; border: string }> = {
  KJV: { bg: "bg-amber-100",  text: "text-amber-800",  border: "border-amber-300" },
  ASV: { bg: "bg-sky-100",    text: "text-sky-800",    border: "border-sky-300" },
  WEB: { bg: "bg-green-100",  text: "text-green-800",  border: "border-green-300" },
  NIV: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
  NLT: { bg: "bg-rose-100",   text: "text-rose-800",   border: "border-rose-300" },
  AMP: { bg: "bg-teal-100",   text: "text-teal-800",   border: "border-teal-300" },
};

const DEFAULT_VERSIONS: BibleVersion[] = ["KJV", "NIV"];

// ── Helpers ────────────────────────────────────────────────────────────────
async function fetchBooks(): Promise<BookInfo[]> {
  const res = await fetch("/api/bible?version=KJV");
  if (!res.ok) return [];
  const data = await res.json();
  return data.books ?? [];
}

async function fetchVerses(version: BibleVersion, book: string, chapter: number): Promise<BibleVerse[]> {
  const res = await fetch(
    `/api/bible?version=${version}&book=${encodeURIComponent(book)}&chapter=${chapter}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  // Normalise: local returns {verse, text}, remote returns same shape from apiBible
  return (data.verses ?? []).map((v: { verse: number; text: string }) => ({
    verse: v.verse,
    text: v.text,
  }));
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ParallelBibleReader() {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("John");
  const [selectedChapter, setSelectedChapter] = useState<number>(3);
  const [totalChapters, setTotalChapters] = useState<number>(1);
  const [activeVersions, setActiveVersions] = useState<BibleVersion[]>(DEFAULT_VERSIONS);
  const [verses, setVerses] = useState<Record<BibleVersion, BibleVerse[]>>({} as Record<BibleVersion, BibleVerse[]>);
  const [loading, setLoading] = useState<Record<BibleVersion, boolean>>({} as Record<BibleVersion, boolean>);
  const [errors, setErrors] = useState<Record<BibleVersion, string>>({} as Record<BibleVersion, string>);
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("sm");
  const loadingRef = useRef<Record<string, boolean>>({});

  // Load book list
  useEffect(() => {
    fetchBooks().then((b) => {
      setBooks(b);
      const john = b.find((x) => x.name === "John");
      if (john) setTotalChapters(john.chapters);
    });
  }, []);

  // Update total chapters when book changes
  useEffect(() => {
    const info = books.find((b) => b.name === selectedBook);
    if (info) setTotalChapters(info.chapters);
  }, [selectedBook, books]);

  // Load verses for all active versions whenever book/chapter/versions change
  const loadVerses = useCallback(async () => {
    const key = `${selectedBook}-${selectedChapter}-${activeVersions.join(",")}`;
    if (loadingRef.current[key]) return;
    loadingRef.current[key] = true;

    const newLoading: Record<string, boolean> = {};
    activeVersions.forEach((v) => { newLoading[v] = true; });
    setLoading(newLoading as Record<BibleVersion, boolean>);

    const results = await Promise.allSettled(
      activeVersions.map(async (v) => {
        const data = await fetchVerses(v, selectedBook, selectedChapter);
        return { version: v, data };
      })
    );

    const newVerses: Partial<Record<BibleVersion, BibleVerse[]>> = {};
    const newErrors: Partial<Record<BibleVersion, string>> = {};
    const newDone: Record<string, boolean> = {};

    results.forEach((r) => {
      if (r.status === "fulfilled") {
        newVerses[r.value.version] = r.value.data;
        newErrors[r.value.version] = "";
      } else {
        const v = activeVersions[results.indexOf(r)];
        newErrors[v] = "Failed to load";
      }
      const v = r.status === "fulfilled" ? r.value.version : activeVersions[results.indexOf(r)];
      newDone[v] = false;
    });

    setVerses((prev) => ({ ...prev, ...newVerses }));
    setErrors((prev) => ({ ...prev, ...newErrors }));
    setLoading(newDone as Record<BibleVersion, boolean>);
    loadingRef.current[key] = false;
  }, [selectedBook, selectedChapter, activeVersions]);

  useEffect(() => {
    loadVerses();
  }, [loadVerses]);

  const toggleVersion = (v: BibleVersion) => {
    setActiveVersions((prev) => {
      if (prev.includes(v)) {
        if (prev.length <= 2) return prev; // minimum 2
        return prev.filter((x) => x !== v);
      }
      if (prev.length >= 4) return prev; // maximum 4
      return [...prev, v];
    });
  };

  const prevChapter = () => {
    if (selectedChapter > 1) setSelectedChapter((c) => c - 1);
  };
  const nextChapter = () => {
    if (selectedChapter < totalChapters) setSelectedChapter((c) => c + 1);
  };

  // All verse numbers across active versions
  const allVerseNums = Array.from(
    new Set(
      activeVersions.flatMap((v) => (verses[v] ?? []).map((vv) => vv.verse))
    )
  ).sort((a, b) => a - b);

  const colClass = activeVersions.length === 2
    ? "grid-cols-2"
    : activeVersions.length === 3
    ? "grid-cols-3"
    : "grid-cols-2 md:grid-cols-4";

  const fontClass = fontSize === "sm" ? "text-sm" : fontSize === "base" ? "text-base" : "text-lg";

  return (
    <div className="flex flex-col h-full">

      {/* ── Header controls ───────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 space-y-3 shrink-0">

        {/* Title row */}
        <div className="flex items-center gap-2">
          <Columns3 size={18} className="text-amber-600" />
          <h2 className="text-base font-semibold text-gray-800">Parallel Bible</h2>
          <span className="ml-auto text-xs text-gray-400">Compare 2–4 translations</span>
        </div>

        {/* Version toggles */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_VERSIONS.map((v) => {
            const active = activeVersions.includes(v);
            const col = VERSION_COLORS[v];
            return (
              <button
                key={v}
                type="button"
                onClick={() => toggleVersion(v)}
                title={VERSION_FULL[v]}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
                  active
                    ? `${col.bg} ${col.text} ${col.border}`
                    : "bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300"
                }`}
              >
                {VERSION_LABELS[v]}
              </button>
            );
          })}
          <span className="ml-auto text-[10px] text-gray-400 self-center">
            {activeVersions.length}/4 selected
          </span>
        </div>

        {/* Book + Chapter navigation */}
        <div className="flex items-center gap-2">
          <select
            value={selectedBook}
            onChange={(e) => { setSelectedBook(e.target.value); setSelectedChapter(1); }}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-amber-400"
          >
            {books.map((b) => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={prevChapter}
            disabled={selectedChapter <= 1}
            className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-30 transition"
          >
            <ChevronLeft size={14} />
          </button>

          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
            className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-center text-gray-800 focus:outline-none focus:border-amber-400"
          >
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>Ch. {n}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={nextChapter}
            disabled={selectedChapter >= totalChapters}
            className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-30 transition"
          >
            <ChevronRight size={14} />
          </button>

          {/* Font size */}
          <div className="flex items-center gap-0.5 ml-auto">
            {(["sm", "base", "lg"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFontSize(f)}
                className={`rounded px-2 py-1 text-xs font-medium transition ${
                  fontSize === f ? "bg-amber-100 text-amber-700" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {f === "sm" ? "A" : f === "base" ? "A" : "A"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Column headers ─────────────────────────────────────────── */}
      <div className={`grid ${colClass} border-b border-gray-200 bg-gray-50 shrink-0`}>
        {activeVersions.map((v) => {
          const col = VERSION_COLORS[v];
          return (
            <div key={v} className={`px-3 py-2 flex items-center gap-1.5 border-r border-gray-200 last:border-r-0`}>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${col.bg} ${col.text}`}>
                {VERSION_LABELS[v]}
              </span>
              <span className="text-[10px] text-gray-400 truncate">{VERSION_FULL[v]}</span>
              {loading[v] && (
                <span className="ml-auto text-[10px] text-amber-500 animate-pulse">Loading…</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Verse grid ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {allVerseNums.length === 0 && !Object.values(loading).some(Boolean) ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <BookOpen size={28} className="mb-2 opacity-40" />
            <p className="text-sm">Select a book and chapter to begin</p>
          </div>
        ) : (
          allVerseNums.map((verseNum) => (
            <div
              key={verseNum}
              className={`grid ${colClass} border-b border-gray-100 cursor-pointer transition ${
                highlightedVerse === verseNum ? "bg-amber-50" : "hover:bg-gray-50"
              }`}
              onClick={() =>
                setHighlightedVerse((prev) => (prev === verseNum ? null : verseNum))
              }
            >
              {activeVersions.map((v) => {
                const verseData = (verses[v] ?? []).find((vv) => vv.verse === verseNum);
                const isLoading = loading[v];
                const hasError = errors[v];
                return (
                  <div
                    key={v}
                    className="px-3 py-2.5 border-r border-gray-100 last:border-r-0"
                  >
                    {isLoading ? (
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                    ) : hasError ? (
                      <p className="text-xs text-red-400 italic">{hasError}</p>
                    ) : verseData ? (
                      <p className={`${fontClass} text-gray-800 leading-relaxed`}>
                        <span className="text-[10px] font-bold text-amber-600 mr-1.5 select-none">
                          {verseNum}
                        </span>
                        {verseData.text}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-300 italic">—</p>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* ── Highlighted verse bar ──────────────────────────────────── */}
      {highlightedVerse !== null && (
        <div className="shrink-0 border-t border-amber-200 bg-amber-50 px-4 py-2 flex items-center justify-between">
          <p className="text-xs text-amber-700 font-semibold">
            {selectedBook} {selectedChapter}:{highlightedVerse} — click again to deselect
          </p>
          <button
            type="button"
            onClick={() => setHighlightedVerse(null)}
            className="text-amber-400 hover:text-amber-700 transition"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
