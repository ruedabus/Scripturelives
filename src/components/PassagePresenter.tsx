"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useReadingPlan, { ReadingPlanEntry } from "@/components/useReadingPlan";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type BibleVersion = "KJV" | "ASV" | "WEB";

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
      <sup className="mr-1 text-xs font-bold text-amber-500">{num}</sup>
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
      className={`rounded-xl border p-4 transition ${
        isActive ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onLoad}
            className="text-left group"
          >
            <p className="font-semibold text-amber-700 group-hover:text-amber-600 transition text-sm">
              📖 {entry.reference}
            </p>
            <p className="mt-0.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {entry.text.length > 120 ? entry.text.slice(0, 120) + "…" : entry.text}
            </p>
          </button>

          {entry.note && !editingNote && (
            <p className="mt-2 text-xs text-gray-500 italic border-l-2 border-amber-300 pl-2">
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
                  if (e.key === "Enter") {
                    onUpdateNote(draft);
                    setEditingNote(false);
                  }
                  if (e.key === "Escape") {
                    setDraft(entry.note);
                    setEditingNote(false);
                  }
                }}
                placeholder="Add a note…"
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => { onUpdateNote(draft); setEditingNote(false); }}
                className="rounded bg-amber-500 px-2 py-1 text-xs text-white hover:bg-amber-600 transition"
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
            className="text-xs text-gray-400 hover:text-amber-600 transition"
            title="Add a note"
          >
            ✏️
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-400">
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
}: Props) {
  // ── Search ────────────────────────────────────────────────────────────────
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Presentation State ────────────────────────────────────────────────────
  const [version, setVersion] = useState<BibleVersion>("KJV");
  // Lazy initializers read localStorage exactly once on mount (dog-ear restore)
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

  // Sync initialQuery if parent pushes a new value (home-page search re-navigate)
  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);

  // ── Search effect ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
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

  // ── Fetch chapter when book/chapter/version changes ────────────────────────
  useEffect(() => {
    if (!presentBook) return;
    setLoadingChapter(true);
    fetch(`/api/bible?version=${version}&book=${encodeURIComponent(presentBook)}&chapter=${presentChapter}`)
      .then((r) => r.json())
      .then((d) => {
        setChapterVerses(d.verses ?? []);
        setTotalChapters(d.totalChapters ?? 0);
      })
      .catch(() => setChapterVerses([]))
      .finally(() => setLoadingChapter(false));
  }, [presentBook, presentChapter, version]);

  // ── Notify parent when displayed verse/chapter changes ─────────────────────
  useEffect(() => {
    if (!presentBook || chapterVerses.length === 0) return;
    const verseObj = presentVerse != null ? chapterVerses.find((v) => v.verse === presentVerse) : null;
    const reference = presentVerse != null
      ? `${presentBook} ${presentChapter}:${presentVerse}`
      : `${presentBook} ${presentChapter}`;
    const text = verseObj?.text ?? chapterVerses.slice(0, 3).map((v) => v.text).join(" ");
    onVerseChange?.({ book: presentBook, chapter: presentChapter, verse: presentVerse ?? undefined, reference, text });
  }, [presentBook, presentChapter, presentVerse, chapterVerses, onVerseChange]);

  // ── Dog-ear: save last-read position to localStorage ──────────────────────
  useEffect(() => {
    if (!presentBook) return;
    try {
      window.localStorage.setItem(LAST_READ_KEY, JSON.stringify({
        book: presentBook,
        chapter: presentChapter,
        verse: presentVerse,
      }));
    } catch { /* ignore */ }
  }, [presentBook, presentChapter, presentVerse]);

  // ── Helper: open a search result ─────────────────────────────────────────
  const openResult = useCallback((r: SearchResult) => {
    setPresentBook(r.book);
    setPresentChapter(r.chapter);
    setPresentVerse(r.verse);
    setVersion(r.version);
    setQuery("");
    setSearchResults([]);
    setActiveTab("search");
  }, []);

  // ── Helper: open a plan entry ─────────────────────────────────────────────
  const openPlanEntry = useCallback((entry: ReadingPlanEntry) => {
    setPresentBook(entry.book);
    setPresentChapter(entry.chapter);
    setPresentVerse(entry.verse ?? null);
    setVersion(entry.version);
    setActivePlanId(entry.id);
  }, []);

  // ── Helper: add current to plan ───────────────────────────────────────────
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

  // ── Display verses ────────────────────────────────────────────────────────
  const displayVerses = presentVerse != null
    ? chapterVerses.filter((v) => v.verse === presentVerse)
    : chapterVerses;

  const refLabel = presentBook
    ? (presentVerse != null
      ? `${presentBook} ${presentChapter}:${presentVerse}`
      : `${presentBook} ${presentChapter}`)
    : null;

  // ── Verse navigation ──────────────────────────────────────────────────────
  const goPrevVerse = () => {
    if (presentVerse == null) return;
    const idx = chapterVerses.findIndex((v) => v.verse === presentVerse);
    if (idx > 0) setPresentVerse(chapterVerses[idx - 1].verse);
    else if (presentChapter > 1) {
      setPresentChapter((c) => c - 1);
      setPresentVerse(null);
    }
  };
  const goNextVerse = () => {
    if (presentVerse == null) {
      setPresentVerse(chapterVerses[0]?.verse ?? null);
      return;
    }
    const idx = chapterVerses.findIndex((v) => v.verse === presentVerse);
    if (idx < chapterVerses.length - 1) setPresentVerse(chapterVerses[idx + 1].verse);
    else if (presentChapter < totalChapters) {
      setPresentChapter((c) => c + 1);
      setPresentVerse(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-amber-700">Passage Presenter</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Search any verse, study Hebrew &amp; Greek roots, save a personal reading plan
        </p>
      </div>

      {/* ── Tab bar: Search vs Reading Plan ── */}
      <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("search")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            activeTab === "search" ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          🔍 Search &amp; Present
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("plan")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
            activeTab === "plan" ? "bg-amber-500 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          📌 Reading Plan {plan.length > 0 && `(${plan.length})`}
        </button>
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
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
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

          {/* Search results dropdown */}
          {(isSearching || searchResults.length > 0) && (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              {isSearching && (
                <p className="px-4 py-3 text-sm text-gray-400 italic">Searching…</p>
              )}
              {!isSearching && searchResults.length === 0 && query.trim().length >= 2 && (
                <p className="px-4 py-3 text-sm text-gray-400 italic">No results found.</p>
              )}
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {searchResults.map((r, i) => (
                  <button
                    key={`${r.version}-${r.reference}-${i}`}
                    type="button"
                    onClick={() => openResult(r)}
                    className="w-full px-4 py-3 text-left hover:bg-amber-50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-600">{r.version}</span>
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
            <div className={`rounded-2xl border ${presentMode ? "border-amber-300 shadow-xl bg-amber-50/30" : "border-gray-200 bg-white"} overflow-hidden transition-all`}>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-4 py-3 bg-gray-50">
                {/* Version selector */}
                <select
                  value={version}
                  onChange={(e) => setVersion(e.target.value as BibleVersion)}
                  className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-amber-400"
                >
                  <option value="KJV">KJV</option>
                  <option value="ASV">ASV</option>
                  <option value="WEB">WEB</option>
                </select>

                {/* Reference label */}
                <span className="font-bold text-amber-700 text-sm flex-1 min-w-0 truncate">
                  {refLabel}
                </span>

                {/* Verse toggle */}
                {presentVerse != null && (
                  <button
                    type="button"
                    onClick={() => setPresentVerse(null)}
                    className="rounded-full border border-gray-300 px-2.5 py-1 text-xs text-gray-500 hover:border-amber-400 transition"
                    title="Show full chapter"
                  >
                    Full chapter
                  </button>
                )}

                {/* Word study */}
                <button
                  type="button"
                  onClick={() => setWordStudy((v) => !v)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium border transition ${
                    wordStudy
                      ? "bg-sky-100 border-sky-300 text-sky-700"
                      : "border-gray-300 text-gray-500 hover:border-sky-300"
                  }`}
                  title="Click any word to look it up in Hebrew/Greek lexicon"
                >
                  🔤 Word Study
                </button>

                {/* Visual reference */}
                <button
                  type="button"
                  onClick={() => onVisualSearch(refLabel ?? presentBook)}
                  className="rounded-full border border-gray-300 px-2.5 py-1 text-xs text-gray-500 hover:border-amber-400 hover:text-amber-700 transition"
                  title="Visual reference"
                >
                  🖼 Visual
                </button>

                {/* Presentation mode */}
                <button
                  type="button"
                  onClick={() => setPresentMode((v) => !v)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium border transition ${
                    presentMode
                      ? "bg-amber-100 border-amber-300 text-amber-800"
                      : "border-gray-300 text-gray-500 hover:border-amber-400"
                  }`}
                  title="Presentation mode (large text)"
                >
                  {presentMode ? "📽 Presenting" : "📽 Present"}
                </button>

                {/* Full Bible link */}
                <button
                  type="button"
                  onClick={() => onNavigateFullBible(presentBook, presentChapter)}
                  className="rounded-full border border-gray-300 px-2.5 py-1 text-xs text-gray-500 hover:border-gray-400 transition"
                  title="Open in Full Bible reader"
                >
                  ↗ Full Bible
                </button>
              </div>

              {/* Verse text */}
              <div className={`px-5 py-5 ${presentMode ? "py-8" : ""}`}>
                {loadingChapter ? (
                  <p className="text-sm text-gray-400 italic">Loading…</p>
                ) : displayVerses.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No verses found.</p>
                ) : (
                  <div className={`leading-relaxed ${presentMode ? "text-2xl font-medium text-gray-800" : "text-base text-gray-800"}`}>
                    {presentVerse != null ? (
                      // Single verse — display large
                      displayVerses.map((v) =>
                        wordStudy ? (
                          <p key={v.verse} className="leading-loose">
                            <WordStudyVerse
                              num={v.verse}
                              text={v.text}
                              book={presentBook}
                              onWordClick={onWordClick}
                            />
                          </p>
                        ) : (
                          <p key={v.verse} className="leading-relaxed">
                            <sup className="mr-1 text-xs font-bold text-amber-500">{v.verse}</sup>
                            {v.text}
                          </p>
                        )
                      )
                    ) : (
                      // Full chapter — paragraph-flow
                      <p className="leading-relaxed text-gray-800">
                        {displayVerses.map((v) =>
                          wordStudy ? (
                            <WordStudyVerse
                              key={v.verse}
                              num={v.verse}
                              text={v.text}
                              book={presentBook}
                              onWordClick={onWordClick}
                            />
                          ) : (
                            <span key={v.verse}>
                              <sup className="mr-0.5 text-xs font-bold text-amber-500">{v.verse}</sup>
                              {v.text}{" "}
                            </span>
                          )
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom toolbar: nav + bookmark */}
              <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 bg-gray-50">
                {/* Prev / Next verse */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={goPrevVerse}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    onClick={goNextVerse}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition"
                  >
                    Next →
                  </button>
                  {totalChapters > 1 && (
                    <>
                      {presentChapter > 1 && (
                        <button
                          type="button"
                          onClick={() => { setPresentChapter((c) => c - 1); setPresentVerse(null); }}
                          className="ml-2 rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-400 hover:bg-gray-100 transition"
                        >
                          ← Ch {presentChapter - 1}
                        </button>
                      )}
                      {presentChapter < totalChapters && (
                        <button
                          type="button"
                          onClick={() => { setPresentChapter((c) => c + 1); setPresentVerse(null); }}
                          className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-400 hover:bg-gray-100 transition"
                        >
                          Ch {presentChapter + 1} →
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Add to reading plan */}
                <button
                  type="button"
                  onClick={addCurrentToPlan}
                  disabled={alreadyInPlan}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    alreadyInPlan
                      ? "bg-amber-100 text-amber-700 cursor-default"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                >
                  {alreadyInPlan ? "✓ In Reading Plan" : "📌 Save to Reading Plan"}
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!presentBook && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
              <p className="text-3xl mb-3">📖</p>
              <p className="text-sm font-medium text-gray-600">Search for any verse or passage above</p>
              <p className="text-xs text-gray-400 mt-1">
                Try "John 3:16", "grace", or "In the beginning"
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {["John 3:16", "Psalm 23", "Romans 8", "Isaiah 40:31"].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setQuery(quick)}
                    className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-700 hover:bg-amber-100 transition"
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
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
              <p className="text-3xl mb-3">📌</p>
              <p className="text-sm font-medium text-gray-600">Your reading plan is empty</p>
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
                  onLoad={() => {
                    openPlanEntry(entry);
                    setActiveTab("search");
                  }}
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
