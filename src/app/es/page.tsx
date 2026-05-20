import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scripture Lives — Herramientas Bíblicas Gratuitas para Todos",
  description:
    "Lee la Biblia, recibe devocionales diarios, ora con otros, explora historias para niños y juega juegos bíblicos — gratis, para todos.",
};

const GOLD = "#C9952A";
const NAVY = "#1a2640";

// ── Tarjetas de características ───────────────────────────────────────────────
const FEATURES = [
  {
    title: "Lee la Biblia",
    desc: "Explora cualquier pasaje con múltiples traducciones, comentarios, concordancia Strong y referencias cruzadas.",
    href: "/bible?tab=bible",
    cta: "Abrir la Biblia",
    photo: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=640&q=75",
  },
  {
    title: "Devocionales Diarios",
    desc: "Un versículo breve, reflexión y oración entregados cada mañana — en inglés o español.",
    href: "/es/devotionals",
    cta: "Leer el de Hoy",
    photo: "/daily-devotional.png",
  },
  {
    title: "Muro de Oración",
    desc: "Comparte tus peticiones de oración y ora por otros en nuestro muro comunitario.",
    href: "/es/prayer",
    cta: "Visitar el Muro",
    photo: "/prayer-wall.png",
  },
  {
    title: "Música de Adoración",
    desc: "Listas de adoración para acompañar tu tiempo en la Palabra de Dios — canta y acércate más a Cristo.",
    href: "/music",
    cta: "Escuchar Ahora",
    photo: "/worship.png",
  },
  {
    title: "Historias para Niños",
    desc: "Faith Tails — hermosos libros de historias bíblicas ilustrados y videos para niños.",
    href: "/es/kids",
    cta: "Explorar para Niños",
    photo: "/Kids-stories.png",
  },
  {
    title: "Juegos Bíblicos",
    desc: "Torneos de Bible Bowl, Wordle, Sopa de Letras y más — diversión para toda la familia.",
    href: "/games",
    cta: "Jugar Ahora",
    photo: "/Bible-games.png",
  },
];

// ── Enlaces rápidos ───────────────────────────────────────────────────────────
const QUICK = [
  { icon: "✝", label: "El Evangelio",       href: "/es/gospel" },
  { icon: "🎵", label: "Música de Adoración", href: "/music" },
  { icon: "⛪", label: "Encuentra una Iglesia", href: "/es/find-a-church" },
  { icon: "🛍️", label: "Tienda",             href: "/shop" },
  { icon: "🇺🇸", label: "In English",         href: "/" },
];

export default function SpanishHomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf8f3", fontFamily: "Georgia, serif" }}>

      {/* ── Barra de idioma ── */}
      <div
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🌐 Idioma:</span>
        <Link
          href="/"
          className="px-3 py-1 rounded-full text-xs font-black transition hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)" }}
        >
          🇺🇸 English
        </Link>
        <span
          className="px-3 py-1 rounded-full text-xs font-black"
          style={{ background: GOLD, color: NAVY }}
        >
          🇪🇸 Español
        </span>
      </div>

      {/* ── Hero ── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #2d1f3d 55%, #1a2640 100%)` }}
      >
        {/* Biblia abierta — fondo de ancho completo */}
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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right, ${NAVY}dd 0%, ${NAVY}88 50%, ${NAVY}44 100%)`,
          }}
        />

        {/* Contenido */}
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
            La Palabra de Dios,<br />
            <span style={{ color: GOLD }}>Para Todos.</span>
          </h1>

          <p
            className="text-base sm:text-lg max-w-xl leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            Herramientas bíblicas gratuitas, devocionales diarios, historias para niños,
            oración y juegos — todo en un solo lugar, en inglés y español.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/bible"
              className="px-8 py-4 rounded-2xl font-black text-base transition hover:opacity-90 hover:scale-105 active:scale-95"
              style={{ background: GOLD, color: NAVY }}
            >
              ✨ Descubre Scripture Lives
            </Link>
            <Link
              href="/es/gospel"
              className="px-8 py-4 rounded-2xl font-black text-base transition hover:opacity-80 border"
              style={{ borderColor: "rgba(201,149,42,0.5)", color: "white" }}
            >
              ✝ El Evangelio
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tarjetas de características ── */}
      <section id="features" className="w-full max-w-6xl mx-auto px-4 py-16">
        <p
          className="text-center text-[10px] font-black uppercase tracking-[0.25em] mb-10"
          style={{ color: GOLD }}
        >
          Todo en Scripture Lives
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden transition hover:-translate-y-1"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #ede8de" }}
            >
              {/* Foto */}
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

              {/* Cuerpo */}
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

      {/* ── Banner del Evangelio ── */}
      <section className="w-full max-w-3xl mx-auto px-4 pb-12">
        <Link
          href="/es/gospel"
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
              ¿Nuevo Aquí?
            </p>
            <h3 className="text-xl font-black text-white mb-1">
              Escucha las Mejores Noticias que Jamás Escucharás
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              Dos minutos que pueden cambiar tu vida — y tu eternidad.
            </p>
          </div>
          <span
            className="shrink-0 px-6 py-3 rounded-2xl text-sm font-black transition group-hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}
          >
            Lee el Evangelio →
          </span>
        </Link>
      </section>

      {/* ── Enlaces rápidos ── */}
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

      {/* ── Pie de página ── */}
      <footer
        className="w-full py-8 px-6 text-center text-xs mt-auto"
        style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}
      >
        <p>
          <span className="font-bold" style={{ color: GOLD }}>Scripture Lives</span>
          {" "}— un recurso bíblico gratuito para todos.
        </p>
        <p className="mt-2" style={{ color: "#c0b89a" }}>
          © 2026 Scripture Lives / Faith Tails &nbsp;·&nbsp; info@scripturelives.com
        </p>
      </footer>

    </div>
  );
}
