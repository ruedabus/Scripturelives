import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, type BlogCategory } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "Devotionals & Bible Studies | Scripture Lives",
  description:
    "Original devotional articles, verse-by-verse Bible studies, and reflections on prayer, faith, and God's Word. Grow deeper in your walk with Christ.",
};

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD = "#C9952A";
const NAVY = "#1a2640";

// ── Photo per category ────────────────────────────────────────────────────────
const CATEGORY_PHOTO: Record<BlogCategory, string> = {
  "Devotional":          "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=640&q=75",
  "Bible Study":         "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=640&q=75",
  "Prayer":              "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=640&q=75",
  "Faith & Trust":       "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=640&q=75",
  "Grace & Forgiveness": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&q=75",
  "Purpose & Calling":   "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=640&q=75",
};

// ── Category badge colour ─────────────────────────────────────────────────────
const BADGE: Record<BlogCategory, { bg: string; text: string }> = {
  "Devotional":          { bg: "rgba(201,149,42,0.18)",  text: "#92400e" },
  "Bible Study":         { bg: "rgba(59,130,246,0.15)",  text: "#1e40af" },
  "Prayer":              { bg: "rgba(16,185,129,0.15)",  text: "#065f46" },
  "Faith & Trust":       { bg: "rgba(139,92,246,0.15)",  text: "#5b21b6" },
  "Grace & Forgiveness": { bg: "rgba(236,72,153,0.15)",  text: "#9d174d" },
  "Purpose & Calling":   { bg: "rgba(245,158,11,0.15)",  text: "#92400e" },
};

// ── Article card ──────────────────────────────────────────────────────────────
function ArticleCard({ post, featured = false }: { post: (typeof blogPosts)[number]; featured?: boolean }) {
  const badge  = BADGE[post.category as BlogCategory] ?? { bg: "rgba(0,0,0,0.08)", text: "#374151" };
  const photo  = CATEGORY_PHOTO[post.category as BlogCategory];

  return (
    <Link
      href={`/devotionals/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden transition hover:-translate-y-1"
      style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #ede8de" }}
    >
      {/* Photo */}
      <div className={`relative overflow-hidden ${featured ? "h-52" : "h-40"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Subtle bottom scrim so badge is readable */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
        {/* Category badge over image */}
        <span
          className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.92)", color: GOLD }}
        >
          {post.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <h2
          className="font-bold leading-snug transition-colors group-hover:opacity-75"
          style={{ fontSize: featured ? "1.1rem" : "0.95rem", color: NAVY }}
        >
          {post.title}
        </h2>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#6b7280" }}>
          {post.subtitle}
        </p>

        {/* Footer row */}
        <div className="mt-auto pt-3 flex items-center justify-between" style={{ borderTop: "1px solid #f0ece3" }}>
          <span className="text-xs" style={{ color: "#9ca3af" }}>{post.readingTimeMin} min read</span>
          <span className="text-xs font-bold transition-opacity group-hover:opacity-60" style={{ color: GOLD }}>→</span>
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DevotionalsPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const [featured, ...rest] = sorted;
  const categories = Array.from(new Set(blogPosts.map((p) => p.category))) as BlogCategory[];

  return (
    <div className="min-h-screen" style={{ background: "#faf8f3" }}>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-10 bg-white px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #ede8de" }}>
        <Link href="/" className="text-sm font-semibold transition hover:opacity-70" style={{ color: GOLD }}>
          ← Back
        </Link>
        <span style={{ color: "#ddd6c8" }}>|</span>
        <span className="text-sm font-bold" style={{ color: NAVY }}>Devotionals</span>
      </nav>

      {/* ── Hero header ── */}
      <header className="relative overflow-hidden" style={{ borderBottom: "1px solid #ede8de" }}>
        {/* Background photo with overlay */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1400&q=75"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.35)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,36,64,0.6) 0%, rgba(26,36,64,0.85) 100%)" }} />

        <div className="relative z-10 px-5 py-20 text-center max-w-2xl mx-auto">
          {/* Gold line + label */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background: GOLD }} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: GOLD }}>Scripture Lives</span>
            <div className="h-px w-10" style={{ background: GOLD }} />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Devotionals &amp;<br />
            <span style={{ color: GOLD }}>Bible Studies</span>
          </h1>

          <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
            Original articles to help you go deeper into God&apos;s Word — exploring key passages,
            biblical characters, and timeless truths for everyday life.
          </p>

          {/* Category list — plain text, no pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {categories.map((cat) => (
              <span key={cat} className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">

        {/* ── Featured article (first / newest) ── */}
        {featured && (
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: GOLD }}>Featured</p>
            <Link
              href={`/devotionals/${featured.slug}`}
              className="group grid md:grid-cols-2 rounded-2xl overflow-hidden transition hover:-translate-y-0.5"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)", border: "1px solid #ede8de" }}
            >
              {/* Photo */}
              <div className="relative h-56 md:h-auto overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CATEGORY_PHOTO[featured.category as BlogCategory]}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              {/* Text */}
              <div className="bg-white p-8 flex flex-col justify-center gap-3">
                <span
                  className="self-start text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: BADGE[featured.category as BlogCategory]?.bg, color: BADGE[featured.category as BlogCategory]?.text }}
                >
                  {featured.category}
                </span>
                <h2 className="text-2xl font-black leading-snug group-hover:opacity-75 transition" style={{ color: NAVY }}>
                  {featured.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{featured.subtitle}</p>
                <div className="flex items-center gap-4 mt-2 pt-4" style={{ borderTop: "1px solid #f0ece3" }}>
                  <span className="text-xs" style={{ color: "#9ca3af" }}>{featured.readingTimeMin} min read</span>
                  <span className="text-sm font-bold" style={{ color: GOLD }}>Read article →</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ── Grid ── */}
        <p className="text-xs font-semibold mb-5" style={{ color: "#9ca3af" }}>{rest.length} more articles</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white px-5 py-8 text-center mt-4" style={{ borderTop: "1px solid #ede8de" }}>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          All articles are original content by{" "}
          <span className="font-bold" style={{ color: GOLD }}>Scripture Lives</span>.
        </p>
        <Link href="/" className="mt-2 inline-block text-sm font-bold hover:opacity-70 transition" style={{ color: NAVY }}>
          ← Back to Bible Reader
        </Link>
      </footer>
    </div>
  );
}
