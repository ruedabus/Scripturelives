/**
 * Ebook download tracking — Supabase REST API
 *
 * Table: ebook_downloads
 *   id            bigserial primary key
 *   book_slug     text not null
 *   book_title    text
 *   downloaded_at timestamptz default now()
 *   country       text          (populated from CF-IPCountry header if available)
 *
 * Run this SQL once in your Supabase SQL editor:
 * ─────────────────────────────────────────────
 * CREATE TABLE ebook_downloads (
 *   id            BIGSERIAL PRIMARY KEY,
 *   book_slug     TEXT NOT NULL,
 *   book_title    TEXT,
 *   downloaded_at TIMESTAMPTZ DEFAULT NOW(),
 *   country       TEXT
 * );
 * CREATE INDEX idx_ebook_downloads_slug ON ebook_downloads(book_slug);
 * CREATE INDEX idx_ebook_downloads_date ON ebook_downloads(downloaded_at);
 * ─────────────────────────────────────────────
 */

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const HEADERS = () => ({
  "Content-Type":  "application/json",
  "apikey":        SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Prefer":        "return=minimal",
});

export interface DownloadRow {
  id:            number;
  book_slug:     string;
  book_title:    string | null;
  downloaded_at: string;
  country:       string | null;
}

export interface BookSummary {
  slug:          string;
  title:         string;
  total:         number;
  last_download: string | null;
}

/** Log a single download event. */
export async function logDownload(
  bookSlug: string,
  bookTitle: string,
  country?: string,
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return; // silently skip if not configured

  await fetch(`${SUPABASE_URL}/rest/v1/ebook_downloads`, {
    method:  "POST",
    headers: HEADERS(),
    body:    JSON.stringify({ book_slug: bookSlug, book_title: bookTitle, country: country ?? null }),
  });
}

/** Return per-book totals + last download date, ordered by total desc. */
export async function getDownloadSummary(): Promise<BookSummary[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];

  // Pull all rows and aggregate in JS (Supabase free tier doesn't expose GROUP BY via REST)
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ebook_downloads?select=book_slug,book_title,downloaded_at&order=downloaded_at.desc&limit=5000`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
  );
  if (!res.ok) return [];

  const rows: DownloadRow[] = await res.json();

  const map = new Map<string, BookSummary>();
  for (const row of rows) {
    const existing = map.get(row.book_slug);
    if (!existing) {
      map.set(row.book_slug, {
        slug:          row.book_slug,
        title:         row.book_title ?? row.book_slug,
        total:         1,
        last_download: row.downloaded_at,
      });
    } else {
      existing.total += 1;
      // rows are ordered desc so first occurrence = most recent
    }
  }

  return [...map.values()].sort((a, b) => b.total - a.total);
}

/** Return the 50 most recent individual download events. */
export async function getRecentDownloads(limit = 50): Promise<DownloadRow[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ebook_downloads?select=*&order=downloaded_at.desc&limit=${limit}`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
  );
  if (!res.ok) return [];
  return res.json();
}

/** Return daily download counts for the last N days. */
export async function getDailyTotals(days = 30): Promise<{ date: string; total: number }[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];

  const since = new Date(Date.now() - days * 86400_000).toISOString();
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ebook_downloads?select=downloaded_at&downloaded_at=gte.${since}&order=downloaded_at.asc&limit=5000`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
  );
  if (!res.ok) return [];

  const rows: { downloaded_at: string }[] = await res.json();
  const counts = new Map<string, number>();

  for (const row of rows) {
    const date = row.downloaded_at.slice(0, 10); // YYYY-MM-DD
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date, total }));
}
