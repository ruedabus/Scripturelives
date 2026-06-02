/**
 * /api/chapter-summary?book=Matthew&chapter=5
 * Returns the pre-generated chapter summary if available.
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

type SummaryIndex = Record<string, string>;

let index: SummaryIndex | null = null;

function loadIndex(): SummaryIndex {
  if (index) return index;
  const p = join(process.cwd(), "src", "data", "chapter-summaries", "index.json");
  if (!existsSync(p)) return {};
  index = JSON.parse(readFileSync(p, "utf-8"));
  return index!;
}

const SAFE_RE = /^[\w\s.,']{1,60}$/;

export async function GET(req: NextRequest) {
  const book    = req.nextUrl.searchParams.get("book");
  const chapter = req.nextUrl.searchParams.get("chapter");

  if (!book || !chapter) {
    return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
  }
  if (!SAFE_RE.test(book) || !SAFE_RE.test(chapter)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const key     = `${book} ${chapter}`;
  const data    = loadIndex();
  const summary = data[key] ?? null;

  return NextResponse.json({ summary });
}
