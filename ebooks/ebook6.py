"""
Config for Ebook 6: Mav & Moony — The Great American Road Trip
"""

CONFIG = {
    # ── Identity ─────────────────────────────────────────────────────────────
    "title":          "Mav & Moony: The Great American Road Trip",
    "series_title":   "Mav & Moony",
    "episode_title":  "The Great American Road Trip",
    "author":         "Faith Tails",
    "year":           "2026",

    # ── PDF metadata ──────────────────────────────────────────────────────────
    "subject":   "Mav and Moony join a family cross-country road trip — Texas, the Grand Canyon, Nevada, and California — meeting animals and strangers who show them that every person matters to God.",
    "keywords":  "Faith Tails, children's book, Mav, Moony, road trip, family, Texas, Grand Canyon, California, faith, every person matters, kids, ages 7-12",

    # ── Scripture ─────────────────────────────────────────────────────────────
    "verse":      '"For God so loved the world..."',
    "reference":  "John 3:16",

    # ── Inspiration note (shown on copyright page) ────────────────────────────
    "inspired_by": "Inspired by John 3:16 — Every person, in every place, matters to God.",

    # ── Pages ─────────────────────────────────────────────────────────────────
    "pages": (
        ["FT-TGART-cover.png"] +
        [f"FT-TGART-P{i}.png" for i in range(1, 31)]
    ),

    # ── Page size override: portrait 4:5 to match the generated images ───────
    "page_w":  7.0  * 72,   # 504 pts
    "page_h":  8.75 * 72,   # 630 pts

    # ── Paths ─────────────────────────────────────────────────────────────────
    "book_dir":    "/sessions/hopeful-confident-allen/mnt/book",
    "output_name": "mav-moony-great-american-road-trip-ebook.pdf",
    "public_path": "scripture-alive/public/books/mav-moony-great-american-road-trip-ebook.pdf",
}
