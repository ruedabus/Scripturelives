import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  blogPosts,
  getPostBySlug,
  getRelatedPosts,
  CATEGORY_COLORS,
  type BlogPost,
} from "@/data/blogPosts";

// ── Static generation ────────────────────────────────────────────────────────
export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

// ── Dynamic metadata per article ────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article Not Found | Scripture Lives" };

  return {
    title: `${post.title} | Scripture Lives`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  };
}

// ── Related article mini-card ────────────────────────────────────────────────
function RelatedCard({ post }: { post: BlogPost }) {
  const col = CATEGORY_COLORS[post.category];
  return (
    <Link
      href={`/devotionals/${post.slug}`}
      className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-sm transition-shadow"
    >
      <span className="text-2xl shrink-0">{post.coverEmoji}</span>
      <div>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold mb-1 ${col.bg} ${col.text}`}
        >
          {post.category}
        </span>
        <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-amber-700 transition-colors">
          {post.title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{post.readingTimeMin} min read</p>
      </div>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function DevotionalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);
  const col = CATEGORY_COLORS[post.category];

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Nav strip ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link
          href="/devotionals"
          className="text-sm text-amber-700 hover:text-amber-900 font-semibold transition-colors"
        >
          ← All Devotionals
        </Link>
        <span className="text-gray-300">|</span>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Bible Reader
        </Link>
      </nav>

      {/* ── Article hero ──────────────────────────────────────────────── */}
      <header className="bg-gradient-to-b from-white to-amber-50 border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <div className="text-5xl mb-4">{post.coverEmoji}</div>

          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${col.bg} ${col.text}`}
            >
              {post.category}
            </span>
            <span className="text-xs text-gray-400">{post.readingTimeMin} min read</span>
            <span className="text-xs text-gray-300">·</span>
            <time className="text-xs text-gray-400">{date}</time>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl mx-auto">
            {post.subtitle}
          </p>
        </div>
      </header>

      {/* ── Key verse callout ─────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 -mt-2 py-6">
        <blockquote className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5">
          <p className="text-sm sm:text-base italic text-gray-700 leading-relaxed mb-2">
            "{post.keyVerse}"
          </p>
          <footer className="text-xs font-bold text-amber-700">{post.keyVerseRef}</footer>
        </blockquote>
      </div>

      {/* ── Article body ──────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 pb-12">
        <div
          className="prose prose-gray prose-sm sm:prose-base max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-p:leading-relaxed prose-p:text-gray-700
            prose-blockquote:border-amber-300 prose-blockquote:text-gray-600
            prose-strong:text-gray-900
            prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ── Tags ──────────────────────────────────────────────────── */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Tags</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 text-gray-600 text-xs px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ── Author / share strip ──────────────────────────────────── */}
        <div className="mt-8 flex items-center justify-between flex-wrap gap-3 rounded-xl bg-white border border-gray-100 px-5 py-4">
          <div>
            <p className="text-xs text-gray-400">Written by</p>
            <p className="text-sm font-semibold text-gray-800">{post.author}</p>
          </div>
          <Link
            href="/devotionals"
            className="text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors"
          >
            Browse more articles →
          </Link>
        </div>
      </main>

      {/* ── Related articles ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-white border-t border-gray-100 py-10">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-base font-bold text-gray-800 mb-5">You might also enjoy</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <RelatedCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-amber-50 px-4 py-10 text-center">
        <div className="text-3xl mb-3">📖</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to go deeper?</h3>
        <p className="text-sm text-gray-600 mb-4 max-w-sm mx-auto">
          Use the Scripture Lives Bible Reader to explore any passage, compare translations, and
          look up the original Greek and Hebrew.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-6 py-3 transition-colors"
        >
          Open the Bible Reader
        </Link>
      </footer>
    </div>
  );
}
