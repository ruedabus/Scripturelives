"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

type BibleVersion = "KJV" | "ASV" | "WEB" | "NIV" | "NLT" | "AMP";

type BibleVerse = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
};

type BookInfo = {
  name: string;
  chapters: number;
};


const LOCAL_VERSIONS: BibleVersion[] = ["KJV", "ASV", "WEB"];
const CLOUD_VERSIONS: BibleVersion[] = ["NIV", "NLT", "AMP"];
const VERSIONS: BibleVersion[] = [...LOCAL_VERSIONS, ...CLOUD_VERSIONS];

const VERSION_LABELS: Record<BibleVersion, string> = {
  KJV: "King James Version",
  ASV: "American Standard Version",
  WEB: "World English Bible",
  NIV: "New International Version",
  NLT: "New Living Translation",
  AMP: "Amplified Bible",
};

const OT_BOOKS = new Set([
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Psalm","Proverbs","Ecclesiastes",
  "Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea",
  "Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah",
  "Haggai","Zechariah","Malachi",
]);

// ---------------------------------------------------------------------------
// Biblical terms that are visually interesting — for "Visual Mode"
// ---------------------------------------------------------------------------
const VISUAL_TERMS = [
  "tabernacle", "ark of the covenant", "temple", "menorah", "altar",
  "high priest", "holy of holies", "passover", "manna", "burning bush",
  "golden calf", "ten commandments", "sabbath", "synagogue", "sanhedrin",
  "pharisee", "sadducee", "levite", "ephod", "breastplate",
  "moses", "abraham", "david", "solomon", "elijah", "daniel", "noah",
  "joseph", "john the baptist", "mary magdalene", "mary", "paul", "peter",
  "herod", "nebuchadnezzar", "pilate",
  "jerusalem", "bethlehem", "nazareth", "galilee", "jordan river",
  "sea of galilee", "dead sea", "mount sinai", "mount of olives",
  "calvary", "golgotha", "garden of gethsemane", "garden of eden",
  "noah's ark", "tower of babel", "crucifixion", "resurrection",
  "baptism", "last supper", "pentecost", "covenant",
];

function highlightTerms(text: string, onTerm: (term: string) => void): React.ReactNode {
  const sorted = [...VISUAL_TERMS].sort((a, b) => b.length - a.length);
  const pattern = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${pattern})`, "gi");

  const parts = text.split(regex);
  return parts.map((part, i) => {
    const lower = part.toLowerCase();
    if (VISUAL_TERMS.includes(lower)) {
      return (
        <button
          key={i}
          type="button"
          onClick={() => onTerm(lower)}
          className="text-amber-600 underline decoration-dotted underline-offset-2 hover:text-amber-600 transition"
          title={`View visual reference for "${part}"`}
        >
          {part}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ---------------------------------------------------------------------------
// Paragraph grouping — gives the text a book-like feel
// Detects natural narrative/dialogue breaks from KJV text patterns.
// Poetry books (Psalms, Proverbs, Job, etc.) get one verse per line instead.
// ---------------------------------------------------------------------------
const POETRY_BOOKS = new Set([
  "Psalms","Psalm","Proverbs","Job","Song of Solomon",
  "Lamentations","Ecclesiastes",
]);

// Words/phrases that signal the start of a new paragraph in narrative text
const PARA_BREAK_RE = /^(And it came to pass|Now |Then |After |So |But |Therefore |When |While |In those |At that |Thus |Thus says|And the LORD said|And God said|And Jesus|And he said|And she said|And they said|And Moses|And David|And the Lord|The LORD said|God said|Jesus said|Jesus answered|Jesus replied|He said|She said|They said|And there |And behold|Behold,|And when |And as |In the beginning|And Aaron|And Samuel|And Saul|And Solomon|And Elijah|And Paul|And Peter|And John|The word of the LORD)/i;

function groupIntoParagraphs(verses: BibleVerse[], book: string): BibleVerse[][] {
  // Poetry: every verse is its own "paragraph" (one per line)
  if (POETRY_BOOKS.has(book)) {
    return verses.map((v) => [v]);
  }

  const paragraphs: BibleVerse[][] = [];
  let current: BibleVerse[] = [];

  verses.forEach((verse, i) => {
    const startsNew = i === 0 || PARA_BREAK_RE.test(verse.text.trim());
    // Don't break if the current paragraph only has 1 verse (avoid orphans)
    if (startsNew && i > 0 && current.length >= 2) {
      paragraphs.push(current);
      current = [verse];
    } else {
      current.push(verse);
    }
  });

  if (current.length > 0) paragraphs.push(current);
  return paragraphs;
}

// ---------------------------------------------------------------------------
// Render a verse in Word Study mode — every word is clickable
// Splits verse text into word tokens and renders each as a button
// ---------------------------------------------------------------------------
function WordStudyVerse({
  verseNum,
  text,
  book,
  onWordClick,
}: {
  verseNum: number;
  text: string;
  book: string;
  onWordClick: (word: string, book: string) => void;
}) {
  // Split text into word + non-word segments, preserving punctuation/spaces
  const parts = text.split(/(\b[A-Za-z'']+\b)/);
  return (
    <span>
      <sup className="mr-1 text-xs font-bold text-amber-600">{verseNum}</sup>
      {parts.map((part, i) => {
        if (/^[A-Za-z'']+$/.test(part)) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onWordClick(part, book)}
              className="text-sky-600 hover:text-sky-700 hover:underline decoration-dotted underline-offset-2 transition"
              title={`Look up "${part}" in Hebrew/Greek lexicon`}
            >
              {part}
            </button>
          );
        }
        return <span key={i}>{part}</span>;
      })}{" "}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type NavTarget = {
  version: BibleVersion;
  book: string;
  chapter: number;
} | null;

type ReadingMode = "visual" | "wordstudy";

type Props = {
  navTarget?: NavTarget;
  onNavConsumed?: () => void;
  onVisualSearch?: (term: string) => void;
  onWordClick?: (word: string, book: string) => void;
  onChapterChange?: (book: string, chapter: number) => void;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function FullBibleReader({
  navTarget,
  onNavConsumed,
  onVisualSearch,
  onWordClick,
  onChapterChange,
}: Props) {
  const [version, setVersion] = useState<BibleVersion>("KJV");
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [totalChapters, setTotalChapters] = useState<number>(1);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPicker, setShowPicker] = useState(true);

  // Stable refs for callbacks — prevents infinite loops when parents pass
  // inline arrow functions that get a new reference on every render.
  const onChapterChangeRef = useRef(onChapterChange);
  const onNavConsumedRef = useRef(onNavConsumed);
  useEffect(() => { onChapterChangeRef.current = onChapterChange; });
  useEffect(() => { onNavConsumedRef.current = onNavConsumed; });

  // Word Study
  const [readingMode, setReadingMode] = useState<ReadingMode>("visual");

  // Load book list when version changes
  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/bible?version=${version}`)
      .then((r) => r.json())
      .then((data) => {
        const bookList: BookInfo[] = data.books ?? [];
        setBooks(bookList);
        const first = bookList[0]?.name ?? "";
        setSelectedBook((prev) => (bookList.find((b) => b.name === prev) ? prev : first));
      })
      .catch(() => setError("Failed to load book list."))
      .finally(() => setLoading(false));
  }, [version]);

  // Load chapter when book or version changes
  const fetchChapter = useCallback(
    (book: string, chapter: number, ver: BibleVersion) => {
      if (!book) return;
      setLoading(true);
      setError("");
      fetch(`/api/bible?version=${ver}&book=${encodeURIComponent(book)}&chapter=${chapter}`)
        .then((r) => r.json())
        .then((data) => {
          setVerses(data.verses ?? []);
          setTotalChapters(data.totalChapters ?? 1);
        })
        .catch(() => setError("Failed to load chapter."))
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    if (selectedBook) {
      fetchChapter(selectedBook, selectedChapter, version);
      onChapterChangeRef.current?.(selectedBook, selectedChapter);
    }
  }, [selectedBook, selectedChapter, version, fetchChapter]);

  // Apply external navigation from search results
  useEffect(() => {
    if (!navTarget) return;
    setVersion(navTarget.version);
    setSelectedBook(navTarget.book);
    setSelectedChapter(navTarget.chapter);
    setShowPicker(false);
    onNavConsumedRef.current?.();
  }, [navTarget]);


  const handleBookChange = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setShowPicker(false);
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) setSelectedChapter((c) => c - 1);
  };

  const handleNextChapter = () => {
    if (selectedChapter < totalChapters) setSelectedChapter((c) => c + 1);
  };

  const handleModeToggle = (mode: ReadingMode) => {
    setReadingMode(mode);
  };

  const isWordStudyMode = readingMode === "wordstudy" && version === "KJV";

  const otBooks = books.filter((b) => OT_BOOKS.has(b.name));
  const ntBooks = books.filter((b) => !OT_BOOKS.has(b.name));

  // ── BOOK PICKER (hero view) ─────────────────────────────────────────────
  if (showPicker) {
    return (
      <div className="rounded-2xl overflow-hidden">
        {/* Hero background */}
        <div
          className="relative min-h-[520px] flex flex-col"
          style={{
            backgroundImage: "url('/bible-hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/75 to-stone-950/90" />

          <div className="relative z-10 px-6 pt-7 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-amber-400 tracking-wide">Holy Bible</h2>
                <p className="text-xs text-stone-400 mt-0.5">Select a book to begin reading</p>
              </div>
              {/* Version toggle — two rows: Local | Licensed */}
              <div className="flex flex-col gap-1">
                <div className="flex gap-1 rounded-lg bg-stone-800/80 border border-stone-700 p-1">
                  {LOCAL_VERSIONS.map((v) => (
                    <button key={v} type="button" onClick={() => setVersion(v)}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition ${version === v ? "bg-amber-500 text-stone-900" : "text-stone-400 hover:text-white"}`}>
                      {v}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 rounded-lg bg-stone-800/80 border border-sky-800 p-1">
                  {CLOUD_VERSIONS.map((v) => (
                    <button key={v} type="button" onClick={() => setVersion(v)}
                      title={VERSION_LABELS[v]}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition ${version === v ? "bg-sky-500 text-white" : "text-stone-400 hover:text-sky-300"}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-amber-600/40" />
              <span className="text-amber-500 text-xs font-bold uppercase tracking-[0.2em]">Old Testament</span>
              <div className="flex-1 h-px bg-amber-600/40" />
            </div>

            {/* OT Books grid */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-1 mb-6">
              {otBooks.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => handleBookChange(b.name)}
                  className="text-left text-sm text-stone-300 hover:text-amber-400 transition py-0.5 truncate font-medium tracking-wide uppercase text-[11px]"
                >
                  {b.name}
                </button>
              ))}
            </div>

            {/* NT divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-amber-600/40" />
              <span className="text-amber-500 text-xs font-bold uppercase tracking-[0.2em]">New Testament</span>
              <div className="flex-1 h-px bg-amber-600/40" />
            </div>

            {/* NT Books grid */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-1">
              {ntBooks.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => handleBookChange(b.name)}
                  className="text-left text-sm text-stone-300 hover:text-amber-400 transition py-0.5 truncate font-medium tracking-wide uppercase text-[11px]"
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── READING VIEW ────────────────────────────────────────────────────────
  return (
    <div className="space-y-0 rounded-2xl overflow-hidden border border-stone-200">

      {/* Dark header bar */}
      <div className="bg-stone-900 px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white transition"
          >
            ☰ Books
          </button>
          <div>
            <h2 className="text-base font-bold text-amber-400">
              {selectedBook} {selectedChapter}
            </h2>
            <p className="text-[10px] text-stone-500">{VERSION_LABELS[version]}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Version — Local row + Licensed row */}
          <div className="flex flex-col gap-0.5">
            <div className="flex gap-0.5 rounded-lg bg-stone-800 border border-stone-700 p-0.5">
              {LOCAL_VERSIONS.map((v) => (
                <button key={v} type="button" onClick={() => setVersion(v)}
                  className={`rounded-md px-2 py-1 text-[10px] font-bold transition ${version === v ? "bg-amber-500 text-stone-900" : "text-stone-400 hover:text-white"}`}>
                  {v}
                </button>
              ))}
            </div>
            <div className="flex gap-0.5 rounded-lg bg-stone-800 border border-sky-800 p-0.5">
              {CLOUD_VERSIONS.map((v) => (
                <button key={v} type="button" onClick={() => setVersion(v)}
                  title={VERSION_LABELS[v]}
                  className={`rounded-md px-2 py-1 text-[10px] font-bold transition ${version === v ? "bg-sky-500 text-white" : "text-stone-400 hover:text-sky-300"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter nav */}
          <div className="flex items-center gap-1">
            <button type="button" onClick={handlePrevChapter} disabled={selectedChapter <= 1}
              className="rounded-lg bg-stone-700 hover:bg-stone-600 px-2.5 py-1.5 text-sm text-stone-300 disabled:opacity-30 transition">
              ‹
            </button>
            <select value={selectedChapter} onChange={(e) => setSelectedChapter(Number(e.target.value))}
              className="rounded-lg bg-stone-700 border-none px-2 py-1.5 text-xs font-semibold text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500">
              {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
                <option key={ch} value={ch}>Ch. {ch}</option>
              ))}
            </select>
            <button type="button" onClick={handleNextChapter} disabled={selectedChapter >= totalChapters}
              className="rounded-lg bg-stone-700 hover:bg-stone-600 px-2.5 py-1.5 text-sm text-stone-300 disabled:opacity-30 transition">
              ›
            </button>
          </div>

          {/* Reading mode */}
          <div className="flex gap-1 rounded-lg bg-stone-800 border border-stone-700 p-0.5">
            <button type="button" onClick={() => handleModeToggle("visual")}
              title="Tap highlighted terms for visual references"
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${readingMode === "visual" ? "bg-amber-500 text-stone-900" : "text-stone-400 hover:text-white"}`}>
              Visual
            </button>
            <button type="button" onClick={() => handleModeToggle("wordstudy")}
              title={version !== "KJV" ? "Switch to KJV for Word Study" : "Tap words to see Hebrew/Greek roots"}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${readingMode === "wordstudy" ? "bg-sky-500 text-white" : "text-stone-400 hover:text-white"} ${version !== "KJV" ? "opacity-40 cursor-not-allowed" : ""}`}>
              Word Study
            </button>
          </div>
        </div>
      </div>

      {/* Reading area */}
      <div className="bg-[#faf8f3] px-6 py-6 min-h-[400px]">
        {loading && <div className="py-12 text-center text-stone-400 text-sm">Loading…</div>}
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        {!loading && !error && verses.length > 0 && (
          <>
            {/* Mode hint */}
            {readingMode === "visual" && onVisualSearch && (
              <p className="mb-4 text-xs text-stone-400 italic">Tap highlighted terms to see visual references</p>
            )}
            {isWordStudyMode && (
              <p className="mb-4 text-xs text-stone-400 italic">Tap any word to see its Hebrew or Greek root</p>
            )}

            <div className="font-serif text-[16px] text-stone-800 leading-[1.9]">
              {isWordStudyMode ? (
                <div className="space-y-2">
                  {verses.map((v) => (
                    <div key={v.id}>
                      <WordStudyVerse verseNum={v.verse} text={v.text} book={selectedBook}
                        onWordClick={(word, book) => onWordClick?.(word, book)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {groupIntoParagraphs(verses, selectedBook).map((para, pi) => {
                    const isPoetry = POETRY_BOOKS.has(selectedBook);
                    return (
                      <p key={pi} className={isPoetry ? "border-l-2 border-amber-300 pl-4 italic text-stone-600" : "indent-6"}>
                        {para.map((v) => (
                          <span key={v.id}>
                            <sup className="mr-[2px] ml-[1px] text-[10px] font-bold text-amber-600 not-italic select-none align-top leading-none">{v.verse}</sup>
                            {readingMode === "visual" && onVisualSearch ? highlightTerms(v.text, onVisualSearch) : v.text}{" "}
                          </span>
                        ))}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom chapter nav */}
      {!loading && verses.length > 0 && (
        <div className="bg-stone-900 flex justify-between px-5 py-3">
          <button type="button" onClick={handlePrevChapter} disabled={selectedChapter <= 1}
            className="flex items-center gap-2 rounded-lg bg-stone-700 hover:bg-stone-600 px-4 py-2 text-sm font-semibold text-stone-300 hover:text-white disabled:opacity-30 transition">
            ← Previous
          </button>
          <span className="text-stone-500 text-xs self-center">{selectedBook} · Ch. {selectedChapter} of {totalChapters}</span>
          <button type="button" onClick={handleNextChapter} disabled={selectedChapter >= totalChapters}
            className="flex items-center gap-2 rounded-lg bg-stone-700 hover:bg-stone-600 px-4 py-2 text-sm font-semibold text-stone-300 hover:text-white disabled:opacity-30 transition">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
