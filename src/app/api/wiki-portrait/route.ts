import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");
  if (!title) {
    return NextResponse.json({ src: null, credit: "" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      {
        headers: { Accept: "application/json", "User-Agent": "ScriptureAlive/1.0 (bible study app)" },
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ src: null, credit: "" });
    }

    const data = await res.json();

    // Prefer a larger thumbnail; fall back to originalimage
    let src: string | null = null;
    if (data.thumbnail?.source) {
      // Bump resolution: replace the px- width with 480px
      src = (data.thumbnail.source as string).replace(/\/\d+px-/, "/480px-");
    } else if (data.originalimage?.source) {
      src = data.originalimage.source as string;
    }

    const credit: string = data.description ?? "";

    return NextResponse.json({ src, credit });
  } catch {
    return NextResponse.json({ src: null, credit: "" });
  }
}
