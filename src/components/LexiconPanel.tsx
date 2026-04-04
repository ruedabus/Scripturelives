"use client";

import { useEffect, useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Audio pronunciation using Web Speech API
// ---------------------------------------------------------------------------
function useSpeak() {
  const speak = useCallback((text: string, lang: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  }, []);
  return speak;
}

type LexiconEntry = {
  number: string;
  language: "Hebrew" | "Greek";
  testament: string;
  lemma: string;
  xlit: string;
  pron: string;
  derivation: string;
  strongs_def: string;
  kjv_def: string;
  score?: number;
};

// --------------------------------------------------------------------------
// Single entry display
// --------------------------------------------------------------------------
function EntryCard({ entry }: { entry: LexiconEntry }) {
  const isHebrew = entry.language === "Hebrew";
  const speak = useSpeak();
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    // Use the transliteration for pronunciation (more browser-friendly than script chars)
    const text = entry.xlit || entry.pron || entry.lemma;
    const lang = isHebrew ? "he-IL" : "el-GR";
    setSpeaking(true);
    speak(text, lang);
    setTimeout(() => setSpeaking(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Strong's number + language badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isHebrew
              ? "bg-amber-900/40 text-amber-600 border border-amber-200"
              : "bg-sky-900/40 text-sky-600 border border-sky-700/40"
          }`}
        >
          {entry.number}
        </span>
        <span className="text-gray-400 text-xs">{entry.testament}</span>
      </div>

      {/* Original word + audio button */}
      <div className="text-center py-3 border border-gray-300 rounded-lg bg-gray-100 relative">
        <button
          type="button"
          onClick={handleSpeak}
          title="Hear pronunciation"
          className={`absolute top-2 right-2 rounded-full p-1.5 transition ${
            speaking
              ? "text-amber-700 bg-amber-900/30"
              : "text-gray-400 hover:text-gray-800 hover:bg-gray-200"
          }`}
        >
          {speaking ? "🔊" : "🔈"}
        </button>
        <p
          className={`text-3xl font-bold tracking-wide ${
            isHebrew ? "text-amber-600" : "text-sky-600"
          }`}
          dir={isHebrew ? "rtl" : "ltr"}
        >
          {entry.lemma}
        </p>
        {entry.xlit && (
          <p className="text-gray-500 text-xs mt-1 italic">{entry.xlit}</p>
        )}
        {entry.pron && (
          <p className="text-gray-400 text-xs">/{entry.pron}/</p>
        )}
      </div>

      {/* Definition */}
      {entry.strongs_def && (
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Definition</p>
          <p className="text-gray-800 leading-relaxed text-sm">{entry.strongs_def}</p>
        </div>
      )}

      {/* Etymology */}
      {entry.derivation && entry.derivation.length > 2 && (
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Etymology</p>
          <p className="text-gray-500 text-xs italic leading-relaxed">{entry.derivation}</p>
        </div>
      )}

      {/* KJV usage */}
      {entry.kjv_def && (
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
            Used in KJV as
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">{entry.kjv_def}</p>
        </div>
      )}

      {/* External link */}
      <a
        href={`https://www.blueletterbible.org/lexicon/${entry.number.toLowerCase()}/kjv/`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-600 transition"
      >
        <span>📚</span>
        <span>Full entry on Blue Letter Bible</span>
      </a>
    </div>
  );
}

// --------------------------------------------------------------------------
// Props: either a Strong's number OR a clicked word + book context
// --------------------------------------------------------------------------
type Props =
  | {
      mode: "number";
      strongsNumber: string;
      clickedWord?: string;
      onClear: () => void;
    }
  | {
      mode: "word";
      clickedWord: string;
      book: string;
      onClear: () => void;
    };

export default function LexiconPanel(props: Props) {
  const [entries, setEntries] = useState<LexiconEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStopWord, setIsStopWord] = useState(false);

  const label =
    props.mode === "number" ? props.clickedWord ?? props.strongsNumber : props.clickedWord;

  useEffect(() => {
    setLoading(true);
    setEntries([]);
    setError("");
    setIsStopWord(false);
    setActiveIndex(0);

    if (props.mode === "number") {
      fetch(`/api/strongs?n=${encodeURIComponent(props.strongsNumber)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.entry) setEntries([data.entry]);
          else setError(data.hint ?? data.error ?? "Entry not found.");
        })
        .catch(() => setError("Failed to load lexicon entry."))
        .finally(() => setLoading(false));
    } else {
      // Word lookup
      fetch(`/api/strongs/word?w=${encodeURIComponent(props.clickedWord)}&book=${encodeURIComponent(props.book)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.stopWord) {
            setIsStopWord(true);
          } else if (data.entries?.length) {
            setEntries(data.entries);
          } else if (data.hint) {
            setError(data.hint);
          } else {
            setError(`No Hebrew/Greek root found for "${props.clickedWord}".`);
          }
        })
        .catch(() => setError("Failed to look up word."))
        .finally(() => setLoading(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode === "number" ? props.strongsNumber : props.clickedWord]);

  return (
    <div className="rounded-xl border border-sky-700/50 bg-gray-50 overflow-hidden text-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-sky-50 border-b border-sky-200">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sky-600 text-base shrink-0">🔤</span>
          <span className="font-semibold text-sky-600 shrink-0">Word Study</span>
          {label && (
            <span className="text-gray-500 italic truncate">"{label}"</span>
          )}
        </div>
        <button
          type="button"
          onClick={props.onClear}
          className="text-gray-400 hover:text-gray-800 transition text-lg leading-none shrink-0"
          title="Close"
        >
          ×
        </button>
      </div>

      <div className="p-4">
        {loading && (
          <div className="py-4 text-center text-gray-400 animate-pulse">
            Looking up "{label}"…
          </div>
        )}

        {isStopWord && !loading && (
          <p className="text-gray-400 text-xs italic text-center py-4">
            Common grammatical word — no Strong's root to display.
          </p>
        )}

        {error && !loading && (
          <div className="space-y-2">
            <p className="text-amber-700 text-xs">{error}</p>
            {error.includes("setup-strongs") && (
              <div className="rounded-lg bg-gray-100 border border-gray-300 px-3 py-2 text-xs text-gray-600">
                <p className="font-semibold mb-1">📦 One-time setup required</p>
                <p>In your terminal (in the scripture-alive folder):</p>
                <code className="block mt-1 text-amber-600 bg-gray-50 rounded px-2 py-1">
                  npm run setup-strongs
                </code>
                <p className="mt-1 text-gray-500">
                  Then restart with <code className="text-amber-600">npm run dev</code>
                </p>
              </div>
            )}
          </div>
        )}

        {!loading && !isStopWord && entries.length > 0 && (
          <div className="space-y-4">
            {/* Tab selector when multiple roots found */}
            {entries.length > 1 && (
              <div className="space-y-1">
                <p className="text-gray-400 text-xs">
                  {entries.length} possible roots — select one:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {entries.map((e, i) => (
                    <button
                      key={e.number}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium border transition ${
                        i === activeIndex
                          ? e.language === "Hebrew"
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-sky-600 text-white border-sky-600"
                          : "border-gray-300 text-gray-500 hover:border-gray-400"
                      }`}
                    >
                      {e.number}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <EntryCard entry={entries[activeIndex]} />
          </div>
        )}
      </div>
    </div>
  );
}
