"use client";

import { useState, useEffect } from "react";

type VisualReference = {
  title: string;
  description: string;
  thumbnail: string | null;
  wikipediaUrl: string;
};

type Props = {
  query: string;
  onClear: () => void;
};

export default function VisualReferencePanel({ query, onClear }: Props) {
  const [result, setResult] = useState<VisualReference | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!query) return;

    setResult(null);
    setNotFound(false);
    setLoading(true);

    fetch(`/api/visual-reference?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.result) {
          setResult(data.result);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="rounded-2xl border border-amber-200 bg-gray-50 p-4 shadow-lg">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-700">🖼</span>
          <h3 className="text-sm font-semibold text-gray-800">Visual Reference</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 italic">
            "{query}"
          </span>
          <button
            onClick={onClear}
            className="rounded text-gray-400 hover:text-gray-600 transition text-lg leading-none"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 py-6 text-gray-400 text-sm justify-center">
          <span className="animate-pulse">Searching visuals…</span>
        </div>
      )}

      {/* Not found */}
      {!loading && notFound && (
        <div className="py-4 text-center text-sm text-gray-400 italic">
          No visual reference found for "{query}".
          <br />
          <a
            href={`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query + " Bible")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-amber-600 hover:underline"
          >
            Search Wikipedia →
          </a>
        </div>
      )}

      {/* Result */}
      {!loading && result && (
        <div className="space-y-3">
          {/* Image */}
          {result.thumbnail && (
            <div className="overflow-hidden rounded-xl border border-gray-300">
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-full object-cover max-h-52"
              />
            </div>
          )}

          {/* Title */}
          <h4 className="text-base font-semibold text-amber-700">{result.title}</h4>

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-600 line-clamp-6">
            {result.description}
          </p>

          {/* Wikipedia link */}
          <a
            href={result.wikipediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-500 hover:border-amber-600 hover:text-amber-700 transition"
          >
            <span>📖</span>
            Read full article on Wikipedia
          </a>
        </div>
      )}
    </div>
  );
}
