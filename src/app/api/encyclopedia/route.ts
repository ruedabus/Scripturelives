/**
 * /api/encyclopedia?term=Redemption
 *
 * Returns an International Standard Bible Encyclopedia (ISBE, 1915) article.
 * The 1915 edition is fully public domain (James Orr, ed.).
 *
 * Primary:  internationalstandardbible.com — clean static HTML, server-rendered
 * Fallback: bible-history.com             — alternative ISBE mirror
 */
import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "@/lib/lruCache";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const cache = new LRUCache<string, EncyclopediaEntry | null>(500);

export type EncyclopediaEntry = {
  term: string;
  body: string;
  sourceUrl: string;
  source: string;
};

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; ScriptureAlive/1.0; educational Bible study app)",
  "Accept": "text/html,application/xhtml+xml",
};

// ── Slug helpers ──────────────────────────────────────────────────────────────
function toSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[''']/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── HTML → clean plain text ───────────────────────────────────────────────────
function stripHtml(html: string): string {
  return html
    .replace(/<(script|style|nav|aside|iframe|form|noscript)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // Mark section headers
    .replace(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, inner) => {
      const t = inner.replace(/<[^>]+>/g, "").trim();
      return t ? `\n##HEADING## ${t}\n` : "\n";
    })
    .replace(/<\/?(p|br|li|tr|div|blockquote|section|article)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    // Decode entities
    .replace(/&#(\d+);/g,              (_, n)  => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/gi,  (_, h)  => String.fromCharCode(parseInt(h, 16)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\t/g, " ").replace(/ {2,}/g, " ")
    .replace(/\n /g, "\n").replace(/ \n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

// ── Build article body from stripped text ─────────────────────────────────────
function buildArticle(raw: string): { body: string; title: string } | null {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);

  // Find the first real heading — that's the article title
  let titleLine = "";
  let startIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("##HEADING##")) {
      titleLine = lines[i].replace("##HEADING##", "").trim();
      startIdx = i + 1;
      break;
    }
  }
  if (!titleLine) return null;

  // Nav footer markers — stop collecting when we hit these
  const STOP_PATTERNS = [
    /^←\s/,           // ← Previous entry
    /^→\s/,           // → Next entry
    /alphabetical index/i,
    /bible study start/i,
    /swordsearcher/i,
    /studylamp software/i,
    /edited by james orr/i,
    /website html.*editorial/i,
    /get more info/i,
    /verseclick/i,
  ];

  const NAV_SKIP = [
    /^[A-Z]$/,                         // Single letter nav items
    /^(home|search|menu|about)$/i,
    /^[a-z]$/,
    /better bible study/i,
    /discover the power/i,
    /nave's bible/i,
    /mcclintock and strong/i,
  ];

  const kept: string[] = [];
  let inLitSection = false;

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];

    // Stop at nav footer
    if (STOP_PATTERNS.some(rx => rx.test(line))) break;
    if (NAV_SKIP.some(rx => rx.test(line))) continue;

    if (line.startsWith("##HEADING##")) {
      const heading = line.replace("##HEADING##", "").trim();
      if (!heading) continue;
      // LITERATURE section — keep the list of references but mark it
      if (/^literature/i.test(heading)) {
        inLitSection = true;
        kept.push(`__Literature__`);
        continue;
      }
      kept.push(`__${heading}__`);
      inLitSection = false;
      continue;
    }

    if (inLitSection) {
      // Keep literature refs as-is (they're short)
      if (line.length > 3) kept.push(line);
      continue;
    }

    // Skip very short lines that aren't section markers
    if (line.length < 35) continue;

    kept.push(line);
  }

  if (kept.length < 2) return null;

  // Merge consecutive body lines into paragraphs
  const paragraphs: string[] = [];
  let cur: string[] = [];

  for (const line of kept) {
    if (/^__/.test(line)) {
      if (cur.length) { paragraphs.push(cur.join(" ")); cur = []; }
      paragraphs.push(line);
    } else {
      cur.push(line);
      // Start a new paragraph after a sentence ending when buffer is long enough
      if (cur.join(" ").length > 300 && /[.!?]["']?$/.test(line)) {
        paragraphs.push(cur.join(" ")); cur = [];
      }
    }
  }
  if (cur.length) paragraphs.push(cur.join(" "));

  const body = paragraphs.filter(p => p.length > 5).join("\n\n").trim();
  if (body.length < 100) return null;

  return { body, title: titleLine };
}

// ── internationalstandardbible.com extractor ─────────────────────────────────
function extractISBE(html: string): { body: string; title: string } | null {
  // Cut off everything after the ← navigation links near the end
  let content = html;
  const navIdx = html.search(/←\s*<a|<a[^>]*>←|←\s+\w/);
  if (navIdx > 500) content = html.slice(0, navIdx);

  const raw = stripHtml(content);
  return buildArticle(raw);
}

// ── bible-history.com extractor ───────────────────────────────────────────────
function extractBibleHistory(html: string): { body: string; title: string } | null {
  // Find the article content div
  let content = "";
  const m = html.match(/<div[^>]+(?:id|class)="[^"]*(?:content|article|entry|text)[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]+(?:id|class)="[^"]*(?:sidebar|footer|widget|ad)[^"]*"|<\/body)/i);
  if (m) content = m[1];
  if (!content) {
    const bodyM = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyM) content = bodyM[1].slice(0, 80_000);
  }
  if (!content) return null;

  const raw = stripHtml(content);
  return buildArticle(raw);
}

// ── Try to find the right URL via the letter index ───────────────────────────
async function findIndexUrl(term: string): Promise<string | null> {
  const slug = toSlug(term);
  const letter = (slug[0] ?? "a").toUpperCase();
  const indexUrl = `https://www.internationalstandardbible.com/${letter}/index.html`;

  try {
    const res = await fetch(indexUrl, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const html = await res.text();

    // Find all href links on that index page
    const links = [...html.matchAll(/href="([^"]+\.html)"/gi)].map(m => m[1]);

    // Score each link: does its slug contain our search term?
    const termLower = slug.toLowerCase();
    for (const link of links) {
      const linkSlug = link.split("/").pop()?.replace(".html", "") ?? "";
      if (linkSlug.includes(termLower) || termLower.includes(linkSlug)) {
        const base = "https://www.internationalstandardbible.com";
        return link.startsWith("http") ? link : `${base}${link.startsWith("/") ? "" : `/${letter}/`}${link}`;
      }
    }

    // Looser: any link whose slug shares the first 5 chars
    const prefix = termLower.slice(0, 5);
    for (const link of links) {
      const linkSlug = link.split("/").pop()?.replace(".html", "") ?? "";
      if (linkSlug.startsWith(prefix)) {
        const base = "https://www.internationalstandardbible.com";
        return link.startsWith("http") ? link : `${base}${link.startsWith("/") ? "" : `/${letter}/`}${link}`;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

// ── Main fetch orchestrator ───────────────────────────────────────────────────
async function fetchEntry(term: string): Promise<EncyclopediaEntry | null> {
  const key = term.toLowerCase().trim();
  if (cache.has(key)) return cache.get(key) ?? null;

  const slug   = toSlug(term);
  const letter = (slug[0] ?? "a").toUpperCase();

  // ── 1. Try internationalstandardbible.com with direct slug ──────────────────
  const directUrl = `https://www.internationalstandardbible.com/${letter}/${slug}.html`;
  try {
    const res = await fetch(directUrl, { headers: HEADERS, signal: AbortSignal.timeout(9000), next: { revalidate: 86400 } });
    if (res.ok) {
      const html = await res.text();
      // 404 pages often contain "not found" or are very short
      if (html.length > 1000 && !/not found|404/i.test(html.slice(0, 500))) {
        const parsed = extractISBE(html);
        if (parsed) {
          const entry: EncyclopediaEntry = { term: parsed.title, body: parsed.body, sourceUrl: directUrl, source: "ISBE (1915)" };
          cache.set(key, entry);
          return entry;
        }
      }
    }
  } catch { /* try next */ }

  // ── 2. Try letter index lookup (handles compound titles like "Redeemer; Redemption") ──
  const indexedUrl = await findIndexUrl(term);
  if (indexedUrl && indexedUrl !== directUrl) {
    try {
      const res = await fetch(indexedUrl, { headers: HEADERS, signal: AbortSignal.timeout(9000), next: { revalidate: 86400 } });
      if (res.ok) {
        const html = await res.text();
        const parsed = extractISBE(html);
        if (parsed) {
          const entry: EncyclopediaEntry = { term: parsed.title, body: parsed.body, sourceUrl: indexedUrl, source: "ISBE (1915)" };
          cache.set(key, entry);
          return entry;
        }
      }
    } catch { /* try next */ }
  }

  // ── 3. bible-history.com fallback ───────────────────────────────────────────
  const bhUrl = `https://bible-history.com/isbe/${slug[0]}/${encodeURIComponent(slug.replace(/-/g, "+"))}/`;
  try {
    const res = await fetch(bhUrl, { headers: HEADERS, signal: AbortSignal.timeout(9000), next: { revalidate: 86400 } });
    if (res.ok) {
      const html = await res.text();
      const parsed = extractBibleHistory(html);
      if (parsed) {
        const entry: EncyclopediaEntry = { term: parsed.title || term, body: parsed.body, sourceUrl: bhUrl, source: "ISBE (1915) via Bible History Online" };
        cache.set(key, entry);
        return entry;
      }
    }
  } catch { /* not found */ }

  cache.set(key, null);
  return null;
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetMs - Date.now()) / 1000)) } }
    );
  }

  const term = req.nextUrl.searchParams.get("term")?.trim() ?? "";
  if (!term || term.length < 2)  return NextResponse.json({ error: "Provide a term (min 2 chars)" }, { status: 400 });
  if (term.length > 100)         return NextResponse.json({ error: "Term too long" }, { status: 400 });

  const entry = await fetchEntry(term);
  if (!entry) return NextResponse.json({ found: false, term, source: "ISBE (1915) — Public Domain" });

  return NextResponse.json({ found: true, term: entry.term, body: entry.body, sourceUrl: entry.sourceUrl, source: entry.source });
}
