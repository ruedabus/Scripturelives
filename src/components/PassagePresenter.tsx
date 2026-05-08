"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useReadingPlan, { ReadingPlanEntry } from "@/components/useReadingPlan";
import { BookOpen } from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const GOLD   = "#C9952A";
const NAVY   = "#1a2640";
const CREAM  = "#faf8f3";
const BORDER = "#ede8de";
const CREAM2 = "#f5f0e8"; // slightly darker cream for toolbars

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type BibleVersion = "KJV" | "ASV" | "WEB" | "NIV" | "NLT" | "AMP";

const LOCAL_VERSIONS: BibleVersion[] = ["KJV", "ASV", "WEB"];
const CLOUD_VERSIONS: BibleVersion[] = ["NIV", "NLT", "AMP"];
const ALL_VERSIONS: BibleVersion[] = [...LOCAL_VERSIONS, ...CLOUD_VERSIONS];

/** Sanitize any stored/incoming version string — fall back to KJV if unrecognised */
function safeVersion(v: string | undefined | null): BibleVersion {
  return (ALL_VERSIONS as string[]).includes(v ?? "") ? (v as BibleVersion) : "KJV";
}
const VERSION_LABELS: Record<BibleVersion, string> = {
  KJV: "King James Version",
  ASV: "American Standard Version",
  WEB: "World English Bible",
  NIV: "New International Version",
  NLT: "New Living Translation",
  AMP: "Amplified Bible",
};

type BibleVerse = {
  verse: number;
  text: string;
};

type SearchResult = {
  version: BibleVersion;
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
  matchType: "reference" | "keyword";
};

type Props = {
  onWordClick: (word: string, book: string) => void;
  onVisualSearch: (term: string) => void;
  onNavigateFullBible: (book: string, chapter: number) => void;
  onVerseChange?: (ref: { book: string; chapter: number; verse?: number; reference: string; text: string }) => void;
  /** Pre-populate the search box when navigating from the home-page search */
  initialQuery?: string;
  /** Jump directly to a parsed verse — bypasses the search box entirely */
  jumpToRef?: { book: string; chapter: number; verse: number } | null;
};

// ---------------------------------------------------------------------------
// Word Study Verse — each word is a clickable lexicon button
// ---------------------------------------------------------------------------
function WordStudyVerse({
  num,
  text,
  book,
  onWordClick,
}: {
  num: number;
  text: string;
  book: string;
  onWordClick: (word: string, book: string) => void;
}) {
  const parts = text.split(/(\b[A-Za-z'']+\b)/);
  return (
    <span>
      <sup style={{ color: GOLD }} className="mr-1 text-xs font-bold">{num}</sup>
      {parts.map((part, i) =>
        /^[A-Za-z'']+$/.test(part) ? (
          <button
            key={i}
            type="button"
            onClick={() => onWordClick(part, book)}
            className="text-sky-600 hover:text-sky-700 hover:underline decoration-dotted underline-offset-2 transition"
            title={`Look up "${part}" in Hebrew/Greek lexicon`}
          >
            {part}
          </button>
        ) : (
          <span key={i}>{part}</span>
        )
      )}{" "}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Reading Plan Card
// ---------------------------------------------------------------------------
function PlanCard({
  entry,
  isActive,
  onLoad,
  onRemove,
  onUpdateNote,
}: {
  entry: ReadingPlanEntry;
  isActive: boolean;
  onLoad: () => void;
  onRemove: () => void;
  onUpdateNote: (note: string) => void;
}) {
  const [editingNote, setEditingNote] = useState(false);
  const [draft, setDraft] = useState(entry.note);

  return (
    <div
      className="rounded-xl border p-4 transition"
      style={{
        borderColor: isActive ? GOLD : BORDER,
        background: isActive ? "#fdf6e8" : "#ffffff",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <button type="button" onClick={onLoad} className="text-left group">
            <p className="font-semibold transition text-sm" style={{ color: GOLD }}>
              <BookOpen size={13} className="inline mr-1" style={{ color: GOLD }} />
              {entry.reference}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {entry.text.length > 120 ? entry.text.slice(0, 120) + "…" : entry.text}
            </p>
          </button>

          {entry.note && !editingNote && (
            <p
              className="mt-2 text-xs text-gray-500 italic border-l-2 pl-2"
              style={{ borderColor: GOLD }}
            >
              {entry.note}
            </p>
          )}

          {editingNote && (
            <div className="mt-2 flex gap-2">
              <input
                autoFocus
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { onUpdateNote(draft); setEditingNote(false); }
                  if (e.key === "Escape") { setDraft(entry.note); setEditingNote(false); }
                }}
                placeholder="Add a note…"
                className="flex-1 rounded border px-2 py-1 text-xs outline-none"
                style={{ borderColor: BORDER }}
                onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
              />
              <button
                type="button"
                onClick={() => { onUpdateNote(draft); setEditingNote(false); }}
                className="rounded px-2 py-1 text-xs text-white transition"
                style={{ background: GOLD }}
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-300 hover:text-red-400 transition text-base leading-none"
            title="Remove from plan"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => setEditingNote((v) => !v)}
            className="text-xs text-gray-400 transition"
            style={{}}
            onMouseEnter={(e) => { e.currentTarget.style.color = GOLD; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#9ca3af"; }}
            title="Add a note"
          >
            ✏️
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span
          className="rounded-full border px-2 py-0.5 text-xs"
          style={{ borderColor: BORDER, color: "#9ca3af" }}
        >
          {entry.version}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(entry.addedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Last-read dog-ear key
// ---------------------------------------------------------------------------
const LAST_READ_KEY = "scripture-lives-last-read";

function readLastRead() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_READ_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.book === "string") return parsed as { book: string; chapter: number; verse: number | null };
  } catch { /* ignore */ }
  return null;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function PassagePresenter({
  onWordClick,
  onVisualSearch,
  onNavigateFullBible,
  onVerseChange,
  initialQuery = "",
  jumpToRef,
}: Props) {
  // ── Search ────────────────────────────────────────────────────────────────
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Presentation State ────────────────────────────────────────────────────
  const [version, setVersion] = useState<BibleVersion>("KJV");
  const _lastRead = useRef(readLastRead());
  const [presentBook, setPresentBook] = useState<string | null>(_lastRead.current?.book ?? null);
  const [presentChapter, setPresentChapter] = useState<number>(_lastRead.current?.chapter ?? 1);
  const [presentVerse, setPresentVerse] = useState<number | null>(_lastRead.current?.verse ?? null);
  const [chapterVerses, setChapterVerses] = useState<BibleVerse[]>([]);
  const [totalChapters, setTotalChapters] = useState<number>(0);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [wordStudy, setWordStudy] = useState(false);
  const [presentMode, setPresentMode] = useState(false);

  // ── View ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"search" | "plan">("search");

  // ── Reading Plan ──────────────────────────────────────────────────────────
  const { plan, addEntry, removeEntry, updateNote, isInPlan } = useReadingPlan();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!jumpToRef) return;
    setPresentBook(jumpToRef.book);
    setPresentChapter(jumpToRef.chapter);
    setPresentVerse(jumpToRef.verse);
    setQuery("");
    setSearchResults([]);
  }, [jumpToRef]);

  useEffect(() => {
    if (query.trim().length < 2) { setSearchResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/bible/search?q=${encodeURIComponent(query.trim())}`)
        .then((r) => r.json())
        .then((d) => setSearchResults(d.results ?? []))
        .catch(() => setSearchResults([]))
        .finally(() => setIsSearching(false));
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const [chapterError, setChapterError] = useState<string | null>(null);

  useEffect(() => {
    if (!presentBook) return;
    setLoadingChapter(true);
    setChapterError(null);
    fetch(`/api/bible?version=${version}&book=${encodeURIComponent(presentBook)}&chapter=${presentChapter}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setChapterVerses([]); setChapterError(d.error); }
        else { setChapterVerses(d.verses ?? []); setTotalChapters(d.totalChapters ?? 0); }
      })
      .catch(() => { setChapterVerses([]); setChapterError("Failed to load — check your network connection."); })
      .finally(() => setLoadingChapter(false));
  }, [presentBook, presentChapter, version]);

  useEffect(() => {
    if (!presentBook || chapterVerses.length === 0) return;
    const verseObj = presentVerse != null ? chapterVerses.find((v) => v.verse === presentVerse) : null;
    const reference = presentVerse != null
      ? `${presentBook} ${presentChapter}:${presentVerse}`
      : `${presentBook} ${presentChapter}`;
    const text = verseObj?.text ?? chapterVerses.slice(0, 3).map((v) => v.text).join(" ");
    onVerseChange?.({ book: presentBook, chapter: presentChapter, verse: presentVerse ?? undefined, reference, text });
  }, [presentBook, presentChapter, presentVerse, chapterVerses, onVerseChange]);

  useEffect(() => {
    if (!presentBook) return;
    try {
      window.localStorage.setItem(LAST_READ_KEY, JSON.stringify({
        book: presentBook, chapter: presentChapter, verse: presentVerse,
      }));
    } catch { /* ignore */ }
  }, [presentBook, presentChapter, presentVerse]);

  const openResult = useCallback((r: SearchResult) => {
    setPresentBook(r.book);
    setPresentChapter(r.chapter);
    setPresentVerse(r.verse);
    setVersion(safeVersion(r.version));
    setQuery("");
    setSearchResults([]);
    setActiveTab("search");
  }, []);

  const openPlanEntry = useCallback((entry: ReadingPlanEntry) => {
    setPresentBook(entry.book);
    setPresentChapter(entry.chapter);
    setPresentVerse(entry.verse ?? null);
    setVersion(safeVersion(entry.version));
    setActivePlanId(entry.id);
  }, []);

  const addCurrentToPlan = () => {
    if (!presentBook) return;
    const displayVerse = presentVerse != null ? chapterVerses.find((v) => v.verse === presentVerse) : null;
    const text = displayVerse
      ? displayVerse.text
      : chapterVerses.slice(0, 3).map((v) => v.text).join(" ");
    const reference = presentVerse != null
      ? `${presentBook} ${presentChapter}:${presentVerse}`
      : `${presentBook} ${presentChapter}`;
    addEntry({ version, book: presentBook, chapter: presentChapter, verse: presentVerse ?? undefined, reference, text });
  };

  const alreadyInPlan = presentBook
    ? isInPlan(version, presentBook, presentChapter, presentVerse ?? undefined)
    : false;

  const displayVerses = presentVerse != null
    ? chapterVerses.filter((v) => v.verse === presentVerse)
    : chapterVerses;

  const refLabel = presentBook
    ? (presentVerse != null
      ? `${presentBook} ${presentChapter}:${presentVerse}`
      : `${presentBook} ${presentChapter}`)
    : null;

  const goPrevVerse = () => {
    if (presentVerse == null) return;
    const idx = chapterVerses.findIndex((v) => v.verse === presentVerse);
    if (idx > 0) setPresentVerse(chapterVerses[idx - 1].verse);
    else if (presentChapter > 1) { setPresentChapter((c) => c - 1); setPresentVerse(null); }
  };
  const goNextVerse = () => {
    if (presentVerse == null) { setPresentVerse(chapterVerses[0]?.verse ?? null); return; }
    const idx = chapterVerses.findIndex((v) => v.verse === presentVerse);
    if (idx < chapterVerses.length - 1) setPresentVerse(chapterVerses[idx + 1].verse);
    else if (presentChapter < totalChapters) { setPresentChapter((c) => c + 1); setPresentVerse(null); }
  };

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="border-b pb-3" style={{ borderColor: BORDER }}>
        <h2 className="text-lg font-semibold" style={{ color: NAVY }}>Passage Presenter</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Search any verse, study Hebrew &amp; Greek roots, save a personal reading plan
        </p>
      </div>

      {/* ── Tab bar ── */}
      <div
        className="flex rounded-xl border p-1 gap-1"
        style={{ borderColor: BORDER, background: CREAM }}
      >
        {(["search", "plan"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition"
              style={
                isActive
                  ? { background: GOLD, color: "#ffffff" }
                  : { color: NAVY }
              }
            >
              {tab === "search" ? "🔍 Search & Present" : `📌 Reading Plan${plan.length > 0 ? ` (${plan.length})` : ""}`}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════ SEARCH & PRESENT TAB ══════════════════════════ */}
      {activeTab === "search" && (
        <div className="space-y-4">

          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Reference (John 3:16) or keyword…"
              className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
              style={{ borderColor: BORDER }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = GOLD;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD}22`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setSearchResults([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>

          {/* Search results */}
          {(isSearching || searchResults.length > 0) && (
            <div
              className="rounded-xl border bg-white overflow-hidden shadow-sm"
              style={{ borderColor: BORDER }}
            >
              {isSearching && (
                <p className="px-4 py-3 text-sm text-gray-400 italic">Searching…</p>
              )}
              {!isSearching && searchResults.length === 0 && query.trim().length >= 2 && (
                <p className="px-4 py-3 text-sm text-gray-400 italic">No results found.</p>
              )}
              <div className="divide-y max-h-64 overflow-y-auto" style={{ borderColor: BORDER }}>
                {searchResults.map((r, i) => (
                  <button
                    key={`${r.version}-${r.reference}-${i}`}
                    type="button"
                    onClick={() => openResult(r)}
                    className="w-full px-4 py-3 text-left transition"
                    style={{}}
                    onMouseEnter={(e) => { e.currentTarget.style.background = CREAM; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: GOLD }}>{r.version}</span>
                      <span className="text-sm font-semibold text-gray-800">{r.reference}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{r.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Presentation Area ── */}
          {presentBook && (
            <div
              className="rounded-xl border overflow-hidden transition-all"
              style={{
                borderColor: presentMode ? GOLD : BORDER,
                background: presentMode ? "#fdf8ef" : "#ffffff",
                boxShadow: presentMode ? `0 4px 24px ${GOLD}33` : undefined,
              }}
            >
              {/* Top toolbar */}
              <div
                className="flex flex-wrap items-center gap-2 border-b px-4 py-3"
                style={{ borderColor: BORDER, background: CREAM2 }}
              >
                {/* Version selector */}
                <select
                  value={version}
                  onChange={(e) => setVersion(safeVersion(e.target.value))}
                  className="rounded-lg border bg-white px-2 py-1.5 text-xs text-gray-700 outline-none transition"
                  style={{ borderColor: BORDER }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; }}
                  title={VERSION_LABELS[version]}
                >
                  <optgroup label="Classic">
                    {LOCAL_VERSIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </optgroup>
                  <optgroup label="Licensed">
                    {CLOUD_VERSIONS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </optgroup>
                </select>

                {/* Reference label */}
                <span className="font-bold text-sm flex-1 min-w-0 truncate" style={{ color: NAVY }}>
                  {refLabel}
                </span>

                {/* Full chapter toggle */}
                {presentVerse != null && (
                  <button
                    type="button"
                    onClick={() => setPresentVerse(null)}
                    className="rounded-full border px-2.5 py-1 text-xs text-gray-500 transition"
                    style={{ borderColor: BORDER }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = "#6b7280"; }}
                    title="Show full chapter"
                  >
                    Full chapter
                  </button>
                )}

                {/* Word study */}
                <button
                  type="button"
                  onClick={() => setWordStudy((v) => !v)}
                  className="rounded-full px-2.5 py-1 text-xs font-medium border transition"
                  style={
                    wordStudy
                      ? { background: "#e0f2fe", borderColor: "#7dd3fc", color: "#0369a1" }
                      : { borderColor: BORDER, color: "#6b7280" }
                  }
                  title="Click any word to look it up in Hebrew/Greek lexicon"
                >
                  🔤 Word Study
                </button>

                {/* Visual reference */}
                <button
                  type="button"
                  onClick={() => onVisualSearch(refLabel ?? presentBook)}
                  className="rounded-full border px-2.5 py-1 text-xs text-gray-500 transition"
                  style={{ borderColor: BORDER }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = "#6b7280"; }}
                  title="Visual reference"
                >
                  🖼 Visual
                </button>

                {/* Presentation mode */}
                <button
                  type="button"
                  onClick={() => setPresentMode((v) => !v)}
                  className="rounded-full px-2.5 py-1 text-xs font-medium border transition"
                  style={
                    presentMode
                      ? { background: "#fdf6e8", borderColor: GOLD, color: NAVY }
                      : { borderColor: BORDER, color: "#6b7280" }
                  }
                  title="Presentation mode (large text)"
                >
                  {presentMode ? "📽 Presenting" : "📽 Present"}
                </button>

                {/* Full Bible link */}
                <button
                  type="button"
                  onClick={() => onNavigateFullBible(presentBook, presentChapter)}
                  className="rounded-full border px-2.5 py-1 text-xs text-gray-500 transition"
                  style={{ borderColor: BORDER }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#9ca3af"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; }}
                  title="Open in Full Bible reader"
                >
                  ↗ Full Bible
                </button>
              </div>

              {/* Verse text */}
              <div className={`px-5 ${presentMode ? "py-8" : "py-5"}`}>
                {loadingChapter ? (
                  <p className="text-sm text-gray-400 italic">Loading…</p>
                ) : chapterError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                    <p className="font-semibold mb-1">Could not load {version}</p>
                    <p className="text-xs text-red-500">{chapterError}</p>
                    {["NIV","NLT","AMP"].includes(version) && (
                      <p className="mt-2 text-xs text-red-500">
                        Make sure <code className="font-mono bg-red-100 px-1 rounded">API_BIBLE_KEY</code> is set in your Vercel environment variables.
                      </p>
                    )}
                  </div>
                ) : displayVerses.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No verses found.</p>
                ) : (
                  <div
                    className="leading-relaxed"
                    style={{
                      fontSize: presentMode ? "1.4rem" : "1rem",
                      fontWeight: presentMode ? 500 : 400,
                      color: NAVY,
                    }}
                  >
                    {presentVerse != null ? (
                      displayVerses.map((v) =>
                        wordStudy ? (
                          <p key={v.verse} className="leading-loose">
                            <WordStudyVerse num={v.verse} text={v.text} book={presentBook} onWordClick={onWordClick} />
                          </p>
                        ) : (
                          <p key={v.verse} className="leading-relaxed">
                            <sup className="mr-1 text-xs font-bold" style={{ color: GOLD }}>{v.verse}</sup>
                            {v.text}
                          </p>
                        )
                      )
                    ) : (
                      <p className="leading-relaxed">
                        {displayVerses.map((v) =>
                          wordStudy ? (
                            <WordStudyVerse key={v.verse} num={v.verse} text={v.text} book={presentBook} onWordClick={onWordClick} />
                          ) : (
                            <span key={v.verse}>
                              <sup className="mr-0.5 text-xs font-bold" style={{ color: GOLD }}>{v.verse}</sup>
                              {v.text}{" "}
                            </span>
                          )
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom toolbar */}
              <div
                className="flex items-center justify-between gap-3 border-t px-4 py-3"
                style={{ borderColor: BORDER, background: CREAM2 }}
              >
                {/* Navigation buttons */}
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    onClick={goPrevVerse}
                    className="rounded-lg border px-3 py-1.5 text-xs transition"
                    style={{ borderColor: BORDER, color: NAVY }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = CREAM; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    onClick={goNextVerse}
                    className="rounded-lg border px-3 py-1.5 text-xs transition"
                    style={{ borderColor: BORDER, color: NAVY }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = CREAM; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    Next →
                  </button>
                  {totalChapters > 1 && (
                    <>
                      {presentChapter > 1 && (
                        <button
                          type="button"
                          onClick={() => { setPresentChapter((c) => c - 1); setPresentVerse(null); }}
                          className="ml-2 rounded-lg border px-2 py-1.5 text-xs transition"
                          style={{ borderColor: BORDER, color: "#9ca3af" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = CREAM; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                        >
                          ← Ch {presentChapter - 1}
                        </button>
                      )}
                      {presentChapter < totalChapters && (
                        <button
                          type="button"
                          onClick={() => { setPresentChapter((c) => c + 1); setPresentVerse(null); }}
                          className="rounded-lg border px-2 py-1.5 text-xs transition"
                          style={{ borderColor: BORDER, color: "#9ca3af" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = CREAM; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                        >
                          Ch {presentChapter + 1} →
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Save to reading plan */}
                <button
                  type="button"
                  onClick={addCurrentToPlan}
                  disabled={alreadyInPlan}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition"
                  style={
                    alreadyInPlan
                      ? { background: "#fdf6e8", color: GOLD, cursor: "default" }
                      : { background: GOLD, color: "#ffffff" }
                  }
                >
                  {alreadyInPlan ? "✓ In Reading Plan" : "📌 Save to Reading Plan"}
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!presentBook && (
            <div
              className="rounded-xl border border-dashed p-10 text-center"
              style={{ borderColor: BORDER, background: CREAM }}
            >
              <BookOpen size={36} className="mx-auto mb-3" style={{ color: `${NAVY}44` }} />
              <p className="text-sm font-medium" style={{ color: NAVY }}>
                Search for any verse or passage above
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try "John 3:16", "grace", or "In the beginning"
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["John 3:16", "Psalm 23", "Romans 8", "Isaiah 40:31"].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setQuery(quick)}
                    className="rounded-full border px-3 py-1.5 text-xs transition"
                    style={{ borderColor: `${GOLD}66`, background: "#fdf6e8", color: GOLD }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#faecd3"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fdf6e8"; }}
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════ READING PLAN TAB ══════════════════════════ */}
      {activeTab === "plan" && (
        <div className="space-y-3">
          {plan.length === 0 ? (
            <div
              className="rounded-xl border border-dashed p-10 text-center"
              style={{ borderColor: BORDER, background: CREAM }}
            >
              <p className="text-3xl mb-3">📌</p>
              <p className="text-sm font-medium" style={{ color: NAVY }}>Your reading plan is empty</p>
              <p className="text-xs text-gray-400 mt-1">
                Search a verse and click "Save to Reading Plan" to add it here
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400">{plan.length} passage{plan.length !== 1 ? "s" : ""} saved</p>
              {plan.map((entry) => (
                <PlanCard
                  key={entry.id}
                  entry={entry}
                  isActive={activePlanId === entry.id}
                  onLoad={() => { openPlanEntry(entry); setActiveTab("search"); }}
                  onRemove={() => removeEntry(entry.id)}
                  onUpdateNote={(note) => updateNote(entry.id, note)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
