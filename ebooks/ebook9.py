"""
Config for Ebook 9: Mav, Moony, and the Dream Keeper (Joseph in Egypt)
"""

import os

# Resolve mount points dynamically ($HOME/mnt/<folder>) so this config keeps
# working across sessions instead of hardcoding a session-specific path.
_HOME = os.path.expanduser("~")

CONFIG = {
    # ── Identity ─────────────────────────────────────────────────────────────
    "title":          "Mav, Moony, and the Dream Keeper",
    "series_title":   "Mav & Moony",
    "episode_title":  "The Dream Keeper",
    "author":         "Faith Tails",
    "year":           "2026",

    # ── PDF metadata ──────────────────────────────────────────────────────────
    "subject":   "Mav and Moony travel back in time to ancient Egypt and meet Joseph — sold into slavery by his own brothers, forgotten in prison, and lifted up by God to save many lives. A powerful story about forgiveness, patience, and trusting that God can turn harm into good.",
    "keywords":  "Faith Tails, children's book, Mav, Moony, Joseph, Egypt, dreams, forgiveness, faith, Genesis, kids, ages 7-12",

    # ── Scripture ─────────────────────────────────────────────────────────────
    "verse":      '"You intended to harm me, but God intended it for good — to accomplish\nwhat is now being done, the saving of many lives."',
    "reference":  "Genesis 50:20",

    # ── Inspiration note (shown on copyright page) ────────────────────────────
    "inspired_by": "Inspired by Genesis 37-41 — What you meant for harm, God meant for good.",

    # ── Pages ─────────────────────────────────────────────────────────────────
    "pages": (
        ["Episode9-cover.png"] +
        [f"Episode9-P{i}.png" for i in range(1, 19)]
    ),

    # ── Show copyright footer on every page ──────────────────────────────────
    "show_footer": True,
    # Contain mode: fit images fully within page (no cropping)
    "fit_mode":    "contain",

    # ── Page size: portrait, matches the source art (KDP standard 8.5" x 11") ─
    "cover_w": 7.0  * 72,   # 504 pts
    "cover_h": 9.9  * 72,   # 712.8 pts
    "page_w":  8.5  * 72,   # 612 pts
    "page_h":  11.0 * 72,   # 792 pts

    # ── Paths ─────────────────────────────────────────────────────────────────
    "book_dir":    os.path.join(_HOME, "mnt", "book"),
    "output_name": "mav-moony-dream-keeper-ebook.pdf",
    "public_path": os.path.join(_HOME, "mnt", "scripture-alive", "public", "books", "mav-moony-dream-keeper-ebook.pdf"),
}
