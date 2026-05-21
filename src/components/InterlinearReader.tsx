"use client";

import { useState, useEffect, useCallback } from "react";
import type { InterlinearWord, InterlinearVerse } from "@/app/api/interlinear/route";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const OT_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
  "Joshua","Judges","Ruth","1 Samuel","2 Samuel",
  "1 Kings","2 Kings","1 Chronicles","2 Chronicles",
  "Ezra","Nehemiah","Esther","Job","Psalm","Proverbs",
  "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah",
  "Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk",
  "Zephaniah","Haggai","Zechariah","Malachi",
];

const NT_BOOKS = [
  "Matthew","Mark","Luke","John","Acts","Romans",
  "1 Corinthians","2 Corinthians","Galatians","Ephesians",
  "Philippians","Colossians","1 Thessalonians","2 Thessalonians",
  "1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James",
  "1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation",
];

const ALL_BOOKS = [...OT_BOOKS, ...NT_BOOKS];

// Chapter counts (abbreviated — full list for common books)
const CHAPTER_COUNTS: Record<string, number> = {
  "Genesis":50,"Exodus":40,"Leviticus":27,"Numbers":36,"Deuteronomy":34,
  "Joshua":24,"Judges":21,"Ruth":4,"1 Samuel":31,"2 Samuel":24,
  "1 Kings":22,"2 Kings":25,"1 Chronicles":29,"2 Chronicles":36,
  "Ezra":10,"Nehemiah":13,"Esther":10,"Job":42,"Psalm":150,"Proverbs":31,
  "Ecclesiastes":12,"Song of Solomon":8,"Isaiah":66,"Jeremiah":52,
  "Lamentations":5,"Ezekiel":48,"Daniel":12,"Hosea":14,"Joel":3,
  "Amos":9,"Obadiah":1,"Jonah":4,"Micah":7,"Nahum":3,"Habakkuk":3,
  "Zephaniah":3,"Haggai":2,"Zechariah":14,"Malachi":4,
  "Matthew":28,"Mark":16,"Luke":24,"John":21,"Acts":28,"Romans":16,
  "1 Corinthians":16,"2 Corinthians":13,"Galatians":6,"Ephesians":6,
  "Philippians":4,"Colossians":4,"1 Thessalonians":5,"2 Thessalonians":3,
  "1 Timothy":6,"2 Timothy":4,"Titus":3,"Philemon":1,"Hebrews":13,
  "James":5,"1 Peter":5,"2 Peter":3,"1 John":5,"2 John":1,"3 John":1,
  "Jude":1,"Revelation":22,
};

// ── Word chip ────────────────────────────────────────────────────────────────

function WordChip({
  word,
  isOT,
  onOpenLexicon,
}: {
  word: InterlinearWord;
  isOT: boolean;
  onOpenLexicon: (strongs: string, original: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasData = !!word.strongs;
  const langColor = isOT ? "#92400e" : "#1e40af"; // amber-800 or blue-800
  const langBg    = isOT ? "#fef3c7" : "#dbeafe"; // amber-100 or blue-100

  return (
    <div className="inline-flex flex-col items-center select-none">
      {/* Stacked interlinear card */}
      <button
        type="button"
        onClick={() => hasData && setExpanded((e) => !e)}
        className={`flex flex-col items-center rounded-lg px-2 py-1.5 transition
          ${hasData ? "cursor-pointer hover:shadow-md active:scale-95" : "cursor-default"}
          ${expanded ? "ring-2" : ""}
        `}
        style={{
          background: expanded ? langBg : "white",
          border: `1px solid ${expanded ? langColor : "#e5e7eb"}`,
          minWidth: "48px",
          outline: expanded ? `2px solid ${langColor}` : "none",
        }}
        title={hasData ? `${word.strongs} — tap for details` : word.english}
      >
        {/* Original language (top) */}
        {word.original ? (
          <span
            className="font-bold leading-tight text-center"
            style={{
              color: langColor,
              fontSize: isOT ? "1rem" : "0.95rem",
              fontFamily: isOT ? "'SBL Hebrew', 'Ezra SIL', serif" : "'SBL Greek', 'GFS Artemisia', serif",
              direction: isOT ? "rtl" : "ltr",
            }}
          >
            {word.original}
          </span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}

        {/* Transliteration */}
        {word.xlit && (
          <span className="text-[10px] italic mt-0.5" style={{ color: "#6b7280" }}>
            {word.xlit}
          </span>
        )}

        {/* Strong's number */}
        {word.strongs && (
          <span
            className="text-[9px] font-black rounded px-1 mt-0.5"
            style={{ background: langBg, color: langColor }}
          >
            {word.strongs}
          </span>
        )}

        {/* English word (bottom) */}
        <span className="text-xs font-semibold mt-1" style={{ color: NAVY }}>
          {word.english.replace(/[^\w']/g, "")}
        </span>
      </button>

      {/* Inline definition expand */}
      {expanded && hasData && (
        <div
          className="absolute z-20 mt-1 rounded-xl shadow-xl p-3 text-left"
          style={{
            background: "white",
            border: `1px solid ${langColor}`,
            width: "220px",
            top: "calc(100% + 4px)",
          }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p
                className="text-lg font-bold"
                style={{ color: langColor, direction: isOT ? "rtl" : "ltr" }}
              >
                {word.original}
              </p>
              <p className="text-xs text-gray-500 italic">{word.xlit}</p>
            </div>
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
              style={{ background: langBg, color: langColor }}
            >
              {word.strongs}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{word.gloss}</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpenLexicon(word.strongs, word.original); }}
            className="w-full text-xs font-black py-1.5 rounded-lg transition hover:opacity-90"
            style={{ background: NAVY, color: GOLD }}
          >
            Full Lexicon Entry →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Verse row ────────────────────────────────────────────────────────────────

function VerseRow({
  verse,
  onOpenLexicon,
}: {
  verse: InterlinearVerse;
  onOpenLexicon: (strongs: string, original: string) => void;
}) {
  return (
    <div className="mb-6">
      <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: GOLD }}>
        {verse.ref}
      </p>
      <div
        className="flex flex-wrap gap-1.5 p-3 rounded-xl"
        style={{
          background: "#f9f7f2",
          border: "1px solid #ede8de",
          direction: verse.isOT ? "rtl" : "ltr",
        }}
      >
        {verse.words.map((w, i) => (
          <div key={i} className="relative">
            <WordChip word={w} isOT={verse.isOT} onOpenLexicon={onOpenLexicon} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function InterlinearReader({
  onOpenLexicon,
}: {
  onOpenLexicon?: (word: string, book: string) => void;
}) {
  const [book,    setBook]    = useState("John");
  const [chapter, setChapter] = useState(3);
  const [verse,   setVerse]   = useState<number | null>(null); // null = whole chapter
  const [verses,  setVerses]  = useState<InterlinearVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [source,  setSource]  = useState<"step" | "local" | "">("");

  const isOT    = OT_BOOKS.includes(book);
  const chapters = CHAPTER_COUNTS[book] ?? 50;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        book,
        chapter: String(chapter),
        ...(verse != null ? { verse: String(verse) } : {}),
      });
      const res  = await fetch(`/api/interlinear?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setVerses(data.verses ?? []);
      setSource(data.source ?? "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not load interlinear data.");
    } finally {
      setLoading(false);
    }
  }, [book, chapter, verse]);

  useEffect(() => { load(); }, [load]);

  const handleOpenLexicon = (strongs: string, _original: string) => {
    onOpenLexicon?.(strongs, book);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div
        className="shrink-0 px-4 py-3"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🔤</span>
          <p className="text-white font-black text-sm">
            {isOT ? "Hebrew" : "Greek"} Interlinear
          </p>
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full"
            style={{ background: GOLD, color: NAVY }}
          >
            {isOT ? "OT" : "NT"}
          </span>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          Word-by-word original language with transliteration &amp; Strong&apos;s numbers
        </p>
      </div>

      {/* ── Controls ── */}
      <div
        className="shrink-0 px-4 py-3 flex flex-wrap gap-2"
        style={{ background: "#f0ebe3", borderBottom: "1px solid #ede8de" }}
      >
        {/* Book */}
        <select
          value={book}
          onChange={(e) => { setBook(e.target.value); setChapter(1); setVerse(null); }}
          className="flex-1 min-w-[120px] text-xs font-semibold rounded-lg px-2 py-1.5 outline-none"
          style={{ background: "white", color: NAVY, border: "1px solid #ede8de" }}
        >
          <optgroup label="Old Testament">
            {OT_BOOKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </optgroup>
          <optgroup label="New Testament">
            {NT_BOOKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </optgroup>
        </select>

        {/* Chapter */}
        <select
          value={chapter}
          onChange={(e) => { setChapter(Number(e.target.value)); setVerse(null); }}
          className="text-xs font-semibold rounded-lg px-2 py-1.5 outline-none"
          style={{ background: "white", color: NAVY, border: "1px solid #ede8de", minWidth: "70px" }}
        >
          {Array.from({ length: chapters }, (_, i) => i + 1).map((c) => (
            <option key={c} value={c}>Ch. {c}</option>
          ))}
        </select>

        {/* Verse (optional) */}
        <select
          value={verse ?? ""}
          onChange={(e) => setVerse(e.target.value ? Number(e.target.value) : null)}
          className="text-xs font-semibold rounded-lg px-2 py-1.5 outline-none"
          style={{ background: "white", color: NAVY, border: "1px solid #ede8de", minWidth: "90px" }}
        >
          <option value="">All verses</option>
          {Array.from({ length: 50 }, (_, i) => i + 1).map((v) => (
            <option key={v} value={v}>Verse {v}</option>
          ))}
        </select>
      </div>

      {/* ── Legend ── */}
      <div
        className="shrink-0 px-4 py-2 flex flex-wrap gap-3"
        style={{ background: "#faf8f3", borderBottom: "1px solid #ede8de" }}
      >
        {[
          { label: isOT ? "Hebrew" : "Greek", color: isOT ? "#92400e" : "#1e40af", bg: isOT ? "#fef3c7" : "#dbeafe" },
          { label: "Transliteration", color: "#6b7280", bg: "transparent" },
          { label: "Strong's #", color: isOT ? "#92400e" : "#1e40af", bg: isOT ? "#fef3c7" : "#dbeafe" },
          { label: "English (KJV)", color: NAVY, bg: "transparent" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: item.color }}
            />
            <span className="text-[10px] text-gray-500">{item.label}</span>
          </div>
        ))}
        {source === "local" && (
          <span className="text-[10px] italic text-amber-600 ml-auto">
            ⚠ Local index (approximate)
          </span>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500">Loading interlinear…</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && verses.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-12">No data found for this selection.</p>
        )}

        {!loading && verses.map((v) => (
          <VerseRow key={v.ref} verse={v} onOpenLexicon={handleOpenLexicon} />
        ))}
      </div>

      {/* ── Footer tip ── */}
      <div
        className="shrink-0 px-4 py-2 text-center"
        style={{ borderTop: "1px solid #ede8de", background: "#faf8f3" }}
      >
        <p className="text-[10px] text-gray-400">
          Tap any word to see definition · Tap Strong&apos;s number to open full lexicon
        </p>
      </div>
    </div>
  );
}
