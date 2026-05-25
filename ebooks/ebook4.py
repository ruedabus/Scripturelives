"""
Config for Ebook 4: Mav, Moony & Goliath — The Great Camping Adventure
"""

CONFIG = {
    # ── Identity ─────────────────────────────────────────────────────────────
    "title":          "Mav, Moony & Goliath: The Great Camping Adventure",
    "series_title":   "Mav, Moony & Goliath",
    "episode_title":  "The Great Camping Adventure",
    "author":         "Faith Tails",
    "year":           "2026",

    # ── PDF metadata ──────────────────────────────────────────────────────────
    "subject":   "A story of adventure, friendship, humor, and faith — three dogs get lost in the woods and discover the power of prayer.",
    "keywords":  "Faith Tails, children's book, Mav, Moony, Goliath, Great Dane, camping, adventure, prayer, faith, friendship, summer, kids",

    # ── Scripture ─────────────────────────────────────────────────────────────
    "verse":      '"Call to me and I will answer you."',
    "reference":  "Jeremiah 33:3",

    # ── Inspiration note (shown on copyright page) ────────────────────────────
    "inspired_by": "Inspired by Jeremiah 33:3 — God hears us even in the darkest places.",

    # ── Pages ─────────────────────────────────────────────────────────────────
    # Add illustrated page images to /sessions/hopeful-confident-allen/mnt/book/
    # then run: python build_ebook.py ebook4
    "pages": (
        ["Episode4-cover.png"] +
        [f"Episode4-p{i}.png" for i in range(1, 20)]
    ),

    # ── Paths ─────────────────────────────────────────────────────────────────
    "book_dir":    "/sessions/hopeful-confident-allen/mnt/book",
    "output_name": "mav-moony-goliath-camping-adventure-ebook.pdf",
    "public_path": "scripture-alive/public/books/mav-moony-goliath-camping-adventure-ebook.pdf",
}
