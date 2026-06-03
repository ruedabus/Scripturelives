"""
Config for Ebook 5: Mav & Moony — The Big Fish Adventure (Jonah)
"""

CONFIG = {
    # ── Identity ─────────────────────────────────────────────────────────────
    "title":          "Mav & Moony: The Big Fish Adventure",
    "series_title":   "Mav & Moony",
    "episode_title":  "The Big Fish Adventure",
    "author":         "Faith Tails",
    "year":           "2026",

    # ── PDF metadata ──────────────────────────────────────────────────────────
    "subject":   "Mav and Moony travel back in time and meet Jonah — a funny, faith-filled adventure about running from God, second chances, and mercy for everyone.",
    "keywords":  "Faith Tails, children's book, Mav, Moony, Jonah, big fish, whale, Nineveh, Bible story, second chances, mercy, faith, kids",

    # ── Scripture ─────────────────────────────────────────────────────────────
    "verse":      '"Salvation belongs to the Lord."',
    "reference":  "Jonah 2:9",

    # ── Inspiration note (shown on copyright page) ────────────────────────────
    "inspired_by": "Inspired by the Book of Jonah — God's mercy reaches farther than we can run.",

    # ── Pages ─────────────────────────────────────────────────────────────────
    "pages": (
        ["Episode5-cover.png"] +
        [f"Episode5-p{i}.png" for i in range(1, 21)]
    ),

    # ── Paths ─────────────────────────────────────────────────────────────────
    "book_dir":    "/sessions/hopeful-confident-allen/mnt/book",
    "output_name": "mav-moony-big-fish-adventure-ebook.pdf",
    "public_path": "scripture-alive/public/books/mav-moony-big-fish-adventure-ebook.pdf",
}
