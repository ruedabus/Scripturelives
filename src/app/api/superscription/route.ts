/**
 * /api/superscription?book=Psalms&chapter=18
 * Returns the biblical superscription (title heading) for a chapter if one exists.
 * Currently covers all 114 Psalms that have superscriptions in the KJV.
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

type SuperscriptionIndex = Record<string, string>; // "Psalms 18" -> "To the chief Musician..."

let index: SuperscriptionIndex | null = null;

function loadIndex(): SuperscriptionIndex {
  if (index) return index;
  const p = join(process.cwd(), "src", "data", "superscriptions", "index.json");
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

  const key  = `${book} ${chapter}`;
  const data = loadIndex();
  const text = data[key] ?? null;

  return NextResponse.json({ superscription: text });
}
