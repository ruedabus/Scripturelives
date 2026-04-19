"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, Circle, BookOpen, Trophy, BarChart2, ChevronDown, ChevronRight, RotateCcw } from "lucide-react";

// ── Bible book data ────────────────────────────────────────────────────────────
interface BibleBook {
  name: string;
  abbr: string;
  chapters: number;
  testament: "OT" | "NT";
  category: string;
}

const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { name: "Genesis",        abbr: "Gen",  chapters: 50, testament: "OT", category: "Law" },
  { name: "Exodus",         abbr: "Exo",  chapters: 40, testament: "OT", category: "Law" },
  { name: "Leviticus",      abbr: "Lev",  chapters: 27, testament: "OT", category: "Law" },
  { name: "Numbers",        abbr: "Num",  chapters: 36, testament: "OT", category: "Law" },
  { name: "Deuteronomy",    abbr: "Deu",  chapters: 34, testament: "OT", category: "Law" },
  { name: "Joshua",         abbr: "Jos",  chapters: 24, testament: "OT", category: "History" },
  { name: "Judges",         abbr: "Jdg",  chapters: 21, testament: "OT", category: "History" },
  { name: "Ruth",           abbr: "Rut",  chapters:  4, testament: "OT", category: "History" },
  { name: "1 Samuel",       abbr: "1Sa",  chapters: 31, testament: "OT", category: "History" },
  { name: "2 Samuel",       abbr: "2Sa",  chapters: 24, testament: "OT", category: "History" },
  { name: "1 Kings",        abbr: "1Ki",  chapters: 22, testament: "OT", category: "History" },
  { name: "2 Kings",        abbr: "2Ki",  chapters: 25, testament: "OT", category: "History" },
  { name: "1 Chronicles",   abbr: "1Ch",  chapters: 29, testament: "OT", category: "History" },
  { name: "2 Chronicles",   abbr: "2Ch",  chapters: 36, testament: "OT", category: "History" },
  { name: "Ezra",           abbr: "Ezr",  chapters: 10, testament: "OT", category: "History" },
  { name: "Nehemiah",       abbr: "Neh",  chapters: 13, testament: "OT", category: "History" },
  { name: "Esther",         abbr: "Est",  chapters: 10, testament: "OT", category: "History" },
  { name: "Job",            abbr: "Job",  chapters: 42, testament: "OT", category: "Poetry" },
  { name: "Psalms",         abbr: "Psa",  chapters: 150, testament: "OT", category: "Poetry" },
  { name: "Proverbs",       abbr: "Pro",  chapters: 31, testament: "OT", category: "Poetry" },
  { name: "Ecclesiastes",   abbr: "Ecc",  chapters: 12, testament: "OT", category: "Poetry" },
  { name: "Song of Solomon",abbr: "Sng",  chapters:  8, testament: "OT", category: "Poetry" },
  { name: "Isaiah",         abbr: "Isa",  chapters: 66, testament: "OT", category: "Major Prophets" },
  { name: "Jeremiah",       abbr: "Jer",  chapters: 52, testament: "OT", category: "Major Prophets" },
  { name: "Lamentations",   abbr: "Lam",  chapters:  5, testament: "OT", category: "Major Prophets" },
  { name: "Ezekiel",        abbr: "Eze",  chapters: 48, testament: "OT", category: "Major Prophets" },
  { name: "Daniel",         abbr: "Dan",  chapters: 12, testament: "OT", category: "Major Prophets" },
  { name: "Hosea",          abbr: "Hos",  chapters: 14, testament: "OT", category: "Minor Prophets" },
  { name: "Joel",           abbr: "Joe",  chapters:  3, testament: "OT", category: "Minor Prophets" },
  { name: "Amos",           abbr: "Amo",  chapters:  9, testament: "OT", category: "Minor Prophets" },
  { name: "Obadiah",        abbr: "Oba",  chapters:  1, testament: "OT", category: "Minor Prophets" },
  { name: "Jonah",          abbr: "Jon",  chapters:  4, testament: "OT", category: "Minor Prophets" },
  { name: "Micah",          abbr: "Mic",  chapters:  7, testament: "OT", category: "Minor Prophets" },
  { name: "Nahum",          abbr: "Nah",  chapters:  3, testament: "OT", category: "Minor Prophets" },
  { name: "Habakkuk",       abbr: "Hab",  chapters:  3, testament: "OT", category: "Minor Prophets" },
  { name: "Zephaniah",      abbr: "Zep",  chapters:  3, testament: "OT", category: "Minor Prophets" },
  { name: "Haggai",         abbr: "Hag",  chapters:  2, testament: "OT", category: "Minor Prophets" },
  { name: "Zechariah",      abbr: "Zec",  chapters: 14, testament: "OT", category: "Minor Prophets" },
  { name: "Malachi",        abbr: "Mal",  chapters:  4, testament: "OT", category: "Minor Prophets" },
  // New Testament
  { name: "Matthew",        abbr: "Mat",  chapters: 28, testament: "NT", category: "Gospels" },
  { name: "Mark",           abbr: "Mrk",  chapters: 16, testament: "NT", category: "Gospels" },
  { name: "Luke",           abbr: "Luk",  chapters: 24, testament: "NT", category: "Gospels" },
  { name: "John",           abbr: "Jhn",  chapters: 21, testament: "NT", category: "Gospels" },
  { name: "Acts",           abbr: "Act",  chapters: 28, testament: "NT", category: "History" },
  { name: "Romans",         abbr: "Rom",  chapters: 16, testament: "NT", category: "Paul's Letters" },
  { name: "1 Corinthians",  abbr: "1Co",  chapters: 16, testament: "NT", category: "Paul's Letters" },
  { name: "2 Corinthians",  abbr: "2Co",  chapters: 13, testament: "NT", category: "Paul's Letters" },
  { name: "Galatians",      abbr: "Gal",  chapters:  6, testament: "NT", category: "Paul's Letters" },
  { name: "Ephesians",      abbr: "Eph",  chapters:  6, testament: "NT", category: "Paul's Letters" },
  { name: "Philippians",    abbr: "Php",  chapters:  4, testament: "NT", category: "Paul's Letters" },
  { name: "Colossians",     abbr: "Col",  chapters:  4, testament: "NT", category: "Paul's Letters" },
  { name: "1 Thessalonians",abbr: "1Th",  chapters:  5, testament: "NT", category: "Paul's Letters" },
  { name: "2 Thessalonians",abbr: "2Th",  chapters:  3, testament: "NT", category: "Paul's Letters" },
  { name: "1 Timothy",      abbr: "1Ti",  chapters:  6, testament: "NT", category: "Paul's Letters" },
  { name: "2 Timothy",      abbr: "2Ti",  chapters:  4, testament: "NT", category: "Paul's Letters" },
  { name: "Titus",          abbr: "Tit",  chapters:  3, testament: "NT", category: "Paul's Letters" },
  { name: "Philemon",       abbr: "Phm",  chapters:  1, testament: "NT", category: "Paul's Letters" },
  { name: "Hebrews",        abbr: "Heb",  chapters: 13, testament: "NT", category: "General Letters" },
  { name: "James",          abbr: "Jas",  chapters:  5, testament: "NT", category: "General Letters" },
  { name: "1 Peter",        abbr: "1Pe",  chapters:  5, testament: "NT", category: "General Letters" },
  { name: "2 Peter",        abbr: "2Pe",  chapters:  3, testament: "NT", category: "General Letters" },
  { name: "1 John",         abbr: "1Jn",  chapters:  5, testament: "NT", category: "General Letters" },
  { name: "2 John",         abbr: "2Jn",  chapters:  1, testament: "NT", category: "General Letters" },
  { name: "3 John",         abbr: "3Jn",  chapters:  1, testament: "NT", category: "General Letters" },
  { name: "Jude",           abbr: "Jud",  chapters:  1, testament: "NT", category: "General Letters" },
  { name: "Revelation",     abbr: "Rev",  chapters: 22, testament: "NT", category: "Prophecy" },
];

const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((s, b) => s + b.chapters, 0);
const STORAGE_KEY = "scripture-lives-reading-progress";

// ── Progress type: Set<"BookAbbr-chapterNum"> ─────────────────────────────────
function loadProgress(): Set<string> {
  try {
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return new Set<string>(arr);
  } catch { return new Set(); }
}
function saveProgress(s: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...s]));
}

// ── Milestone messages ────────────────────────────────────────────────────────
function milestone(pct: number) {
  if (pct >= 100) return { emoji: "🏆", text: "You've read the entire Bible!" };
  if (pct >= 75)  return { emoji: "🌟", text: "Three quarters through — incredible!" };
  if (pct >= 50)  return { emoji: "🔥", text: "Halfway through the Bible!" };
  if (pct >= 25)  return { emoji: "💪", text: "A quarter through — keep going!" };
  if (pct >= 10)  return { emoji: "📖", text: "10% done — great start!" };
  return { emoji: "✨", text: "Every chapter read is a step closer to God." };
}

export default function ReadingProgress() {
  const [progress, setProgress] = useState<Set<string>>(loadProgress);
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [activeTestament, setActiveTestament] = useState<"all" | "OT" | "NT">("all");

  const totalRead = progress.size;
  const pct = Math.round((totalRead / TOTAL_CHAPTERS) * 100);
  const m = milestone(pct);

  function toggleChapter(abbr: string, chapter: number) {
    const key = `${abbr}-${chapter}`;
    const next = new Set(progress);
    next.has(key) ? next.delete(key) : next.add(key);
    setProgress(next);
    saveProgress(next);
  }

  function markBookComplete(book: BibleBook) {
    const next = new Set(progress);
    for (let c = 1; c <= book.chapters; c++) next.add(`${book.abbr}-${c}`);
    setProgress(next);
    saveProgress(next);
  }

  function unmarkBook(book: BibleBook) {
    const next = new Set(progress);
    for (let c = 1; c <= book.chapters; c++) next.delete(`${book.abbr}-${c}`);
    setProgress(next);
    saveProgress(next);
  }

  function bookRead(book: BibleBook) {
    return Array.from({ length: book.chapters }, (_, i) => progress.has(`${book.abbr}-${i + 1}`)).filter(Boolean).length;
  }

  const filteredBooks = useMemo(() =>
    activeTestament === "all" ? BIBLE_BOOKS : BIBLE_BOOKS.filter((b) => b.testament === activeTestament),
    [activeTestament]
  );

  // Group by category
  const categories = useMemo(() => {
    const map = new Map<string, BibleBook[]>();
    for (const book of filteredBooks) {
      if (!map.has(book.category)) map.set(book.category, []);
      map.get(book.category)!.push(book);
    }
    return map;
  }, [filteredBooks]);

  // Stats
  const ntRead = BIBLE_BOOKS.filter((b) => b.testament === "NT").reduce((s, b) => s + bookRead(b), 0);
  const ntTotal = BIBLE_BOOKS.filter((b) => b.testament === "NT").reduce((s, b) => s + b.chapters, 0);
  const otRead = BIBLE_BOOKS.filter((b) => b.testament === "OT").reduce((s, b) => s + bookRead(b), 0);
  const otTotal = BIBLE_BOOKS.filter((b) => b.testament === "OT").reduce((s, b) => s + b.chapters, 0);
  const booksCompleted = BIBLE_BOOKS.filter((b) => bookRead(b) === b.chapters).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2"><BarChart2 size={18} /> Reading Progress</h2>
        <p className="text-xs text-gray-400 mt-0.5">Track every chapter you've read through the Bible</p>
      </div>

      {/* Overall progress */}
      <div className="rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-3xl font-bold text-amber-400">{pct}%</p>
            <p className="text-sm text-stone-300">{totalRead} of {TOTAL_CHAPTERS} chapters</p>
          </div>
          <span className="text-4xl">{m.emoji}</span>
        </div>
        <div className="h-2.5 bg-stone-700 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-stone-400 italic">{m.text}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-3 text-center">
          <p className="text-lg font-bold text-blue-600">{booksCompleted}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Books done</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-3 text-center">
          <p className="text-lg font-bold text-amber-600">{otRead}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">OT chapters</p>
        </div>
        <div className="rounded-xl bg-purple-50 border border-purple-100 px-3 py-3 text-center">
          <p className="text-lg font-bold text-purple-600">{ntRead}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">NT chapters</p>
        </div>
      </div>

      {/* Testament filter */}
      <div className="flex gap-2">
        {(["all", "OT", "NT"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTestament(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${
              activeTestament === t
                ? "bg-amber-500 border-amber-500 text-stone-900"
                : "border-gray-200 text-gray-500 hover:border-amber-300"
            }`}
          >
            {t === "all" ? "All Books" : t === "OT" ? "Old Testament" : "New Testament"}
          </button>
        ))}
      </div>

      {/* Reset link */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all reading progress? This cannot be undone.")) {
              const empty = new Set<string>();
              setProgress(empty);
              saveProgress(empty);
            }
          }}
          className="flex items-center gap-1 text-xs text-gray-300 hover:text-red-400 transition"
        >
          <RotateCcw size={11} /> Reset progress
        </button>
      </div>

      {/* Books by category */}
      {[...categories.entries()].map(([category, books]) => {
        const catRead = books.reduce((s, b) => s + bookRead(b), 0);
        const catTotal = books.reduce((s, b) => s + b.chapters, 0);
        const catPct = Math.round((catRead / catTotal) * 100);

        return (
          <div key={category}>
            {/* Category header */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{category}</p>
              <span className="text-xs text-gray-400">{catRead}/{catTotal} ch · {catPct}%</span>
            </div>

            {/* Book rows */}
            <div className="space-y-1.5">
              {books.map((book) => {
                const read = bookRead(book);
                const bookPct = Math.round((read / book.chapters) * 100);
                const isExpanded = expandedBook === book.name;
                const completed = read === book.chapters;

                return (
                  <div key={book.name} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    {/* Book header */}
                    <div
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition"
                      onClick={() => setExpandedBook(isExpanded ? null : book.name)}
                    >
                      {completed ? (
                        <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                      ) : (
                        <Circle size={16} className={`shrink-0 ${read > 0 ? "text-amber-400" : "text-gray-200"}`} />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800 truncate">{book.name}</span>
                          <span className="text-xs text-gray-400 shrink-0 ml-2">{read}/{book.chapters}</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${completed ? "bg-green-400" : "bg-amber-400"}`}
                            style={{ width: `${bookPct}%` }}
                          />
                        </div>
                      </div>

                      {isExpanded ? <ChevronDown size={13} className="text-gray-300 shrink-0" /> : <ChevronRight size={13} className="text-gray-300 shrink-0" />}
                    </div>

                    {/* Chapter grid */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-3 py-3">
                        <div className="flex justify-between mb-3">
                          <button
                            type="button"
                            onClick={() => markBookComplete(book)}
                            className="text-xs text-green-600 hover:text-green-700 font-medium transition"
                          >
                            ✓ Mark all read
                          </button>
                          <button
                            type="button"
                            onClick={() => unmarkBook(book)}
                            className="text-xs text-gray-300 hover:text-red-400 transition"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.from({ length: book.chapters }, (_, i) => {
                            const ch = i + 1;
                            const key = `${book.abbr}-${ch}`;
                            const done = progress.has(key);
                            return (
                              <button
                                key={ch}
                                type="button"
                                onClick={() => toggleChapter(book.abbr, ch)}
                                title={`Chapter ${ch}`}
                                className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                                  done
                                    ? "bg-green-100 text-green-700 border border-green-200 hover:bg-red-50 hover:text-red-400 hover:border-red-200"
                                    : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                                }`}
                              >
                                {ch}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
