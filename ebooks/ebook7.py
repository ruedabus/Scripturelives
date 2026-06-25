"""
Config for Ebook 7: Mav, Moony & the Miracle at the Tomb
"""

CONFIG = {
    # ── Identity ─────────────────────────────────────────────────────────────
    "title":          "Mav, Moony & the Miracle at the Tomb",
    "series_title":   "Mav & Moony",
    "episode_title":  "The Miracle at the Tomb",
    "author":         "Faith Tails",
    "year":           "2026",

    # ── PDF metadata ──────────────────────────────────────────────────────────
    "subject":   "Mav and Moony travel back in time to ancient Judea and witness Jesus raise Lazarus from the dead — learning that faith believes before it sees, and nothing is too hard for God.",
    "keywords":  "Faith Tails, children's book, Mav, Moony, Lazarus, resurrection, Jesus, miracle, faith, John 11, kids, ages 7-12",

    # ── Scripture ─────────────────────────────────────────────────────────────
    "verse":      '"I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live."',
    "reference":  "John 11:25",

    # ── Inspiration note (shown on copyright page) ────────────────────────────
    "inspired_by": "Inspired by John 11 — Nothing is too hard for God. Faith believes before it sees.",

    # ── Pages ─────────────────────────────────────────────────────────────────
    "pages": (
        ["Episode7-cover.png"] +
        [f"Episode7-P{i}.png" for i in range(1, 21)]
    ),

    # ── KDP print: no footer bar (text near edge fails KDP margin check) ─────
    "show_footer": False,
    # Contain mode: fit images fully within page (no cropping)
    "fit_mode":    "contain",

    # ── Page size: KDP standard 8.5" × 11" ───────────────────────────────────
    "cover_w": 8.5  * 72,   # 612 pts
    "cover_h": 11.0 * 72,   # 792 pts
    "page_w":  8.5  * 72,   # 612 pts
    "page_h":  11.0 * 72,   # 792 pts

    # ── Paths ─────────────────────────────────────────────────────────────────
    "book_dir":    "/sessions/hopeful-confident-allen/mnt/book",
    "output_name": "mav-moony-miracle-at-the-tomb-ebook.pdf",
    "public_path": "/sessions/hopeful-confident-allen/mnt/dev/scripture-alive/public/books/mav-moony-miracle-at-the-tomb-ebook.pdf",
}
