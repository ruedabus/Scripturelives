"use client";

import { useEffect, useState } from "react";

type XrefEntry = { book: string; chapter: number; verse: number };

type Props = {
  verseRef: string; // e.g. "John 3:16"
  onNavigate: (book: string, chapter: number) => void;
};

export default function CrossReferences({ verseRef, onNavigate }: Props) {
  const [refs, setRefs] = useState<XrefEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    if (!verseRef) return;
    setLoading(true);
    setRefs([]);
    setUnavailable(false);

    fetch(`/api/cross-refs?ref=${encodeURIComponent(verseRef)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.unavailable) {
          setUnavailable(true);
          setHint(data.hint ?? "");
        } else {
          setRefs(data.refs ?? []);
        }
      })
      .catch(() => setUnavailable(true))
      .finally(() => setLoading(false));
  }, [verseRef]);

  if (!verseRef) return null;

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
        🔗 Cross-References for {verseRef}
      </p>

      {loading && (
        <p className="text-xs text-gray-400 animate-pulse">Loading…</p>
      )}

      {unavailable && !loading && (
        <div className="text-xs text-gray-400 space-y-1">
          <p>Cross-reference data not yet downloaded.</p>
          {hint && (
            <code className="block text-amber-700 bg-gray-50 rounded px-2 py-1">
              {hint.replace("Run: ", "")}
            </code>
          )}
        </div>
      )}

      {!loading && !unavailable && refs.length === 0 && (
        <p className="text-xs text-gray-400 italic">No cross-references found.</p>
      )}

      {!loading && refs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {refs.slice(0, 20).map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onNavigate(r.book, r.chapter)}
              className="rounded-full bg-gray-100 border border-gray-300 px-2.5 py-1 text-xs text-amber-600 hover:bg-gray-200 hover:border-amber-600 transition"
              title={`Navigate to ${r.book} ${r.chapter}:${r.verse}`}
            >
              {r.book} {r.chapter}:{r.verse}
            </button>
          ))}
          {refs.length > 20 && (
            <span className="text-xs text-gray-400 self-center">
              +{refs.length - 20} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
