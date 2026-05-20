import type { Metadata } from "next";
import Link from "next/link";
import PayPalButton from "@/components/PayPalButton";

export const metadata: Metadata = {
  title: "Apoya Scripture Lives — Donar",
  description: "Ayuda a mantener Scripture Lives gratuito para todos. Tu donación apoya el servidor, el desarrollo y nuestra misión de hacer la Biblia accesible en todo el mundo.",
};

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export default function DonatePageES() {
  return (
    <div className="min-h-screen" style={{ background: "#faf8f3", fontFamily: "Georgia, serif" }}>

      {/* ── Language bar ── */}
      <div
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🌐 Idioma:</span>
        <Link
          href="/donate"
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

      {/* ── Top nav ── */}
      <header style={{ background: NAVY }} className="text-white px-6 py-4 flex items-center justify-between">
        <Link href="/es" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Hand-painted cross_logo.png" alt="Scripture Lives" className="h-10 w-10 object-contain" />
          <span className="text-lg font-bold" style={{ color: GOLD }}>Scripture Lives</span>
        </Link>
        <Link href="/es" className="text-sm transition hover:opacity-80" style={{ color: "rgba(255,255,255,0.7)" }}>
          ← Inicio
        </Link>
      </header>

      {/* ── Hero ── */}
      <section
        className="text-white px-6 py-16 text-center"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2d1f3d 100%)` }}
      >
        <div className="max-w-xl mx-auto">
          <span className="text-5xl mb-4 block">🙏</span>
          <h1 className="text-3xl font-bold mb-3" style={{ color: GOLD }}>Apoya Scripture Lives</h1>
          <p className="leading-7" style={{ color: "rgba(255,255,255,0.8)" }}>
            Scripture Lives es completamente gratuito y siempre lo será.
            Tu generoso regalo ayuda a cubrir los costos del servidor, el desarrollo continuo
            y nuestra misión de poner la Palabra de Dios en más manos alrededor del mundo.
          </p>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-6 py-14 space-y-10">

        {/* ── Versículo ── */}
        <blockquote
          className="rounded-xl px-8 py-6 text-center"
          style={{ border: `1px solid rgba(201,149,42,0.4)`, background: "rgba(201,149,42,0.06)" }}
        >
          <p className="text-base font-semibold italic leading-8" style={{ color: "#7c5a10" }}>
            &ldquo;Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad,
            porque Dios ama al dador alegre.&rdquo;
          </p>
          <p className="mt-2 text-sm" style={{ color: GOLD }}>— 2 Corintios 9:7</p>
        </blockquote>

        {/* ── A dónde va tu donación ── */}
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: NAVY }}>A dónde va tu donación</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "🖥️",
                label: "Hosting e Infraestructura",
                desc: "Manteniendo los servidores activos 24/7 para cada visitante en el mundo.",
              },
              {
                icon: "⚙️",
                label: "Desarrollo",
                desc: "Agregando nuevas funciones como la Biblia en audio, más traducciones y herramientas de estudio.",
              },
              {
                icon: "🌍",
                label: "Alcance Global",
                desc: "Expandiendo el acceso para que creyentes en todas las naciones puedan estudiar la Palabra.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-5 text-center"
                style={{ border: "1px solid #ede8de", background: "white" }}
              >
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <p className="text-sm font-semibold mb-1" style={{ color: NAVY }}>{item.label}</p>
                <p className="text-xs leading-5" style={{ color: "#6b7280" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Donar por PayPal ── */}
        <section
          className="rounded-xl px-8 py-8 text-center"
          style={{ border: "2px solid rgba(0,112,186,0.3)", background: "white" }}
        >
          <h2 className="text-xl font-bold mb-2" style={{ color: NAVY }}>Donar con PayPal</h2>
          <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
            Donación segura, única o recurrente. Cualquier monto es profundamente apreciado.
          </p>
          <PayPalButton />
        </section>

        {/* ── Nota de agradecimiento ── */}
        <section className="text-center">
          <p className="text-sm leading-7" style={{ color: "#57534e" }}>
            Cada regalo — sin importar el monto — hace una diferencia real.
            Gracias por asociarte con Scripture Lives para hacer que la Palabra de Dios
            sea accesible para el mundo. Que el Señor te bendiga por tu generosidad.
          </p>
          <p className="mt-3 font-semibold" style={{ color: GOLD }}>— El Equipo de Scripture Lives</p>
        </section>

        {/* ── Contacto ── */}
        <section className="text-center pt-8" style={{ borderTop: "1px solid #ede8de" }}>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            ¿Preguntas sobre tu donación? Escríbenos a{" "}
            <a href="mailto:info@scripturelives.com" className="font-medium hover:underline" style={{ color: GOLD }}>
              info@scripturelives.com
            </a>
          </p>
        </section>

      </main>

      {/* ── Pie de página ── */}
      <footer
        className="py-8 text-center text-sm"
        style={{ color: "#9ca3af", borderTop: "1px solid #ede8de", background: "white" }}
      >
        <p>&copy; 2026 Scripture Lives. Todos los derechos reservados.</p>
        <div className="mt-2 flex justify-center gap-6 flex-wrap">
          <Link href="/es/about"  className="hover:opacity-70 transition" style={{ color: GOLD }}>Acerca de</Link>
          <Link href="/terms"     className="hover:opacity-70 transition">Términos</Link>
          <Link href="/es/donate" className="hover:opacity-70 transition">Donar</Link>
          <Link href="/es"        className="hover:opacity-70 transition">Inicio</Link>
        </div>
      </footer>
    </div>
  );
}
