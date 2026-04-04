"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

type BibleVersion = "KJV" | "ASV" | "WEB";

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


const VERSIONS: BibleVersion[] = ["KJV", "ASV", "WEB"];

const VERSION_LABELS: Record<BibleVersion, string> = {
  KJV: "King James Version",
  ASV: "American Standard Version",
  WEB: "World English Bible",
};

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
    onNavConsumedRef.current?.();
  }, [navTarget]);


  const handleBookChange = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(1);
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

  return (
    <div className="space-y-4">
      {/* Version selector */}
      <div className="flex flex-wrap gap-2">
        {VERSIONS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVersion(v)}
            title={VERSION_LABELS[v]}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              version === v
                ? "bg-amber-500 text-gray-900"
                : "border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Book + Chapter selectors */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedBook}
          onChange={(e) => handleBookChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
        >
          {books.map((b) => (
            <option key={b.name} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevChapter}
            disabled={selectedChapter <= 1}
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
          >
            ‹
          </button>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
              <option key={ch} value={ch}>
                Chapter {ch}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleNextChapter}
            disabled={selectedChapter >= totalChapters}
            className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>

      {/* Reading mode toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-100 p-1 w-fit">
        <button
          type="button"
          onClick={() => handleModeToggle("visual")}
          title="Tap highlighted terms to see visual references"
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
            readingMode === "visual"
              ? "bg-amber-500 text-gray-900"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          🖼 Visual Mode
        </button>
        <button
          type="button"
          onClick={() => handleModeToggle("wordstudy")}
          title={version !== "KJV" ? "Switch to KJV to use Word Study" : "Tap words to see Hebrew/Greek roots"}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
            readingMode === "wordstudy"
              ? "bg-sky-600 text-white"
              : "text-gray-500 hover:text-gray-800"
          } ${version !== "KJV" ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          🔤 Word Study
        </button>
      </div>

      {/* Chapter heading */}
      {selectedBook && (
        <div className="border-b border-gray-200 pb-2">
          <h2 className="text-lg font-semibold text-amber-700">
            {selectedBook} {selectedChapter}
          </h2>
          <p className="text-xs text-gray-400">{VERSION_LABELS[version]}</p>
        </div>
      )}

      {/* Mode hints */}
      {!loading && !error && verses.length > 0 && (
        <div>
          {readingMode === "visual" && onVisualSearch && (
            <p className="mb-3 text-xs text-gray-400 italic">
              💡 Tap highlighted terms to see visual references
            </p>
          )}
          {readingMode === "wordstudy" && version !== "KJV" && (
            <div className="mb-3 rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-xs text-gray-500">
              🔤 Word Study searches Hebrew &amp; Greek roots via the KJV. Switch to KJV to tap any word and see its original root.
            </div>
          )}
          {isWordStudyMode && (
            <p className="mb-3 text-xs text-gray-400 italic">
              🔤 Tap any word to see its Hebrew or Greek root
            </p>
          )}
        </div>
      )}

      {/* Verse display */}
      {loading && (
        <div className="py-8 text-center text-gray-400">Loading…</div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="font-serif text-[15px] text-gray-800">
          {isWordStudyMode ? (
            // Word Study mode — every word clickable, one verse per line
            <div className="space-y-2 leading-8">
              {verses.map((v) => (
                <div key={v.id}>
                  <WordStudyVerse
                    verseNum={v.verse}
                    text={v.text}
                    book={selectedBook}
                    onWordClick={(word, book) => onWordClick?.(word, book)}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Book layout — verses grouped into paragraphs
            <div className="space-y-4 leading-8">
              {groupIntoParagraphs(verses, selectedBook).map((para, pi) => {
                const isPoetry = POETRY_BOOKS.has(selectedBook);
                return (
                  <p
                    key={pi}
                    className={isPoetry
                      ? "border-l-2 border-amber-200/40 pl-4 italic text-gray-600"
                      : "indent-6"
                    }
                  >
                    {para.map((v) => (
                      <span key={v.id}>
                        <sup className="mr-[2px] ml-[1px] text-[10px] font-bold text-amber-600 not-italic select-none align-top leading-none">
                          {v.verse}
                        </sup>
                        {readingMode === "visual" && onVisualSearch
                          ? highlightTerms(v.text, onVisualSearch)
                          : v.text}{" "}
                      </span>
                    ))}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Chapter navigation at bottom */}
      {!loading && verses.length > 0 && (
        <div className="flex justify-between border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={handlePrevChapter}
            disabled={selectedChapter <= 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
          >
            ← Previous Chapter
          </button>
          <button
            type="button"
            onClick={handleNextChapter}
            disabled={selectedChapter >= totalChapters}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-30"
          >
            Next Chapter →
          </button>
        </div>
      )}
    </div>
  );
}
