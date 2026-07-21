"use client";

import { useState } from "react";
import EbookReader from "./EbookReader";
import { EBOOK_NARRATION } from "@/lib/ebookNarration";

// ── Design tokens ──────────────────────────────────────────────
const GOLD = "#C9952A";
const NAVY = "#1a2640";

// ── Book type ──────────────────────────────────────────────────
export type Book = {
  slug:        string;
  title:       string;
  subtitle:    string;
  description: string;
  scripture:   string;
  ages:        string;
  pages:       string;
  theme:       string;
  coverEmoji:  string;
  coverImage:  string;
  coverBg:     string;
  accentColor: string;
  downloadUrl: string | null;
  badge:       string | null;
};

// ── Book card ──────────────────────────────────────────────────
function BookCard({
  book,
  onReadClick,
}: {
  book: Book;
  onReadClick: (slug: string) => void;
}) {
  const isComingSoon    = !book.downloadUrl;
  const hasNarration    = Boolean(EBOOK_NARRATION[book.slug]);
  const CHANNEL_URL     = "https://www.youtube.com/@FaithTails";

  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden transition hover:-translate-y-1"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        border:    "1px solid rgba(201,149,42,0.2)",
        background: "#fff",
      }}
    >
      {/* Cover */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: book.coverBg,
          height:     book.coverImage ? 280 : 220,
          padding:    book.coverImage ? 0 : "2rem 1.5rem",
        }}
      >
        {/* Badge */}
        {book.badge && (
          <span
            className="absolute top-3 right-3 z-10 text-xs font-black px-2 py-1 rounded-full"
            style={{
              background:
                book.badge === "NEW"
                  ? "#22c55e"
                  : "rgba(255,255,255,0.2)",
              color:
                book.badge === "NEW" ? "#fff" : "rgba(255,255,255,0.8)",
              letterSpacing: "0.08em",
            }}
          >
            {book.badge}
          </span>
        )}

        {book.coverImage ? (
          <div className="relative w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full"
              style={{ objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
            {/* Coming soon overlay */}
            {!book.downloadUrl && (
              <div
                className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center py-3"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)",
                }}
              >
                <span className="text-white font-black text-sm tracking-wide">
                  Coming Soon
                </span>
                <span
                  className="text-xs font-semibold mt-0.5"
                  style={{ color: GOLD }}
                >
                  May 15, 2026
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            <span style={{ fontSize: 72, lineHeight: 1 }}>{book.coverEmoji}</span>
            <h3
              className="text-center font-black mt-3 text-xl leading-tight"
              style={{ color: book.accentColor }}
            >
              {book.title}
            </h3>
            <p
              className="text-center text-sm mt-1"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {book.subtitle}
            </p>
          </>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {book.ages && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(201,149,42,0.12)", color: "#92400e" }}
            >
              {book.ages}
            </span>
          )}
          {book.theme && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(59,130,246,0.1)", color: "#1e40af" }}
            >
              {book.theme}
            </span>
          )}
          {book.pages && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(16,185,129,0.1)", color: "#065f46" }}
            >
              {book.pages}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>
          {book.description}
        </p>

        {book.scripture && (
          <p className="text-xs italic font-medium" style={{ color: GOLD }}>
            📖 {book.scripture}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2">
          {isComingSoon ? (
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition hover:opacity-80"
              style={{ background: "rgba(201,149,42,0.12)", color: GOLD }}
            >
              <span>🔔</span> Subscribe to be notified
            </a>
          ) : (
            <div className="flex gap-2">
              {/* Read / Read Aloud button */}
              <button
                onClick={() => onReadClick(book.slug)}
                className="flex flex-1 items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #e6a830)` }}
              >
                {hasNarration ? (
                  <><span>🔊</span> Read Aloud</>
                ) : (
                  <><span>📖</span> Read</>
                )}
              </button>

              {/* PDF download */}
              <a
                href={`/api/download?book=${book.slug}`}
                download
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold transition hover:opacity-90 active:scale-95"
                style={{
                  background: "rgba(201,149,42,0.1)",
                  color:      GOLD,
                  border:     `1px solid rgba(201,149,42,0.35)`,
                }}
                title="Download PDF"
              >
                <span>📥</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────
export default function BookLibrary({ books }: { books: Book[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const handleReadClick = (slug: string) => {
    if (EBOOK_NARRATION[slug]) {
      // Open narrated reader
      setActiveSlug(slug);
    } else {
      // Fallback: open PDF in new tab
      window.open(`/api/download?book=${slug}`, "_blank");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {books.map((book) => (
          <BookCard key={book.slug} book={book} onReadClick={handleReadClick} />
        ))}
      </div>

      {/* Narrated reader modal */}
      {activeSlug && (
        <EbookReader
          bookSlug={activeSlug}
          onClose={() => setActiveSlug(null)}
        />
      )}
    </>
  );
}
