"""
Config for Ebook 2: Mav, Moony & the Mummy's Curse
"""

CONFIG = {
    # ── Identity ─────────────────────────────────────────────────────────────
    "title":          "Mav, Moony & the Mummy's Curse",
    "series_title":   "Mav, Moony & the Mummy's Curse",
    "episode_title":  "The Curse That Wasn't",
    "author":         "Faith Tails",
    "year":           "2026",

    # ── PDF metadata ──────────────────────────────────────────────────────────
    "subject":   "A story of bravery, trust, and the power of God — based on Moses and the Exodus",
    "keywords":  "Faith Tails, children's book, Mav, Moony, mummy, Egypt, adventure, Moses, Exodus, bravery, faith",

    # ── Scripture ─────────────────────────────────────────────────────────────
    "verse":      '"The Lord will fight for you; you need only to be still."',
    "reference":  "Exodus 14:14",

    # ── Inspiration note (shown on copyright page) ────────────────────────────
    "inspired_by": "Inspired by the biblical account of Moses and the Exodus (Exodus 7–14).",

    # ── Pages ─────────────────────────────────────────────────────────────────
    # Update this list once the story pages are ready in the book_dir
    "pages": (
        ["FT-Episode2-ebookcp.png"] +
        [f"ep2-page{i}.png" for i in range(1, 10)]
    ),

    # ── Paths ─────────────────────────────────────────────────────────────────
    "book_dir":    "/sessions/hopeful-confident-allen/mnt/book",
    "output_name": "mav-moony-mummys-curse-ebook.pdf",
    "public_path": "scripture-alive/public/books/mav-moony-mummys-curse-ebook.pdf",
}
