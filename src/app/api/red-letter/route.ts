/**
 * /api/red-letter?book=Matthew&chapter=5
 * Returns red-letter data for all verses in a chapter.
 * "full" = entire verse is Jesus speaking
 * string[] = specific red text segments within the verse
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

type RedLetterEntry = "full" | string[];
type RedLetterIndex = Record<string, RedLetterEntry>;

let index: RedLetterIndex | null = null;

function loadIndex(): RedLetterIndex {
  if (index) return index;
  const p = join(process.cwd(), "src", "data", "red-letter", "index.json");
  if (!existsSync(p)) return {};
  index = JSON.parse(readFileSync(p, "utf-8"));
  return index!;
}

const SAFE_RE = /^[\w\s.,']{1,60}$/;

export async function GET(req: NextRequest) {
  const book    = req.nextUrl.searchParams.get("book");
  const chapter = req.nextUrl.searchParams.get("chapter");

  if (!book || !chapter) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  if (!SAFE_RE.test(book) || !SAFE_RE.test(chapter)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const data    = loadIndex();
  const prefix  = `${book} ${chapter}:`;
  const chapter_data: Record<string, RedLetterEntry> = {};

  for (const [key, val] of Object.entries(data)) {
    if (key.startsWith(prefix)) {
      const verseNum = key.split(":")[1];
      chapter_data[verseNum] = val;
    }
  }

  return NextResponse.json({ redLetter: chapter_data });
}
