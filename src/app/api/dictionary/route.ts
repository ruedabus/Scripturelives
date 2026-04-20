/**
 * /api/dictionary?term=Aaron
 *
 * Returns Easton's Bible Dictionary (1897) entry for a given term.
 * Public domain — Matthew George Easton, Illustrated Bible Dictionary, 1897.
 *
 * Sources tried in order:
 *   1. BibleStudyTools.com  (Easton's, well-structured HTML)
 *   2. StudyLight.org       (Easton's as fallback)
 */
import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "@/lib/lruCache";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// ── In-memory LRU cache: "aaron" → entry | null (max 300 entries) ─────────────
const cache = new LRUCache<string, { title: string; body: string; sourceUrl: string } | null>(300);

// ── Term → URL slug helpers ───────────────────────────────────────────────────
function toBstSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[''']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toSlSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[''']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── HTML → plain text ─────────────────────────────────────────────────────────
function stripHtml(html: string): string {
  return html
    .replace(/<(script|style|nav|header|footer|aside|iframe|form)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?(p|br|h[1-6]|li|tr|div|blockquote|section|article)[^>]*>/gi, "\n")
    .replace(/<a[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\t/g, " ").replace(/ {2,}/g, " ")
    .replace(/\n /g, "\n").replace(/ \n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── BibleStudyTools extractor ─────────────────────────────────────────────────
function extractBst(html: string, term: string): { title: string; body: string } | null {
  // Try article or definition block
  let content = "";
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    content = articleMatch[1];
  } else {
    // Look for main content area
    const mainMatch = html.match(/class="[^"]*(?:definition|dict|content|main-content|article-body)[^"]*"[^>]*>([\s\S]*?)(?=<div class="(?:sidebar|ad-|footer|related)|<\/main)/i);
    if (mainMatch) content = mainMatch[1];
  }
  if (!content) return null;

  const body = stripHtml(content);
  if (body.length < 80) return null;

  // Filter boilerplate
  const boilerplate = [
    /^loading/i, /^please\s+(log|register)/i, /^advertisement/i,
    /^copyright/i, /^home$/i, /^search$/i, /^menu$/i, /^bible$/i,
    /^share$/i, /^print$/i, /^email$/i, /^tweet$/i, /^pin it/i,
  ];
  const lines = body.split("\n").filter(l => {
    const t = l.trim();
    return t.length >= 3 && !boilerplate.some(rx => rx.test(t));
  });
  const cleaned = lines.join("\n").trim();
  if (cleaned.length < 80) return null;

  return { title: term, body: cleaned };
}

// ── StudyLight extractor ───────────────────────────────────────────────────────
function extractSl(html: string, term: string): { title: string; body: string } | null {
  // StudyLight wraps content in <div class="encyclopedia-article"> or similar
  let content = "";
  const entryMatch = html.match(/class="[^"]*(?:encyclopedia|dictionary|article|entry)[^"]*"[^>]*>([\s\S]*?)(?=class="(?:sidebar|footer|ad-|related)|<\/body)/i);
  if (entryMatch) content = entryMatch[1];

  if (!content) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) content = bodyMatch[1];
  }
  if (!content) return null;

  const body = stripHtml(content);
  if (body.length < 80) return null;

  const boilerplate = [
    /^loading/i, /^please\s+(log|register)/i, /^advertisement/i,
    /^copyright/i, /^home$/i, /^search$/i, /^menu$/i, /^studylight/i,
  ];
  const lines = body.split("\n").filter(l => {
    const t = l.trim();
    return t.length >= 3 && !boilerplate.some(rx => rx.test(t));
  });
  const cleaned = lines.join("\n").trim();
  if (cleaned.length < 80) return null;

  return { title: term, body: cleaned };
}

// ── Live fetch ────────────────────────────────────────────────────────────────
async function fetchEntry(term: string): Promise<{ title: string; body: string; sourceUrl: string } | null> {
  const cacheKey = term.toLowerCase();
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  const bstSlug  = toBstSlug(term);
  const slSlug   = toSlSlug(term);

  const candidates: { url: string; source: "bst" | "sl" }[] = [
    { url: `https://www.biblestudytools.com/dictionaries/eastons-bible-dictionary/${bstSlug}.html`, source: "bst" },
    { url: `https://www.studylight.org/encyclopedias/eng/ebd/${slSlug[0]}/${slSlug}.html`,          source: "sl"  },
  ];

  for (const { url, source } of candidates) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ScriptureApp/1.0)",
          "Accept": "text/html",
        },
        signal: AbortSignal.timeout(9000),
      });
      if (!res.ok) continue;

      const html = await res.text();
      const entry = source === "bst" ? extractBst(html, term) : extractSl(html, term);
      if (!entry) continue;

      const result = { ...entry, sourceUrl: url };
      cache.set(cacheKey, result);
      return result;
    } catch {
      // try next source
    }
  }

  cache.set(cacheKey, null);
  return null;
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // ── Rate limit: 30 req / min per IP ───────────────────────────────────────
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetMs - Date.now()) / 1000)) } }
    );
  }

  const term = req.nextUrl.searchParams.get("term")?.trim() ?? "";
  if (!term || term.length < 2) {
    return NextResponse.json({ error: "Provide a term (min 2 chars)" }, { status: 400 });
  }
  if (term.length > 80) {
    return NextResponse.json({ error: "Term too long (max 80 characters)" }, { status: 400 });
  }

  const entry = await fetchEntry(term);

  if (!entry) {
    return NextResponse.json({
      found: false,
      term,
      source: "Easton's Bible Dictionary (1897) — Public Domain",
    });
  }

  return NextResponse.json({
    found: true,
    term: entry.title,
    body: entry.body,
    sourceUrl: entry.sourceUrl,
    source: "Easton's Bible Dictionary (1897) — Public Domain",
  });
}
