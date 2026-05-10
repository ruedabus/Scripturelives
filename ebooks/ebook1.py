"""
Config for Ebook 1: Mav and Moony's Moon Adventure — The Moon Giant
"""

CONFIG = {
    # ── Identity ─────────────────────────────────────────────────────────────
    "title":          "Mav and Moony's Moon Adventure: The Moon Giant",
    "series_title":   "Mav and Moony's Moon Adventure",
    "episode_title":  "The Moon Giant",
    "author":         "Faith Tails",
    "year":           "2026",

    # ── PDF metadata ──────────────────────────────────────────────────────────
    "subject":   "A story of courage, friendship, and faith — based on David and Goliath",
    "keywords":  "Faith Tails, children's book, Mav, Moony, moon, adventure, David and Goliath, courage, faith",

    # ── Scripture ─────────────────────────────────────────────────────────────
    "verse":      "“Be strong and courageous. Do not be afraid; do not be discouraged,\nfor the Lord your God will be with you wherever you go.”",
    "reference":  "Joshua 1:9",

    # ── Inspiration note (shown on copyright page) ────────────────────────────
    "inspired_by": "Inspired by the biblical account of David and Goliath (1 Samuel 17).",

    # ── Pages ─────────────────────────────────────────────────────────────────
    # List filenames in order (relative to BOOK_DIR for this ebook)
    "pages": (
        ["coverpage.png"] +
        [f"page{i}.png" for i in range(1, 10)]
    ),

    # ── Paths ─────────────────────────────────────────────────────────────────
    "book_dir":    "/sessions/hopeful-confident-allen/mnt/book",
    "output_name": "mav-moony-moon-adventure-ebook.pdf",
    "public_path": "scripture-alive/public/books/mav-moony-moon-adventure-ebook.pdf",
}
