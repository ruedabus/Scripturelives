import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEVOTIONALS } from "@/data/devotionals";
import DevotionalSignup from "@/components/DevotionalSignup";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export function generateStaticParams() {
  return DEVOTIONALS.map((_, i) => ({ day: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ day: string }>;
}): Promise<Metadata> {
  const { day } = await params;
  const idx = parseInt(day, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= DEVOTIONALS.length) {
    return { title: "Devotional not found | Scripture Lives" };
  }
  const dev = DEVOTIONALS[idx];
  return {
    title: `${dev.title} — ${dev.reference} | Scripture Lives`,
    description: dev.reflection.slice(0, 160),
    openGraph: {
      title: dev.title,
      description: dev.reflection.slice(0, 160),
      type: "article",
    },
  };
}

export default async function DevotionalDayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  const idx = parseInt(day, 10) - 1;

  if (isNaN(idx) || idx < 0 || idx >= DEVOTIONALS.length) notFound();

  const dev = DEVOTIONALS[idx];
  const dayNum = idx + 1;
  const prevDay = idx > 0 ? idx : null;
  const nextDay = idx < DEVOTIONALS.length - 1 ? idx + 2 : null;

  return (
    <div className="min-h-screen" style={{ background: "#faf8f3", fontFamily: "Georgia, serif" }}>

      {/* ── Language bar ── */}
      <div
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🌐 Language:</span>
        <span className="px-3 py-1 rounded-full text-xs font-black" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
          🇺🇸 English
        </span>
        <Link href="/es/devotionals" className="px-3 py-1 rounded-full text-xs font-black transition hover:opacity-80" style={{ background: GOLD, color: NAVY }}>
          🇪🇸 Español
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav className="hidden md:flex sticky top-0 z-10 bg-white px-5 py-3 items-center gap-3" style={{ borderBottom: "1px solid #ede8de" }}>
        <Link href="/devotionals" className="text-sm font-semibold transition hover:opacity-70" style={{ color: GOLD }}>
          ← Devotionals
        </Link>
        <span style={{ color: "#ddd6c8" }}>|</span>
        <span className="text-sm font-bold" style={{ color: NAVY }}>Day {dayNum} — {dev.title}</span>
      </nav>

      {/* ── Hero ── */}
      <section className="w-full py-14 px-6 text-center" style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #2d1f3d 60%, #1a2640 100%)` }}>
        <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>
          Day {dayNum} of {DEVOTIONALS.length}
        </p>
        <div className="text-5xl mb-4">{dev.icon}</div>
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">
          {dev.title}
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: GOLD }}>
          {dev.reference}
        </p>
      </section>

      {/* ── Content ── */}
      <main className="w-full max-w-2xl mx-auto px-5 py-12 flex flex-col gap-10">

        {/* Verse */}
        <blockquote
          className="rounded-2xl p-6 italic leading-relaxed text-base"
          style={{ background: "white", borderLeft: `4px solid ${GOLD}`, color: "#3a3025", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
        >
          <p>&ldquo;{dev.verse}&rdquo;</p>
          <cite className="block mt-3 not-italic text-xs font-black uppercase tracking-widest" style={{ color: GOLD }}>
            {dev.reference}
          </cite>
        </blockquote>

        {/* Reflection */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: GOLD }}>Reflection</h2>
          <p className="text-base leading-relaxed" style={{ color: "#4a3f30" }}>{dev.reflection}</p>
        </section>

        {/* Prayer */}
        <div className="rounded-2xl p-7" style={{ background: NAVY, border: `1px solid rgba(201,149,42,0.3)` }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🙏</span>
            <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: GOLD }}>Today&apos;s Prayer</h2>
          </div>
          <p className="italic text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.88)" }}>
            &ldquo;{dev.prayer}&rdquo;
          </p>
        </div>

        {/* Open in Bible */}
        <Link
          href={`/bible?book=${encodeURIComponent(dev.book)}&chapter=${dev.chapter}`}
          className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-sm transition hover:opacity-90"
          style={{ background: GOLD, color: NAVY }}
        >
          📖 Read {dev.reference} in the Bible
        </Link>

        {/* Prev / Next */}
        <div className="flex items-center justify-between gap-3 pt-4" style={{ borderTop: "1px solid #ede8de" }}>
          {prevDay ? (
            <Link href={`/devotionals/day/${prevDay}`} className="flex items-center gap-2 text-sm font-bold transition hover:opacity-70" style={{ color: NAVY }}>
              ← Day {prevDay}
            </Link>
          ) : <span />}
          {nextDay ? (
            <Link href={`/devotionals/day/${nextDay}`} className="flex items-center gap-2 text-sm font-bold transition hover:opacity-70" style={{ color: NAVY }}>
              Day {nextDay} →
            </Link>
          ) : <span />}
        </div>
      </main>

      {/* ── Email signup ── */}
      <div className="max-w-2xl mx-auto px-5 pb-12">
        <DevotionalSignup variant="compact" />
      </div>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 text-center text-xs" style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}>
        <p>
          <Link href="/devotionals" className="underline hover:opacity-70" style={{ color: GOLD }}>Devotionals</Link>
          {" "}·{" "}
          <Link href="/" className="underline hover:opacity-70" style={{ color: GOLD }}>Scripture Lives</Link>
        </p>
        <p className="mt-2" style={{ color: "#c0b89a" }}>© 2026 Scripture Lives · info@scripturelives.com</p>
      </footer>
    </div>
  );
}
