import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEVOTIONALS_ES } from "@/data/devotionals-es";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

// ── Static params ─────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return DEVOTIONALS_ES.map((_, i) => ({ day: String(i + 1) }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ day: string }>;
}): Promise<Metadata> {
  const { day } = await params;
  const idx = parseInt(day, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= DEVOTIONALS_ES.length) {
    return { title: "Devocional no encontrado | Scripture Lives" };
  }
  const dev = DEVOTIONALS_ES[idx];
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function DevotionalDayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day } = await params;
  const idx = parseInt(day, 10) - 1;

  if (isNaN(idx) || idx < 0 || idx >= DEVOTIONALS_ES.length) {
    notFound();
  }

  const dev = DEVOTIONALS_ES[idx];
  const dayNum = idx + 1;
  const prevDay = idx > 0 ? idx : null;
  const nextDay = idx < DEVOTIONALS_ES.length - 1 ? idx + 2 : null;

  return (
    <div className="min-h-screen" style={{ background: "#faf8f3" }}>

      {/* ── Nav ── */}
      <nav
        className="sticky top-0 z-10 bg-white px-5 py-3 flex items-center gap-3"
        style={{ borderBottom: "1px solid #ede8de" }}
      >
        <Link
          href="/es/devotionals"
          className="text-sm font-semibold transition hover:opacity-70"
          style={{ color: GOLD }}
        >
          ← Devocionales
        </Link>
        <span style={{ color: "#ddd6c8" }}>|</span>
        <Link
          href="/"
          className="text-sm transition hover:opacity-60"
          style={{ color: "#9ca3af" }}
        >
          Lector Bíblico
        </Link>
      </nav>

      {/* ── Hero ── */}
      <header
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${NAVY} 0%, #2d1f3d 60%, #1a2640 100%)`,
          borderBottom: `1px solid rgba(201,149,42,0.2)`,
        }}
      >
        <div className="max-w-3xl mx-auto px-5 py-14 text-center">
          {/* Day badge */}
          <span
            className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(201,149,42,0.2)", color: GOLD }}
          >
            Día {dayNum} · Devocional
          </span>

          {/* Icon */}
          <div className="text-6xl mb-5 select-none">{dev.icon}</div>

          <h1
            className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3"
            style={{ textShadow: `0 2px 20px rgba(201,149,42,0.3)` }}
          >
            {dev.title}
          </h1>

          <p className="text-sm font-bold" style={{ color: GOLD }}>
            {dev.reference}
          </p>
        </div>
      </header>

      {/* ── Key verse ── */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-2">
        <blockquote
          className="rounded-2xl px-6 py-6"
          style={{
            background: "white",
            borderLeft: `4px solid ${GOLD}`,
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          }}
        >
          <p
            className="text-base sm:text-lg italic leading-relaxed mb-3"
            style={{ color: "#3a3025" }}
          >
            "{dev.verse}"
          </p>
          <footer
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: GOLD }}
          >
            {dev.reference}
          </footer>
        </blockquote>
      </div>

      {/* ── Reflection ── */}
      <main className="max-w-3xl mx-auto px-4 pb-12 pt-6">

        {/* Reflection section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: "#ede8de" }} />
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: GOLD }}
            >
              Reflexión
            </span>
            <div className="h-px flex-1" style={{ background: "#ede8de" }} />
          </div>
          <p
            className="text-base sm:text-lg leading-relaxed"
            style={{ color: "#3a3025" }}
          >
            {dev.reflection}
          </p>
        </section>

        {/* Prayer section */}
        <section
          className="rounded-3xl p-7 mb-8"
          style={{
            background: NAVY,
            border: `1px solid rgba(201,149,42,0.25)`,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🙏</span>
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: GOLD }}
            >
              Oración
            </span>
          </div>
          <p
            className="text-sm sm:text-base italic leading-relaxed"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            {dev.prayer}
          </p>
        </section>

        {/* ── Prev / Next nav ── */}
        <div className="flex items-center justify-between gap-4 mt-10">
          {prevDay !== null ? (
            <Link
              href={`/es/devotionals/${prevDay}`}
              className="flex items-center gap-2 text-sm font-bold transition hover:opacity-70"
              style={{ color: NAVY }}
            >
              ← Día {prevDay}
            </Link>
          ) : (
            <span />
          )}

          <Link
            href="/es/devotionals"
            className="text-xs font-bold uppercase tracking-widest transition hover:opacity-70"
            style={{ color: "#9ca3af" }}
          >
            Todos los devocionales
          </Link>

          {nextDay !== null ? (
            <Link
              href={`/es/devotionals/${nextDay}`}
              className="flex items-center gap-2 text-sm font-bold transition hover:opacity-70"
              style={{ color: NAVY }}
            >
              Día {nextDay} →
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* ── Author strip ── */}
        <div
          className="mt-8 flex items-center justify-between flex-wrap gap-3 rounded-xl bg-white px-5 py-4"
          style={{ border: "1px solid #ede8de" }}
        >
          <div>
            <p className="text-xs" style={{ color: "#9ca3af" }}>Por</p>
            <p className="text-sm font-semibold" style={{ color: "#374151" }}>
              Scripture Lives
            </p>
          </div>
          <Link
            href="/es/devotionals"
            className="text-sm font-semibold transition hover:opacity-70"
            style={{ color: GOLD }}
          >
            Ver más devocionales →
          </Link>
        </div>
      </main>

      {/* ── CTA footer ── */}
      <footer
        className="px-4 py-12 text-center"
        style={{ background: "white", borderTop: "1px solid #ede8de" }}
      >
        <div className="text-4xl mb-4">📖</div>
        <h3 className="text-lg font-black mb-2" style={{ color: NAVY }}>
          ¿Listo para profundizar más?
        </h3>
        <p className="text-sm mb-5 max-w-sm mx-auto" style={{ color: "#6b7280" }}>
          Usa el Lector Bíblico de Scripture Lives para explorar cualquier pasaje,
          comparar traducciones y estudiar el texto original.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl text-white text-sm font-semibold px-6 py-3 transition hover:opacity-90"
          style={{ background: GOLD }}
        >
          Abrir el Lector Bíblico
        </Link>
      </footer>
    </div>
  );
}
