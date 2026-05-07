import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ── Cache: refresh every 30 minutes ───────────────────────────────────────────
let cachedArticles: NewsArticle[] = [];
let cacheExpiry = 0;
const CACHE_TTL = 30 * 60 * 1000;

export type NewsArticle = {
  title:     string;
  link:      string;
  pubDate:   string;
  source:    string;
  sourceUrl: string;
};

// ── RSS sources ────────────────────────────────────────────────────────────────
const SOURCES = [
  {
    name:   "Christianity Today",
    url:    "https://www.christianitytoday.com/ct/rss.xml",
    site:   "https://www.christianitytoday.com",
  },
  {
    name:   "The Gospel Coalition",
    url:    "https://www.thegospelcoalition.org/feed/",
    site:   "https://www.thegospelcoalition.org",
  },
  {
    name:   "Christian Post",
    url:    "https://www.christianpost.com/rss/",
    site:   "https://www.christianpost.com",
  },
  {
    name:   "CBN News",
    url:    "https://www1.cbn.com/rss/rss.aspx?type=2",
    site:   "https://www.cbn.com/cbnnews",
  },
];

// ── Lightweight RSS parser (no extra deps) ─────────────────────────────────────
function parseRSS(xml: string, sourceName: string, sourceUrl: string): NewsArticle[] {
  const items: NewsArticle[] = [];

  // Extract <item>...</item> blocks
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title   = extractTag(block, "title");
    const link    = extractTag(block, "link") || extractTag(block, "guid");
    const pubDate = extractTag(block, "pubDate");

    if (!title || !link) continue;

    // Skip if link doesn't look like a real URL
    if (!link.startsWith("http")) continue;

    items.push({
      title:     cleanText(title),
      link:      link.trim(),
      pubDate:   pubDate ? cleanText(pubDate) : "",
      source:    sourceName,
      sourceUrl: sourceUrl,
    });
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  // Try CDATA first
  const cdataMatch = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i").exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();

  // Plain tag
  const plainMatch = new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i").exec(xml);
  if (plainMatch) return plainMatch[1].trim();

  // Self-closing or raw content after link tag (some RSS has <link>url</link> OR <link/>url)
  if (tag === "link") {
    const rawLink = /<link[^>]*\/>?\s*(https?:\/\/[^\s<"]+)/i.exec(xml);
    if (rawLink) return rawLink[1].trim();
  }

  return "";
}

function cleanText(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, "")
    .trim();
}

// ── Fetch one source ───────────────────────────────────────────────────────────
async function fetchSource(src: typeof SOURCES[number]): Promise<NewsArticle[]> {
  try {
    const res = await fetch(src.url, {
      headers: { "User-Agent": "ScriptureLives/1.0 (RSS reader; contact@scripturelives.com)" },
      signal:  AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml, src.name, src.site);
  } catch {
    return [];
  }
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function GET() {
  // Return cache if still fresh
  if (cachedArticles.length > 0 && Date.now() < cacheExpiry) {
    return NextResponse.json(cachedArticles);
  }

  // Fetch all sources concurrently
  const results = await Promise.all(SOURCES.map(fetchSource));

  // Interleave articles from each source (round-robin) then truncate to 10
  const interleaved: NewsArticle[] = [];
  const maxLen = Math.max(...results.map((r) => r.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of results) {
      if (arr[i]) interleaved.push(arr[i]);
    }
  }

  const articles = interleaved.slice(0, 10);

  // Update cache
  if (articles.length > 0) {
    cachedArticles = articles;
    cacheExpiry    = Date.now() + CACHE_TTL;
  }

  return NextResponse.json(articles);
}
