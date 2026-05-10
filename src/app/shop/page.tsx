import Image from "next/image";
import Link from "next/link";

const GOLD = "#C9952A";
const NAVY = "#1a2640";
const STORE_URL = "https://scripturelives.printful.me";

export const metadata = {
  title: "Shop — Faith Tails & Scripture Lives",
  description: "Wear your faith. Faith Tails and Scripture Lives merch — print-on-demand, ships worldwide.",
};

const PRODUCTS = [
  {
    id: 1,
    name: "Go Ahead, Scan Me — Evangelism Tee",
    description: "The QR code links straight to the Gospel. One scan could change someone's eternity.",
    price: "From $29.99",
    image: "/scan-me-tshirt-frontv2-qr.png",
    badge: "NEW",
    colors: ["#1a1a1a", "#2c2c2c", "#1f3356", "#5c5840", "#707070", "#b0b0b0", "#f5f5f5"],
    href: STORE_URL,
  },
  {
    id: 2,
    name: "Faith Tails — Mav & Moony Tee",
    description: "Mav and Moony suited up and ready for adventure. Perfect for kids and families.",
    price: "From $24.50",
    image: "/FT-Tshirtfront.png",
    badge: "FAN FAVORITE",
    colors: ["#ffffff"],
    href: STORE_URL,
  },
];

export default function ShopPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#f9f7f2" }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="w-full py-16 px-6 text-center"
        style={{
          background: `linear-gradient(160deg, ${NAVY} 0%, #2d1f3d 60%, #1a2640 100%)`,
          borderBottom: `3px solid ${GOLD}`,
        }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
          Faith Tails × Scripture Lives
        </p>
        <h1
          className="text-4xl sm:text-5xl font-black leading-tight text-white mb-4"
          style={{ textShadow: "0 2px 20px rgba(201,149,42,0.4)" }}
        >
          Wear Your Faith
        </h1>
        <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
          Every shirt is a conversation starter. Print-on-demand — no inventory, ships worldwide.
        </p>

        <a
          href={STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 px-8 py-4 rounded-2xl font-black text-base transition hover:opacity-90 hover:scale-105"
          style={{ background: GOLD, color: NAVY }}
        >
          Visit the Full Store →
        </a>
      </section>

      {/* ── Products ──────────────────────────────────────────────────────── */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16">
        <h2
          className="text-2xl font-black text-center mb-12 uppercase tracking-widest"
          style={{ color: NAVY }}
        >
          Available Now
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── Gospel CTA ────────────────────────────────────────────────────── */}
      <section
        className="w-full py-14 px-6 text-center"
        style={{ background: NAVY, borderTop: `3px solid ${GOLD}` }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
          The Message Behind the Merch
        </p>
        <h3 className="text-2xl font-black text-white mb-4">
          Every QR code links to the Gospel.
        </h3>
        <p className="text-sm max-w-md mx-auto leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
          Scan the code on the shirt — or read the best news you&apos;ll ever hear right now.
        </p>
        <Link
          href="/gospel"
          className="inline-block px-8 py-4 rounded-2xl font-black text-base transition hover:opacity-90"
          style={{ background: GOLD, color: NAVY }}
        >
          Read the Gospel ✝
        </Link>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-6 text-center text-xs"
        style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}
      >
        <p>
          Shop powered by{" "}
          <a href={STORE_URL} target="_blank" rel="noopener noreferrer"
            className="underline hover:opacity-70" style={{ color: GOLD }}>
            Printful
          </a>
          {" "}·{" "}
          <Link href="/" className="underline hover:opacity-70" style={{ color: GOLD }}>
            Scripture Lives
          </Link>
        </p>
        <p className="mt-2" style={{ color: "#c0b89a" }}>
          © 2026 Faith Tails / Scripture Lives. All rights reserved.
        </p>
      </footer>

    </main>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: {
  product: {
    name: string;
    description: string;
    price: string;
    image: string;
    badge: string;
    colors: string[];
    href: string;
  }
}) {
  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden transition hover:shadow-xl"
      style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
    >
      {/* Image */}
      <div className="relative w-full" style={{ background: "#1c1c1c", aspectRatio: "4/5" }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4"
        />
        {/* Badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: GOLD, color: NAVY }}
        >
          {product.badge}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 p-6">
        <h3 className="text-lg font-black leading-snug" style={{ color: NAVY }}>
          {product.name}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#7a6f60" }}>
          {product.description}
        </p>

        {/* Color swatches */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: "#9a8f80" }}>Colors:</span>
          {product.colors.map((c, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 flex-shrink-0"
              style={{
                background: c,
                borderColor: c === "#f5f5f5" ? "#cccccc" : GOLD,
              }}
            />
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-black" style={{ color: NAVY }}>
            {product.price}
          </span>
          <a
            href={product.href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl font-black text-sm transition hover:opacity-90 hover:scale-105"
            style={{ background: NAVY, color: "white" }}
          >
            Shop Now →
          </a>
        </div>
      </div>
    </div>
  );
}
