import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scripture Lives — Free Bible Tools for Everyone",
  description:
    "Read the Bible, get daily devotionals, pray with others, explore kids stories, and play Bible games — free, for everyone.",
};

const GOLD = "#C9952A";
const NAVY = "#1a2640";

// ── Feature cards ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    title: "Read the Bible",
    desc: "Explore any passage with multiple translations, commentary, Strong's concordance, and cross-references.",
    href: "/bible?tab=bible",
    cta: "Open the Bible",
    photo: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=640&q=75",
  },
  {
    title: "Daily Devotionals",
    desc: "A short verse, reflection, and prayer delivered every morning — in English or Spanish.",
    href: "/devotionals",
    cta: "Read Today's",
    photo: "/daily-devotional.png",
  },
  {
    title: "Prayer Wall",
    desc: "Share your prayer requests and pray for others in our community wall.",
    href: "/prayer",
    cta: "Visit Prayer Wall",
    photo: "/prayer-wall.png",
  },
  {
    title: "Worship Music",
    desc: "Worship playlists to accompany your time in God's Word — sing along and draw closer to Christ.",
    href: "/music",
    cta: "Listen Now",
    photo: "/worship.png",
  },
  {
    title: "Kids Stories",
    desc: "Faith Tails — beautifully illustrated Bible story books and videos for children.",
    href: "/kids",
    cta: "Explore for Kids",
    photo: "/Kids-stories.png",
  },
  {
    title: "Bible Games",
    desc: "Bible Bowl tournaments, Wordle, Word Search, and more — fun for the whole family.",
    href: "/games",
    cta: "Play Now",
    photo: "/Bible-games.png",
  },
];

// ── Quick links ───────────────────────────────────────────────────────────────
const QUICK = [
  { icon: "✝", label: "The Gospel", href: "/gospel" },
  { icon: "🎵", label: "Worship Music", href: "/music" },
  { icon: "⛪", label: "Find a Church", href: "/find-a-church" },
  { icon: "🛍️", label: "Shop", href: "/shop" },
  { icon: "🇪🇸", label: "En Español", href: "/es" },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf8f3", fontFamily: "Georgia, serif" }}>

      {/* ── Language bar ── */}
      <div
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🌐 Language:</span>
        <span
          className="px-3 py-1 rounded-full text-xs font-black"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
        >
          🇺🇸 English
        </span>
        <Link
          href="/es"
          className="px-3 py-1 rounded-full text-xs font-black transition hover:opacity-80"
          style={{ background: GOLD, color: NAVY }}
        >
          🇪🇸 Español
        </Link>
      </div>

      {/* ── Memorial Day Banner ── */}
      <div
        className="w-full flex flex-col sm:flex-row items-center overflow-hidden"
        style={{ background: "#0a1628", borderBottom: "3px solid #B22234" }}
      >
        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/memorialday-banner.png"
          alt="Honoring Our Men and Women of the Armed Forces"
          className="w-full sm:w-56 md:w-64 object-cover shrink-0"
          style={{ maxHeight: "180px", objectPosition: "top center" }}
        />

        {/* Text */}
        <div className="flex-1 flex flex-col items-center sm:items-start justify-center px-6 py-5 gap-2 text-center sm:text-left">
          {/* Stars row */}
          <div className="flex items-center gap-2">
            <span style={{ color: "#B22234", fontSize: "18px" }}>★</span>
            <span style={{ color: "white", fontSize: "18px" }}>★</span>
            <span style={{ color: "#B22234", fontSize: "18px" }}>★</span>
          </div>

          <p
            className="text-2xl sm:text-3xl font-black tracking-wide uppercase"
            style={{ color: "#B22234", letterSpacing: "0.06em", textShadow: "0 1px 8px rgba(178,34,52,0.4)" }}
          >
            Happy Memorial Day
          </p>

          <p
            className="text-sm sm:text-base font-semibold leading-snug"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            ScriptureLives.com honors the brave men and women<br className="hidden sm:block" />
            {" "}who have fought and sacrificed for our country.
          </p>

          <p
            className="text-xs font-semibold italic mt-0.5"
            style={{ color: GOLD }}
          >
            &ldquo;Greater love has no one than this: to lay down one&apos;s life for one&apos;s friends.&rdquo; — John 15:13
          </p>

          {/* Flag stripe accent */}
          <div className="flex gap-1 mt-1">
            {["#B22234","white","#B22234","white","#3C3B6E","#3C3B6E"].map((c, i) => (
              <span key={i} className="block h-1.5 w-6 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #2d1f3d 55%, #1a2640 100%)` }}
      >
        {/* Open Bible — full-width background */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/open-bible.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
            style={{ opacity: 0.35 }}
          />
        </div>
        {/* Gradient overlay — heavier on left so text stays readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${NAVY}dd 0%, ${NAVY}88 50%, ${NAVY}44 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16 sm:py-24 flex flex-col items-center text-center">

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hand-painted cross_logo.png"
            alt="Scripture Lives"
            className="mb-6 select-none"
            style={{
              width: "160px",
              filter: "drop-shadow(0 2px 6px rgba(201,149,42,0.18))",
            }}
          />

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-5 text-white"
            style={{ textShadow: `0 2px 30px rgba(201,149,42,0.35)` }}
          >
            God&apos;s Word,<br />
            <span style={{ color: GOLD }}>For Everyone.</span>
          </h1>

          <p
            className="text-base sm:text-lg max-w-xl leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            Free Bible tools, daily devotionals, kids stories, prayer, and games —
            all in one place, in English and Spanish.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/bible"
              className="px-8 py-4 rounded-2xl font-black text-base transition hover:opacity-90 hover:scale-105 active:scale-95"
              style={{ background: GOLD, color: NAVY }}
            >
              ✨ Discover Scripture Lives
            </Link>
            <Link
              href="/gospel"
              className="px-8 py-4 rounded-2xl font-black text-base transition hover:opacity-80 border"
              style={{ borderColor: "rgba(201,149,42,0.5)", color: "white" }}
            >
              ✝ The Gospel
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section id="features" className="w-full max-w-6xl mx-auto px-4 py-16">
        <p
          className="text-center text-[10px] font-black uppercase tracking-[0.25em] mb-10"
          style={{ color: GOLD }}
        >
          Everything on Scripture Lives
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden transition hover:-translate-y-1"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #ede8de" }}
            >
              {/* Photo */}
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.photo}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(26,36,64,0.75) 0%, transparent 60%)" }}
                />
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-6 gap-3">
                <h2 className="text-lg font-black leading-snug" style={{ color: NAVY }}>
                  {f.title}
                </h2>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#6b7280" }}>
                  {f.desc}
                </p>
                <div
                  className="mt-2 pt-4 flex items-center justify-between"
                  style={{ borderTop: "1px solid #f0ece3" }}
                >
                  <span className="text-sm font-black" style={{ color: GOLD }}>
                    {f.cta} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Gospel CTA banner ── */}
      <section className="w-full max-w-3xl mx-auto px-4 pb-12">
        <Link
          href="/gospel"
          className="group flex flex-col sm:flex-row items-center gap-6 rounded-3xl p-8 transition hover:opacity-95"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, #2d1f3d 100%)`,
            border: `1px solid rgba(201,149,42,0.3)`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          }}
        >
          <div className="text-5xl select-none">✝</div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: GOLD }}>
              New Here?
            </p>
            <h3 className="text-xl font-black text-white mb-1">
              Hear the Best News You'll Ever Hear
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              Two minutes that could change your life — and your eternity.
            </p>
          </div>
          <span
            className="shrink-0 px-6 py-3 rounded-2xl text-sm font-black transition group-hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}
          >
            Read the Gospel →
          </span>
        </Link>
      </section>

      {/* ── Quick links ── */}
      <section className="w-full max-w-3xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex flex-col items-center gap-2 rounded-2xl py-5 px-3 text-center transition hover:opacity-80"
              style={{ background: "white", border: "1px solid #ede8de", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <span className="text-2xl">{q.icon}</span>
              <span className="text-xs font-black" style={{ color: NAVY }}>{q.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="w-full py-8 px-6 text-center text-xs mt-auto"
        style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}
      >
        <p>
          <span className="font-bold" style={{ color: GOLD }}>Scripture Lives</span>
          {" "}— a free Bible resource for everyone.
        </p>
        <p className="mt-2" style={{ color: "#c0b89a" }}>
          © 2026 Scripture Lives / Faith Tails &nbsp;·&nbsp; info@scripturelives.com
        </p>
      </footer>

    </div>
  );
}
