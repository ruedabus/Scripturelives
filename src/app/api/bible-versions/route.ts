import { NextResponse } from "next/server";

/**
 * GET /api/bible-versions
 * Lists all Bibles available to your api.bible API key.
 * Use this to find the correct Bible IDs for NIV, NLT, AMP, etc.
 * Visit: https://scripturelives.com/api/bible-versions
 */
export async function GET() {
  const key = process.env.API_BIBLE_KEY;

  if (!key) {
    return NextResponse.json(
      { error: "API_BIBLE_KEY is not set in environment variables." },
      { status: 500 }
    );
  }

  const res = await fetch("https://rest.api.bible/v1/bibles", {
    headers: { "api-key": key },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `api.bible returned ${res.status} — check that your API key is correct.` },
      { status: res.status }
    );
  }

  const data = await res.json();

  // Return a simplified list: id, name, abbreviation
  const bibles = (data.data as Array<{ id: string; name: string; abbreviation: string; language: { id: string } }>)
    .filter((b) => b.language?.id === "eng")
    .map((b) => ({ id: b.id, name: b.name, abbreviation: b.abbreviation }));

  return NextResponse.json({ key_works: true, bibles });
}
