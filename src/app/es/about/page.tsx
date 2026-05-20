import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acerca de — Scripture Lives",
  description: "Nuestra misión, historia y el corazón detrás de Scripture Lives.",
};

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export default function AboutPageES() {
  return (
    <div className="min-h-screen" style={{ background: "#faf8f3", fontFamily: "Georgia, serif" }}>

      {/* ── Language bar ── */}
      <div
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🌐 Idioma:</span>
        <Link
          href="/about"
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
        className="text-white px-6 py-20 text-center"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2d1f3d 100%)` }}
      >
        <div className="max-w-2xl mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Hand-painted cross_logo.png"
            alt="Scripture Lives"
            className="h-24 w-24 mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-bold mb-4" style={{ color: GOLD }}>Scripture Lives</h1>
          <p className="text-lg leading-8" style={{ color: "rgba(255,255,255,0.8)" }}>
            Una plataforma bíblica gratuita, construida sobre la convicción de que la Palabra de Dios
            está viva, activa y profundamente relevante para cada persona en la tierra — hoy.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* ── Misión ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">✝️</span>
            <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Nuestra Misión</h2>
          </div>
          <div
            className="rounded-xl px-8 py-8"
            style={{ border: `1px solid rgba(201,149,42,0.4)`, background: "rgba(201,149,42,0.06)" }}
          >
            <p
              className="text-lg font-semibold italic leading-9 text-center"
              style={{ color: "#7c5a10" }}
            >
              &ldquo;Hacer que la Palabra de Dios sea accesible, comprensible y compartible
              para cada creyente — y cada buscador — donde sea que estén en el mundo.&rdquo;
            </p>
          </div>
          <p className="mt-6 leading-8" style={{ color: "#57534e" }}>
            Scripture Lives fue construida sobre una creencia simple: la Biblia no debería estar bloqueada
            detrás de software complicado, suscripciones costosas o jerga académica. Ya seas un estudiante
            de toda la vida de las Escrituras, un nuevo creyente encontrando tu camino, o alguien que
            simplemente sintió curiosidad por lo que la Biblia realmente dice — esta plataforma es para ti.
            Todo aquí es gratuito, y tenemos la intención de mantenerlo así.
          </p>
        </section>

        {/* ── Quiénes somos ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">🤝</span>
            <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Quiénes Somos</h2>
          </div>
          <p className="leading-8 mb-4" style={{ color: "#57534e" }}>
            Scripture Lives es un proyecto de ministerio independiente iniciado por un seguidor de Cristo
            con pasión por la tecnología y un profundo amor por la Palabra de Dios. No somos una
            iglesia, una denominación ni una institución teológica — simplemente somos creyentes
            que quieren usar herramientas modernas para poner las Escrituras en más manos, mentes y corazones.
          </p>
          <p className="leading-8 mb-4" style={{ color: "#57534e" }}>
            Sostenemos la autoridad y suficiencia de las Escrituras, el señorío de Jesucristo
            y el poder del Espíritu Santo para iluminar la Palabra de Dios a toda persona que
            lo busque sinceramente. Aunque Scripture Lives es no denominacional y da la bienvenida
            a cristianos de todas las tradiciones, cada función de esta plataforma está diseñada para señalar
            a las personas de regreso a la Biblia misma — no a ningún sistema doctrinal particular.
          </p>
          <p className="leading-8" style={{ color: "#57534e" }}>
            Somos un equipo pequeño con una visión grande: que algún día personas en todas las naciones
            abran Scripture Lives en su teléfono y encuentren la Palabra viva esperándolos en
            un idioma y formato con el que puedan conectarse profundamente.
          </p>
        </section>

        {/* ── Lo que creemos ── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">📖</span>
            <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Lo que Creemos</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: "✝️",
                title: "Las Escrituras",
                body: "Creemos que la Biblia es la Palabra de Dios inspirada y autoritativa — completamente suficiente para la salvación y la vida de fe.",
              },
              {
                icon: "🙏",
                title: "La Oración",
                body: "Creemos que cada sesión con la Palabra de Dios debe comenzar con oración, y construimos devocionales diarios y reflexiones de estudio con ese ritmo en mente.",
              },
              {
                icon: "🌍",
                title: "Accesibilidad",
                body: "La Palabra de Dios le pertenece a todos. Siempre ofreceremos acceso gratuito y trabajaremos para que Scripture Lives esté disponible en todos los dispositivos y conexiones.",
              },
              {
                icon: "🤝",
                title: "Comunidad",
                body: "La fe crece en comunidad. Nuestras funciones de compartir están diseñadas para ayudarte a traer a otros a lo que estás descubriendo en las Escrituras.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-6"
                style={{ border: "1px solid #ede8de", background: "white" }}
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <h3 className="font-semibold mb-2" style={{ color: NAVY }}>{item.title}</h3>
                <p className="text-sm leading-6" style={{ color: "#6b7280" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Apoya la misión ── */}
        <section
          className="rounded-xl px-8 py-10 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2d1f3d 100%)` }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: GOLD }}>Apoya la Misión</h2>
          <p className="leading-7 mb-6 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
            Scripture Lives es gratuito y siempre lo será. Si esta plataforma te ha bendecido,
            considera hacer una pequeña donación para ayudar a cubrir los costos del servidor,
            el desarrollo y nuestro objetivo de alcanzar a más personas alrededor del mundo.
          </p>
          <Link
            href="/donate"
            className="inline-block rounded-xl px-8 py-3 font-semibold transition hover:opacity-90"
            style={{ background: GOLD, color: NAVY }}
          >
            Hacer una Donación →
          </Link>
        </section>

        {/* ── Contáctanos ── */}
        <section className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">✉️</span>
            <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Contáctanos</h2>
          </div>
          <p className="leading-8" style={{ color: "#57534e" }}>
            ¿Tienes una pregunta, un testimonio o simplemente quieres saludar? Nos encantaría
            saber de ti. Escríbenos a{" "}
            <a
              href="mailto:info@scripturelives.com"
              className="font-semibold hover:underline"
              style={{ color: GOLD }}
            >
              info@scripturelives.com
            </a>{" "}
            y haremos nuestro mejor esfuerzo para responder con prontitud.
          </p>
        </section>

      </main>

      {/* ── Pie de página ── */}
      <footer
        className="py-8 text-center text-sm mt-auto"
        style={{ color: "#9ca3af", borderTop: "1px solid #ede8de", background: "white" }}
      >
        <p>&copy; 2026 Scripture Lives. Todos los derechos reservados.</p>
        <div className="mt-2 flex justify-center gap-6 flex-wrap">
          <Link href="/es/about" className="transition hover:opacity-70" style={{ color: GOLD }}>Acerca de</Link>
          <Link href="/terms"    className="hover:opacity-70 transition">Términos</Link>
          <Link href="/donate"   className="hover:opacity-70 transition">Donar</Link>
          <Link href="/es"       className="hover:opacity-70 transition">Inicio</Link>
        </div>
      </footer>

    </div>
  );
}
