/**
 * /api/strongs?n=H430
 * Returns the Strong's lexicon entry for a given number.
 * H#### = Hebrew, G#### = Greek
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

type LexEntry = {
  lemma: string;
  xlit: string;
  pron: string;
  derivation: string;
  strongs_def: string;
  kjv_def: string;
};

let hebrewLex: Record<string, LexEntry> | null = null;
let greekLex: Record<string, LexEntry> | null = null;

function loadHebrew(): Record<string, LexEntry> {
  if (!hebrewLex) {
    const p = join(process.cwd(), "src", "data", "strongs", "hebrew.json");
    hebrewLex = JSON.parse(readFileSync(p, "utf-8"));
  }
  return hebrewLex!;
}

function loadGreek(): Record<string, LexEntry> {
  if (!greekLex) {
    const p = join(process.cwd(), "src", "data", "strongs", "greek.json");
    greekLex = JSON.parse(readFileSync(p, "utf-8"));
  }
  return greekLex!;
}

export async function GET(req: NextRequest) {
  const n = req.nextUrl.searchParams.get("n");
  if (!n) {
    return NextResponse.json({ error: "Missing parameter: n (e.g. H430 or G2316)" }, { status: 400 });
  }

  const upper = n.toUpperCase();
  const isHebrew = upper.startsWith("H");
  const isGreek = upper.startsWith("G");

  if (!isHebrew && !isGreek) {
    return NextResponse.json({ error: "Number must start with H (Hebrew) or G (Greek)" }, { status: 400 });
  }

  try {
    const lex = isHebrew ? loadHebrew() : loadGreek();
    const entry = lex[upper];
    if (!entry) {
      return NextResponse.json({ error: `No entry found for ${upper}` }, { status: 404 });
    }

    return NextResponse.json({
      entry: {
        number: upper,
        language: isHebrew ? "Hebrew" : "Greek",
        testament: isHebrew ? "Old Testament" : "New Testament",
        ...entry,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: "Lexicon data not yet downloaded.",
        hint: "Run: npm run setup-strongs  then restart the dev server.",
      },
      { status: 503 }
    );
  }
}
