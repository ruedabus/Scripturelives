import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, CATEGORY_COLORS, type BlogCategory } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "Devotionals & Bible Studies | Scripture Lives",
  description:
    "Original devotional articles, verse-by-verse Bible studies, and reflections on prayer, faith, and God's Word. Grow deeper in your walk with Christ.",
};

// ── Category filter pill (server component, no interactivity needed — SEO wants all links visible) ──
function CategoryPill({ category }: { category: BlogCategory }) {
  const col = CATEGORY_COLORS[category];
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${col.bg} ${col.text}`}
    >
      {category}
    </span>
  );
}

// ── Article card ────────────────────────────────────────────────────────────
function ArticleCard({ post }: { post: (typeof blogPosts)[number] }) {
  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Emoji / cover block */}
      <div className="flex items-center justify-center h-24 bg-gradient-to-br from-amber-50 to-orange-50 text-5xl select-none">
        {post.coverEmoji}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Category + read time */}
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryPill category={post.category} />
          <span className="text-xs text-gray-400">{post.readingTimeMin} min read</span>
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-gray-900 leading-snug group-hover:text-amber-700 transition-colors">
          {post.title}
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{post.subtitle}</p>

        {/* Key verse */}
        <blockquote className="border-l-2 border-amber-300 pl-3 text-xs italic text-gray-600 leading-relaxed">
          "{post.keyVerse.length > 120 ? post.keyVerse.slice(0, 120) + "…" : post.keyVerse}"
          <br />
          <span className="not-italic font-semibold text-amber-700">{post.keyVerseRef}</span>
        </blockquote>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
          <time className="text-[11px] text-gray-400">{date}</time>
          <Link
            href={`/devotionals/${post.slug}`}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
          >
            Read article →
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function DevotionalsPage() {
  // Sort newest first
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const categories = Array.from(new Set(blogPosts.map((p) => p.category))) as BlogCategory[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Nav strip ───────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link href="/" className="text-sm text-amber-700 hover:text-amber-900 font-semibold transition-colors">
          ← Back to Bible Reader
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-bold text-gray-800">Devotionals</span>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <header className="bg-gradient-to-b from-white to-amber-50 px-4 py-12 text-center border-b border-amber-100">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-3">📖</div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Devotionals & Bible Studies
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Original articles to help you go deeper into God's Word — exploring key passages,
            biblical characters, and timeless truths for everyday life.
          </p>
        </div>

        {/* Category pills — all visible for SEO */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => {
            const col = CATEGORY_COLORS[cat];
            return (
              <span
                key={cat}
                className={`rounded-full px-3 py-1 text-xs font-semibold border ${col.bg} ${col.text}`}
              >
                {cat}
              </span>
            );
          })}
        </div>
      </header>

      {/* ── Article grid ────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-400 mb-6">{sorted.length} articles</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white px-4 py-8 text-center mt-8">
        <p className="text-sm text-gray-500">
          All articles are original content by{" "}
          <span className="font-semibold text-amber-700">Scripture Lives</span>. Scripture
          quotations are used for study and commentary purposes.
        </p>
        <Link
          href="/"
          className="mt-3 inline-block text-sm text-amber-700 hover:underline font-semibold"
        >
          Explore the Bible Reader →
        </Link>
      </footer>
    </div>
  );
}
