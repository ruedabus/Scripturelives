"use client";

import { useState, useEffect, useRef } from "react";
import { verses } from "@/data/verses";
import type { BibleVersion } from "@/data/verses";

type BibleSearchResult = {
  version: BibleVersion;
  book: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
  matchType: "reference" | "keyword";
};

type Props = {
  onSelectVerse: (verseId: string) => void;
  onSelectBibleVerse: (version: BibleVersion, book: string, chapter: number) => void;
  onVisualSearch?: (term: string) => void;
  /** Pre-populate the search box (e.g. from the home-page search bar) */
  initialQuery?: string;
};

const VERSION_COLORS: Record<BibleVersion, string> = {
  KJV: "text-amber-700",
  ASV: "text-sky-600",
  WEB: "text-emerald-400",
};

export default function SearchBar({ onSelectVerse, onSelectBibleVerse, onVisualSearch, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);

  // Sync if the parent pushes a new initialQuery (e.g. home-page search navigates to reader)
  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
  }, [initialQuery]);
  const [bibleResults, setBibleResults] = useState<BibleSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const placeResults = query.trim().length >= 2
    ? verses.filter((verse) =>
        verse.places.some((place) =>
          place.name.toLowerCase().includes(query.toLowerCase())
        )
      )
    : [];

  useEffect(() => {
    if (query.trim().length < 2) {
      setBibleResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setIsSearching(true);
      fetch(`/api/bible/search?q=${encodeURIComponent(query.trim())}`)
        .then((r) => r.json())
        .then((data) => setBibleResults(data.results ?? []))
        .catch(() => setBibleResults([]))
        .finally(() => setIsSearching(false));
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const hasResults = placeResults.length > 0 || bibleResults.length > 0;

  return (
    <div className="relative rounded-xl border border-gray-200 bg-gray-50 p-4">
      <input
        type="text"
        placeholder="Search places, references (John 3:16), or keywords…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg bg-gray-100 px-3 py-2 text-white outline-none placeholder:text-gray-400"
      />

      {query.trim().length >= 2 && (
        <div className="mt-3 space-y-4">

          {/* Place results */}
          {placeResults.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Places
              </p>
              <div className="space-y-1.5">
                {placeResults.map((verse) => (
                  <button
                    key={verse.id}
                    onClick={() => { onSelectVerse(verse.id); setQuery(""); }}
                    className="w-full rounded-lg border border-gray-300 p-2 text-left hover:bg-gray-100 transition"
                  >
                    <div className="text-sm font-medium text-amber-700">{verse.reference}</div>
                    <div className="text-sm text-gray-600 truncate">
                      {verse.translations.KJV.slice(0, 70)}…
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      {verse.places.map((p) => p.name).join(", ")}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bible verse results */}
          {(isSearching || bibleResults.length > 0) && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Bible Verses
              </p>

              {isSearching && (
                <p className="text-sm text-gray-400 italic">Searching…</p>
              )}

              {!isSearching && bibleResults.length === 0 && (
                <p className="text-sm text-gray-400 italic">No verses found.</p>
              )}

              <div className="space-y-1.5">
                {bibleResults.map((result, i) => (
                  <button
                    key={`${result.version}-${result.reference}-${i}`}
                    onClick={() => {
                      onSelectBibleVerse(result.version, result.book, result.chapter);
                      onVisualSearch?.(query.trim());
                      setQuery("");
                    }}
                    className="w-full rounded-lg border border-gray-300 p-2 text-left hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${VERSION_COLORS[result.version]}`}>
                        {result.version}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {result.reference}
                      </span>
                      {result.matchType === "reference" && (
                        <span className="ml-auto text-xs text-gray-400">ref</span>
                      )}
                    </div>
                    <div className="mt-0.5 text-sm text-gray-500 line-clamp-2">
                      {result.text.length > 100 ? result.text.slice(0, 100) + "…" : result.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results at all */}
          {!isSearching && !hasResults && (
            <p className="text-sm text-gray-400 italic">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}
