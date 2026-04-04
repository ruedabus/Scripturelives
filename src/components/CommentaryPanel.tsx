"use client";

import { useEffect, useState } from "react";

type CommentaryData = {
  text: string | null;
  source: string;
  onlineUrl: string;
  unavailable: boolean;
};

type Props = {
  book: string;
  chapter: number;
};

export default function CommentaryPanel({ book, chapter }: Props) {
  const [data, setData] = useState<CommentaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!book || !chapter) return;
    setLoading(true);
    setData(null);
    setExpanded(false);

    fetch(`/api/commentary?book=${encodeURIComponent(book)}&chapter=${chapter}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() =>
        setData({
          text: null,
          source: "Matthew Henry's Commentary",
          onlineUrl: `https://www.ccel.org/ccel/henry/`,
          unavailable: true,
        })
      )
      .finally(() => setLoading(false));
  }, [book, chapter]);

  if (!book || !chapter) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
        Select a book and chapter in the Full Bible tab to view commentary.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold text-amber-700">
          {book} {chapter}
        </h2>
        <p className="text-xs text-gray-400">Matthew Henry's Commentary (1706–1714)</p>
      </div>

      {loading && (
        <div className="py-8 text-center text-gray-400 animate-pulse text-sm">
          Fetching commentary…
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4">
          {data.unavailable || !data.text ? (
            // Live fetch failed — show direct link to CCEL
            <div className="rounded-xl border border-gray-300 bg-gray-100 p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <p className="text-gray-600 font-medium text-sm">
                    Matthew Henry's Commentary
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Public domain (1706–1714). One of the most beloved devotional
                    commentaries ever written, covering every chapter of the Bible
                    with practical spiritual insight.
                  </p>
                </div>
              </div>
              <a
                href={data.onlineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sky-600 hover:text-sky-600 transition font-medium text-sm"
              >
                📚 Read {book} {chapter} — Matthew Henry (CCEL) ↗
              </a>
            </div>
          ) : (
            // Commentary text available locally
            <div className="space-y-3">
              <div
                className={`text-gray-600 text-sm leading-7 overflow-hidden transition-all ${
                  expanded ? "max-h-none" : "max-h-64"
                }`}
              >
                {data.text.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i} className="mb-3">{para}</p>
                ))}
              </div>

              {data.text.length > 600 && (
                <button
                  type="button"
                  onClick={() => setExpanded((e) => !e)}
                  className="text-xs text-amber-700 hover:text-amber-600 transition"
                >
                  {expanded ? "Show less ↑" : "Read more ↓"}
                </button>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <p className="text-gray-400 text-xs italic">{data.source}</p>
                <a
                  href={data.onlineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sky-600 hover:text-sky-600 transition"
                >
                  Full text ↗
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
