import type { Metadata } from "next";
import Link from "next/link";
import ThemeSongPlayer from "@/components/ThemeSongPlayer";
import BiblePuzzle from "@/components/BiblePuzzle";

export const metadata: Metadata = {
  title: "Faith Tails Kids | Scripture Lives",
  description:
    "Faith Tails — fun, faith-filled adventure stories and videos for kids! Follow Mav and Moony as they discover the Bible through exciting journeys. Watch on YouTube and read free ebooks.",
};

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD   = "#C9952A";
const NAVY   = "#1a2640";
const CREAM  = "#faf8f3";

// ── Book library data ──────────────────────────────────────────────────────────
// To add a new book: add an entry here. coverEmoji is shown when no image is available.
const BOOKS = [
  {
    slug:        "moon-adventure",
    title:       "Mission Moonrock",
    subtitle:    "Mav, Moony & the Moon Giant",
    description: "When a giant alien threatens the moon, it's up to the smallest member of the crew — Moony — to save the day. Based on the story of David and Goliath.",
    scripture:   "1 Samuel 17:37",
    ages:        "Ages 10–12",
    pages:       "10 pages",
    theme:       "Courage & Faith",
    coverEmoji:  "🚀",
    coverImage:  "/ebook1-thumbnail.png",
    coverBg:     "linear-gradient(135deg, #0f1f3d 0%, #1a3a6b 50%, #2d5a9e 100%)",
    accentColor: "#60a5fa",
    downloadUrl: "/books/mav-moony-moon-adventure.pdf",
    badge:       "NEW",
  },
  {
    slug:        "lions-den",
    title:       "Mav, Moony & the Lion's Den",
    subtitle:    "Standing Firm — Based on Daniel 6",
    description: "When Grandpa Martinez is thrown into the lion's den for refusing to stop praying, it's up to Mav and Moony to trust God — even when things look impossible. A story about courage, prayer, and never giving up on faith.",
    scripture:   "Daniel 6:22",
    ages:        "Ages 4–12",
    pages:       "15 pages",
    theme:       "Courage & Prayer",
    coverEmoji:  "🦁",
    coverImage:  "/ebook2-thumbnail.png",
    coverBg:     "linear-gradient(135deg, #1a2640 0%, #3d2010 60%, #5c3010 100%)",
    accentColor: "#C9952A",
    downloadUrl: "/books/mav-moony-lions-den-ebook.pdf",
    badge:       "NEW",
  },
];

// ── YouTube featured video ─────────────────────────────────────────────────────
// Replace VIDEO_ID with the YouTube video ID you want to feature (the part after ?v=)
// e.g. for https://youtube.com/watch?v=dQw4w9WgXcQ → VIDEO_ID = "dQw4w9WgXcQ"
const FEATURED_VIDEO_ID = ""; // ← paste your video ID here
const CHANNEL_URL = "https://www.youtube.com/@FaithTails";
const CHANNEL_HANDLE = "@FaithTails";

// ── Book card ──────────────────────────────────────────────────────────────────
function BookCard({ book }: { book: (typeof BOOKS)[number] }) {
  const isComingSoon = !book.downloadUrl;

  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden transition hover:-translate-y-1"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        border: "1px solid rgba(201,149,42,0.2)",
        background: "#fff",
      }}
    >
      {/* Cover */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ background: book.coverBg, height: book.coverImage ? 280 : 220, padding: book.coverImage ? 0 : "2rem 1.5rem" }}
      >
        {/* Badge */}
        {book.badge && (
          <span
            className="absolute top-3 right-3 z-10 text-xs font-black px-2 py-1 rounded-full"
            style={{
              background: book.badge === "NEW" ? "#22c55e" : "rgba(255,255,255,0.2)",
              color: book.badge === "NEW" ? "#fff" : "rgba(255,255,255,0.8)",
              letterSpacing: "0.08em",
            }}
          >
            {book.badge}
          </span>
        )}

        {book.coverImage ? (
          <div className="relative w-full h-full">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full"
              style={{ objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
            {/* Coming soon overlay with date */}
            {!book.downloadUrl && (
              <div
                className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center py-3"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)" }}
              >
                <span className="text-white font-black text-sm tracking-wide">Coming Soon</span>
                <span className="text-xs font-semibold mt-0.5" style={{ color: GOLD }}>May 15, 2026</span>
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
            <p className="text-center text-sm mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>
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
              {/* Read Online — opens PDF in browser tab */}
              <a
                href={book.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #e6a830)` }}
              >
                <span>📖</span> Read
              </a>
              {/* Download — saves the file */}
              <a
                href={book.downloadUrl}
                download
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold transition hover:opacity-90 active:scale-95"
                style={{
                  background: "rgba(201,149,42,0.1)",
                  color: GOLD,
                  border: `1px solid rgba(201,149,42,0.35)`,
                }}
                title="Download eBook"
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

// ── Page ───────────────────────────────────────────────────────────────────────
export default function KidsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: CREAM }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: "rgba(250,248,243,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #ede8de",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold transition hover:opacity-70"
          style={{ color: NAVY }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Scripture Lives
        </Link>

        <div className="flex items-center gap-2">
          <span style={{ fontSize: 18 }}>🐾</span>
          <span className="text-sm font-black" style={{ color: NAVY }}>Faith Tails Kids</span>
        </div>

        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white transition hover:opacity-80"
          style={{ background: "#ff0000" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8z"/>
            <polygon fill="white" points="9.75,15.02 15.5,12 9.75,8.98"/>
          </svg>
          Subscribe
        </a>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #0f3460 50%, #162447 100%)`,
          padding: "4rem 1.5rem 5rem",
        }}
      >
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background: "rgba(255,255,255,0.6)",
              top: `${(i * 37) % 80}%`,
              left: `${(i * 53) % 95}%`,
            }}
          />
        ))}

        <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
          {/* Logo / Brand */}
          <img
            src="/FT_logo.png"
            alt="Faith Tails logo"
            style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 20 }}
          />

          <div>
            <h1 className="text-4xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
              Faith Tails
            </h1>
            <p className="text-lg font-semibold mt-1" style={{ color: GOLD }}>
              Adventure Stories for Kids
            </p>
          </div>

          <p className="text-base leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
            Join <strong style={{ color: "white" }}>Mav</strong> the big-hearted Bullmastiff and
            {" "}<strong style={{ color: "white" }}>Moony</strong> the wise Dachshund on faith-filled
            adventures inspired by real Bible stories. Watch on YouTube and read free below!
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition hover:opacity-90 active:scale-95"
              style={{ background: "#ff0000" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8z"/>
                <polygon fill="white" points="9.75,15.02 15.5,12 9.75,8.98"/>
              </svg>
              Watch on YouTube
            </a>
            <a
              href="#books"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              📚 Read Free eBooks
            </a>
          </div>
        </div>
      </section>

      {/* ── Theme Song Player ─────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, marginTop: -1 }}>
        <ThemeSongPlayer />
      </div>

      {/* ── YouTube Feature ───────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto w-full px-4 py-12">
        <div className="flex flex-col items-center gap-2 text-center mb-8">
          <span style={{ fontSize: 32 }}>📺</span>
          <h2 className="text-2xl font-black" style={{ color: NAVY }}>Watch Faith Tails</h2>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            New adventures every week on our YouTube channel
          </p>
        </div>

        {FEATURED_VIDEO_ID ? (
          /* Embedded video if ID is provided */
          <div
            className="rounded-2xl overflow-hidden w-full"
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              aspectRatio: "16/9",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${FEATURED_VIDEO_ID}?rel=0&modestbranding=1`}
              title="Faith Tails — Featured Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 0, display: "block" }}
            />
          </div>
        ) : (
          /* Channel banner poster when no video ID set */
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block rounded-2xl overflow-hidden transition hover:opacity-90 group"
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              textDecoration: "none",
            }}
          >
            <img
              src="/FT-poster.png"
              alt="Faith Tails — Watch on YouTube"
              className="w-full block"
              style={{ display: "block", maxHeight: 420, objectFit: "cover", objectPosition: "center top" }}
            />
            {/* Play button overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.45)" }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 72, height: 72, background: "#ff0000", boxShadow: "0 4px 24px rgba(255,0,0,0.5)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <polygon points="9.75,15.02 15.5,12 9.75,8.98" />
                </svg>
              </div>
              <span className="text-white font-bold text-sm px-5 py-2 rounded-xl" style={{ background: "#ff0000" }}>
                Visit Our Channel →
              </span>
            </div>
          </a>
        )}

        {/* Channel stats / info strip */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 mt-6 py-4 px-6 rounded-2xl"
          style={{ background: "rgba(201,149,42,0.08)", border: "1px solid rgba(201,149,42,0.2)" }}
        >
          {[
            { icon: "🎬", label: "New episodes weekly" },
            { icon: "📖", label: "Based on real Bible stories" },
            { icon: "🐾", label: "Mav & Moony adventures" },
            { icon: "✝️", label: "Faith messages for kids" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span className="text-sm font-semibold" style={{ color: NAVY }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story Library ─────────────────────────────────────────────────────── */}
      <section id="books" className="max-w-4xl mx-auto w-full px-4 pb-16">
        {/* Section header */}
        <div className="flex flex-col items-center gap-2 text-center mb-8">
          <span style={{ fontSize: 32 }}>📚</span>
          <h2 className="text-2xl font-black" style={{ color: NAVY }}>Free Story eBooks</h2>
          <p className="text-sm max-w-md" style={{ color: "#6b7280" }}>
            Download and read Mav and Moony&apos;s adventures — completely free. Each story is inspired
            by a Bible story and packed with laughs, heart, and faith.
          </p>
        </div>

        {/* Book grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {BOOKS.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>

      {/* ── Puzzle Game ───────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto w-full px-4 pb-16">
        <div className="flex flex-col items-center gap-2 text-center mb-6">
          <span style={{ fontSize: 32 }}>🧩</span>
          <h2 className="text-2xl font-black" style={{ color: NAVY }}>Mav & Moony Puzzle</h2>
          <p className="text-sm max-w-sm" style={{ color: "#6b7280" }}>
            Put the puzzle together! Pick a picture, choose your difficulty, and solve it piece by piece.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", border: "1px solid rgba(201,149,42,0.15)" }}>
          <BiblePuzzle />
        </div>
      </section>

      {/* ── Faith Message Banner ──────────────────────────────────────────────── */}
      <section
        className="py-10 px-4"
        style={{
          background: `linear-gradient(135deg, ${GOLD} 0%, #e6a830 100%)`,
        }}
      >
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-3">
          <span style={{ fontSize: 36 }}>✝️</span>
          <h3 className="text-xl font-black text-white">Every Adventure Points to Jesus</h3>
          <p className="text-sm leading-relaxed text-white" style={{ opacity: 0.9 }}>
            Faith Tails stories are built on real Scripture. Each adventure retells a Bible story in a
            way kids can connect with — big courage, small heroes, and a God who is always with us.
          </p>
          <a
            href="/"
            className="mt-2 px-6 py-3 rounded-xl font-bold text-sm transition hover:opacity-90"
            style={{ background: NAVY, color: "white" }}
          >
            Explore the Bible on Scripture Lives →
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-4 text-center text-xs"
        style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}
      >
        <p>
          Faith Tails is part of{" "}
          <Link href="/" className="underline hover:opacity-70" style={{ color: GOLD }}>
            Scripture Lives
          </Link>
          {" "}— a free Bible resource for everyone.{" "}
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-70"
            style={{ color: GOLD }}
          >
            {CHANNEL_HANDLE}
          </a>
        </p>
        <p className="mt-3" style={{ color: "#c0b89a", fontSize: "0.65rem", letterSpacing: "0.04em" }}>
          © 2026 Faith Tails. Mav and Moony are original characters of Faith Tails. All rights reserved.
          <br />
          Unauthorized reproduction or use of Faith Tails characters, stories, or music is prohibited.{" "}
          <a href="mailto:info@scripturelives.com" className="underline hover:opacity-70" style={{ color: GOLD }}>
            info@scripturelives.com
          </a>
        </p>
      </footer>

    </div>
  );
}
