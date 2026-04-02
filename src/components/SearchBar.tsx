"use client";

import { useState } from "react";
import { verses } from "@/data/verses";

type Props = {
  onSelectVerse: (verseId: string) => void;
};

export default function SearchBar({ onSelectVerse }: Props) {
  const [query, setQuery] = useState("");

  const results = verses.filter((verse) =>
    verse.places.some((place) =>
      place.name.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
      <input
        type="text"
        placeholder="Search places (e.g., Jerusalem)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg bg-stone-800 px-3 py-2 text-white outline-none"
      />

      {query && (
        <div className="mt-3 space-y-2">
          {results.map((verse) => (
            <button
              key={verse.id}
              onClick={() => onSelectVerse(verse.id)}
              className="w-full rounded-lg border border-stone-700 p-2 text-left hover:bg-stone-800"
            >
              <div className="text-sm text-amber-400">
                {verse.reference}
              </div>
              <div className="text-sm text-stone-300">
                {verse.text.slice(0, 60)}...
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}