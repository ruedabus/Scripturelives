import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Worship Music | Scripture Lives",
  description:
    "Worship music to accompany your time in God's Word — sing along, pray, and draw closer to Christ.",
};

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const PLAYLIST_ID = "PLKUA473MWUv3VnK3E7ElYEqVN7eb7h92_";
const FIRST_VIDEO  = "f2oxGYpuLkw";

export default function MusicPage() {
  return (
    <div className="min-h-screen" style={{ background: "#faf8f3" }}>

      {/* ── Nav ── */}
      <nav
        className="hidden md:flex sticky top-0 z-10 bg-white px-5 py-3 items-center gap-3"
        style={{ borderBottom: "1px solid #ede8de" }}
      >
        <Link href="/" className="text-sm font-semibold transition hover:opacity-70" style={{ color: GOLD }}>
          ← Home
        </Link>
        <span style={{ color: "#ddd6c8" }}>|</span>
        <span className="text-sm font-bold" style={{ color: NAVY }}>Worship Music</span>
      </nav>

      {/* ── Hero ── */}
      <header
        className="w-full py-16 px-6 text-center"
        style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #2d1f3d 60%, #1a2640 100%)` }}
      >
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-10" style={{ background: GOLD }} />
          <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>
            Scripture Lives
          </span>
          <div className="h-px w-10" style={{ background: GOLD }} />
        </div>

        <div className="text-5xl mb-4">🎵</div>

        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
          Worship<br />
          <span style={{ color: GOLD }}>Music</span>
        </h1>

        <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
          Sing along, pray, and draw closer to God — music to accompany your time in His Word.
        </p>
      </header>

      {/* ── Player ── */}
      <main className="w-full max-w-4xl mx-auto px-4 py-10 flex flex-col gap-6">

        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: GOLD }}>
          🎶 Now Playing — Worship Playlist
        </p>

        {/* YouTube embed */}
        <div
          className="w-full rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.14)", border: "1px solid #ede8de", aspectRatio: "16/9" }}
        >
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${FIRST_VIDEO}?list=${PLAYLIST_ID}&rel=0&modestbranding=1`}
            title="Worship Music Playlist"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ display: "block", border: "none" }}
          />
        </div>

        <p className="text-xs text-center" style={{ color: "#9ca3af" }}>
          Use the playlist icon in the player to browse all songs.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link
            href="/devotionals"
            className="px-6 py-3 rounded-2xl text-sm font-black transition hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}
          >
            🌅 Today's Devotional
          </Link>
          <Link
            href="/prayer"
            className="px-6 py-3 rounded-2xl text-sm font-black transition hover:opacity-80 border"
            style={{ borderColor: "rgba(26,36,64,0.2)", color: NAVY }}
          >
            🙏 Prayer Wall
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="bg-white px-5 py-8 text-center mt-4"
        style={{ borderTop: "1px solid #ede8de" }}
      >
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          Music streamed via YouTube ·{" "}
          <span className="font-bold" style={{ color: GOLD }}>Scripture Lives</span>
        </p>
        <Link
          href="/"
          className="mt-2 inline-block text-sm font-bold hover:opacity-70 transition"
          style={{ color: NAVY }}
        >
          ← Back to Home
        </Link>
      </footer>
    </div>
  );
}
