/**
 * /api/cross-refs?ref=John+3:16
 * Returns cross-reference verses for a given verse reference.
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

type XrefEntry = { book: string; chapter: number; verse: number };
type XrefIndex = Record<string, XrefEntry[]>;

let xrefIndex: XrefIndex | null = null;
let unavailable = false;

function loadIndex(): XrefIndex | null {
  if (unavailable) return null;
  if (xrefIndex) return xrefIndex;
  const p = join(process.cwd(), "src", "data", "cross-refs", "index.json");
  if (!existsSync(p)) { unavailable = true; return null; }
  xrefIndex = JSON.parse(readFileSync(p, "utf-8"));
  return xrefIndex;
}

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref"); // e.g. "John 3:16"
  if (!ref) return NextResponse.json({ error: "Missing ref parameter" }, { status: 400 });

  const index = loadIndex();
  if (!index) {
    return NextResponse.json({
      refs: [],
      unavailable: true,
      hint: "Run: npm run setup-extras  then restart the dev server.",
    });
  }

  const results = index[ref] ?? [];
  return NextResponse.json({ refs: results, count: results.length });
}
