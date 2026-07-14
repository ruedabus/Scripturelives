import { type NextRequest, NextResponse } from "next/server";
import { logDownload } from "@/lib/downloads";

// Map slug → public PDF path
const BOOKS: Record<string, { title: string; url: string }> = {
  "moon-adventure": {
    title: "Mission Moonrock",
    url:   "/books/mav-moony-moon-adventure.pdf",
  },
  "lions-den": {
    title: "Mav, Moony & the Lion's Den",
    url:   "/books/mav-moony-lions-den-ebook.pdf",
  },
  "riders-of-the-ark": {
    title: "Mav and Moony: Riders of the Ark",
    url:   "/books/mav-moony-riders-of-the-ark.pdf",
  },
  "camping-adventure": {
    title: "Mav, Moony & Goliath: The Great Camping Adventure",
    url:   "/books/mav-moony-goliath-camping-adventure-ebook.pdf",
  },
  "big-fish-adventure": {
    title: "Mav & Moony: The Big Fish Adventure",
    url:   "/books/mav-moony-big-fish-adventure-ebook.pdf",
  },
  "great-american-road-trip": {
    title: "Mav & Moony: The Great American Road Trip",
    url:   "/books/mav-moony-great-american-road-trip-ebook.pdf",
  },
  "miracle-at-the-tomb": {
    title: "Mav, Moony & the Miracle at the Tomb",
    url:   "/books/mav-moony-miracle-at-the-tomb-ebook.pdf",
  },
  "giant-storm": {
    title: "Mav and Moony and the Giant Storm",
    url:   "/books/mav-moony-giant-storm-ebook.pdf",
  },
};

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("book") ?? "";
  const book = BOOKS[slug];

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  // Country from Cloudflare / Vercel edge header (optional, best-effort)
  const country = request.headers.get("cf-ipcountry") ??
                  request.headers.get("x-vercel-ip-country") ??
                  undefined;

  // Fire-and-forget — don't block the redirect
  logDownload(slug, book.title, country).catch(() => {});

  return NextResponse.redirect(new URL(book.url, request.url));
}
