"use client";

import { useEffect, useState } from "react";
import type { NewsArticle } from "@/app/api/christian-news/route";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

// Source favicon colours for the dot badge
const SOURCE_COLOR: Record<string, string> = {
  "Christianity Today":  "#0056A6",
  "The Gospel Coalition":"#1a2640",
  "Christian Post":      "#C0392B",
  "CBN News":            "#1F7A4D",
};

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const h    = Math.floor(diff / 3_600_000);
    if (h < 1)  return "Just now";
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  } catch {
    return "";
  }
}

export default function ChristianNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const load = async () => {
    setLoading(true); setError(false);
    try {
      const res  = await fetch("/api/christian-news", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setArticles(data);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setLastRefresh(Date.now());
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #ede8de", background: "white" }}>

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #ede8de", background: "#faf8f3" }}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Today in</p>
          <p className="text-sm font-black leading-tight" style={{ color: NAVY }}>Christian News</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          title="Refresh news"
          className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition hover:opacity-70 disabled:opacity-40"
          style={{ background: "rgba(201,149,42,0.10)", color: GOLD }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            className={loading ? "animate-spin" : ""}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Body */}
      <div className="divide-y" style={{ borderColor: "#f0ece3" }}>
        {loading && (
          <div className="px-4 py-6 flex flex-col items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${GOLD} transparent ${GOLD} ${GOLD}` }} />
            <p className="text-xs" style={{ color: "#9ca3af" }}>Loading latest news…</p>
          </div>
        )}

        {!loading && error && (
          <div className="px-4 py-6 text-center">
            <p className="text-2xl mb-2">📡</p>
            <p className="text-xs font-semibold mb-3" style={{ color: "#6b7280" }}>Couldn&apos;t load news right now</p>
            <button onClick={load} className="text-xs font-bold transition hover:opacity-70" style={{ color: GOLD }}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-xs" style={{ color: "#9ca3af" }}>No articles found</p>
          </div>
        )}

        {!loading && !error && articles.map((article, i) => (
          <a
            key={i}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 transition hover:bg-amber-50 group"
          >
            {/* Source badge + time */}
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ background: SOURCE_COLOR[article.source] ?? NAVY }}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider truncate" style={{ color: "#9ca3af" }}>
                {article.source}
              </span>
              {article.pubDate && (
                <>
                  <span style={{ color: "#d1c9b8" }}>·</span>
                  <span className="text-[10px]" style={{ color: "#9ca3af" }}>{timeAgo(article.pubDate)}</span>
                </>
              )}
            </div>

            {/* Headline */}
            <p
              className="text-xs font-semibold leading-snug transition group-hover:opacity-75"
              style={{ color: NAVY }}
            >
              {article.title}
            </p>

            {/* External link indicator */}
            <p className="text-[10px] mt-1 font-semibold transition group-hover:opacity-60" style={{ color: GOLD }}>
              Read more →
            </p>
          </a>
        ))}
      </div>

      {/* Footer */}
      {!loading && !error && articles.length > 0 && (
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: "1px solid #f0ece3", background: "#faf8f3" }}>
          <div className="flex items-center gap-2 flex-wrap">
            {["Christianity Today","The Gospel Coalition","Christian Post","CBN News"].map((src) => (
              <span key={src} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: SOURCE_COLOR[src] }} />
                <span className="text-[9px]" style={{ color: "#9ca3af" }}>{src.split(" ")[0]}</span>
              </span>
            ))}
          </div>
          <span className="text-[9px]" style={{ color: "#d1c9b8" }}>
            {new Date(lastRefresh).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      )}
    </div>
  );
}
