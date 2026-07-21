"use client";

import { useState } from "react";
import ColoringTool from "./ColoringTool";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

interface Book {
  slug:       string;
  title:      string;
  coverImage: string;
  coverBg:    string;
  pages:      string; // e.g. "20 pages"
}

interface ColoringBookSectionProps {
  books: Book[];
}

// Map page count strings to numbers
function pageCount(pages: string): number {
  return parseInt(pages.replace(/\D/g, ""), 10) || 10;
}

export default function ColoringBookSection({ books }: ColoringBookSectionProps) {
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  return (
    <>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        {books.map((book) => (
          <button
            key={book.slug}
            onClick={() => setActiveBook(book)}
            className="group relative flex flex-col rounded-2xl overflow-hidden transition hover:scale-105 hover:shadow-xl active:scale-100 text-left"
            style={{
              background:  book.coverBg,
              boxShadow:   "0 4px 16px rgba(0,0,0,0.2)",
              border:      "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Cover image */}
            <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.55)" }}
              >
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: GOLD, color: NAVY }}
                >
                  🎨 Color This!
                </span>
              </div>
            </div>

            {/* Title strip */}
            <div className="px-2.5 py-2">
              <p className="text-xs font-bold leading-snug line-clamp-2 text-white">{book.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                {book.pages}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Coloring Tool Modal */}
      {activeBook && (
        <ColoringTool
          bookSlug={activeBook.slug}
          bookTitle={activeBook.title}
          totalPages={pageCount(activeBook.pages)}
          onClose={() => setActiveBook(null)}
        />
      )}
    </>
  );
}
