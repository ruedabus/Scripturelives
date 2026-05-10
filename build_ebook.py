"""
Faith Tails — Universal eBook PDF Builder
==========================================
Builds a fully watermarked, copyright-protected PDF ebook for any episode.

Usage:
    python build_ebook.py ebook1        # builds Episode 1
    python build_ebook.py ebook2        # builds Episode 2
    python build_ebook.py ebook3        # builds Episode 3 (once ebook3.py config exists)

Each ebook has its own config in ebooks/<name>.py — just add a new config file
for every new episode and this engine handles everything automatically.

What every ebook gets automatically:
  ✓ Subtle diagonal © Faith Tails watermark on every page
  ✓ Footer strip with copyright line + YouTube handle on every page
  ✓ Full navy/gold copyright page as the final page
  ✓ PDF metadata (title, author, keywords, creator)
  ✓ JPEG compression for manageable file size
  ✓ Auto-copy to scripture-alive/public/books/
"""

import sys, os, io, shutil, importlib.util

from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.colors import HexColor
from PIL import Image

# ── Brand colors ──────────────────────────────────────────────────────────────
GOLD  = HexColor("#C9952A")
NAVY  = HexColor("#1a2640")
WHITE = HexColor("#FFFFFF")

# ── Page size: 7" x 9.9" portrait ─────────────────────────────────────────────
PAGE_W = 7.0 * 72   # 504 pts
PAGE_H = 9.9 * 72   # 712.8 pts

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = BASE_DIR   # final PDF lands here (and is then copied to public/)


# ── Image helpers ─────────────────────────────────────────────────────────────

def compressed_image_reader(path, quality=88):
    """Load image, compress to high-quality JPEG in memory, return ImageReader."""
    img = Image.open(path).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=quality, optimize=True, progressive=True)
    buf.seek(0)
    return ImageReader(buf)


# ── Watermark stamp (applied to every story page) ────────────────────────────

def stamp_watermark(c, page_w, page_h):
    """Draw subtle diagonal watermark + footer bar on the current page."""
    c.saveState()

    # Diagonal centre watermark
    c.setFillColor(HexColor("#888888"))
    c.setFont("Helvetica-Bold", 28)
    c.setFillAlpha(0.10)
    c.translate(page_w / 2, page_h / 2)
    c.rotate(35)
    c.drawCentredString(0, 0, "© Faith Tails 2026")
    c.rotate(-35)
    c.translate(-page_w / 2, -page_h / 2)

    # Footer strip
    c.setFillAlpha(1.0)
    c.setFillColor(HexColor("#00000066"))
    footer_h = 16
    c.rect(0, 0, page_w, footer_h, fill=1, stroke=0)

    c.setFillColor(WHITE)
    c.setFont("Helvetica", 7)
    c.drawString(6, 4,
        "© 2026 Faith Tails  |  Mav & Moony are original characters of Faith Tails. All rights reserved.")
    c.drawRightString(page_w - 6, 4, "youtube.com/@FaithTails")

    c.restoreState()


# ── Copyright page (final page of every ebook) ───────────────────────────────

def draw_copyright_page(c, cfg, page_w, page_h):
    """Render a full branded copyright / legal page."""
    c.saveState()

    # Background
    c.setFillColor(NAVY)
    c.rect(0, 0, page_w, page_h, fill=1, stroke=0)

    # Gold accent bars
    c.setFillColor(GOLD)
    c.rect(0, page_h - 6, page_w, 6, fill=1, stroke=0)
    c.rect(0, 0, page_w, 6, fill=1, stroke=0)

    # Series / brand name
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(GOLD)
    c.drawCentredString(page_w / 2, page_h - 60, "FAITH TAILS")

    c.setFont("Helvetica", 10)
    c.setFillColor(WHITE)
    c.drawCentredString(page_w / 2, page_h - 78, "youtube.com/@FaithTails")

    # Divider
    y_div = page_h - 100
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(40, y_div, page_w - 40, y_div)

    # Ebook title
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(GOLD)
    c.drawCentredString(page_w / 2, y_div - 30, cfg["series_title"])
    c.setFont("Helvetica-Bold", 13)
    c.drawCentredString(page_w / 2, y_div - 48, cfg["episode_title"])

    # Copyright headline
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(GOLD)
    c.drawCentredString(page_w / 2, y_div - 78,
        f"© {cfg['year']} Faith Tails. All Rights Reserved.")

    # Body legal text
    body_lines = [
        f"First published {cfg['year']} by Faith Tails.",
        "",
        "The characters Mav, Moony, and all associated Faith Tails characters",
        "are original creations and are the intellectual property of Faith Tails.",
        "Unauthorized reproduction, distribution, or use of these characters",
        "in any form is strictly prohibited.",
        "",
        cfg["inspired_by"],
        "The biblical text is not reproduced verbatim and remains the",
        "property of its respective rights holders.",
        "",
        "No part of this publication may be reproduced, stored in a retrieval",
        "system, or transmitted in any form or by any means — electronic,",
        "mechanical, photocopying, recording, or otherwise — without prior",
        "written permission from Faith Tails.",
        "",
        "For licensing, permissions, or inquiries:",
        "info@scripturelives.com",
        "",
        f"Faith Tails theme music © {cfg['year']} Faith Tails.",
        "All original music, artwork, and characters are protected by copyright.",
    ]

    c.setFont("Helvetica", 8)
    c.setFillColor(WHITE)
    y_text = y_div - 100
    for line in body_lines:
        c.drawCentredString(page_w / 2, y_text, line)
        y_text -= 13

    # Scripture verse
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(40, y_text - 6, page_w - 40, y_text - 6)

    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(GOLD)
    # Handle multi-line verse
    verse_lines = cfg["verse"].split("\n")
    y_verse = y_text - 20
    for vl in verse_lines:
        c.drawCentredString(page_w / 2, y_verse, vl)
        y_verse -= 12

    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(page_w / 2, y_verse - 2, cfg["reference"])

    # Print info
    c.setFont("Helvetica", 7)
    c.setFillColor(HexColor("#aaaaaa"))
    c.drawCentredString(page_w / 2, 30,
        "Printed / distributed digitally by Faith Tails  |  scripturelives.com")
    c.drawCentredString(page_w / 2, 20, f"ISBN pending  |  First Edition {cfg['year']}")

    c.restoreState()


# ── Main build function ───────────────────────────────────────────────────────

def build(config_name: str):
    # Load config
    config_path = os.path.join(BASE_DIR, "ebooks", f"{config_name}.py")
    if not os.path.exists(config_path):
        print(f"❌  Config not found: {config_path}")
        print(f"   Create ebooks/{config_name}.py with a CONFIG dict to proceed.")
        sys.exit(1)

    spec = importlib.util.spec_from_file_location(config_name, config_path)
    mod  = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    cfg  = mod.CONFIG

    output_path = os.path.join(OUTPUT_DIR, cfg["output_name"])
    pages       = cfg["pages"]
    book_dir    = cfg["book_dir"]

    print(f"\n📚  Building: {cfg['title']}")
    print(f"    Config : ebooks/{config_name}.py")
    print(f"    Pages  : {len(pages)} story + 1 copyright = {len(pages)+1} total")
    print(f"    Output : {output_path}\n")

    c = canvas.Canvas(output_path, pagesize=(PAGE_W, PAGE_H))
    c.setTitle(cfg["title"])
    c.setAuthor(cfg["author"])
    c.setSubject(cfg["subject"])
    c.setKeywords(cfg["keywords"])
    c.setCreator("Faith Tails | youtube.com/@FaithTails")

    missing = 0
    for fname in pages:
        path = os.path.join(book_dir, fname)
        if not os.path.exists(path):
            print(f"  ⚠  Missing: {fname} — skipping")
            missing += 1
            continue

        img_reader  = compressed_image_reader(path)
        iw, ih      = img_reader.getSize()
        img_aspect  = iw / ih
        page_aspect = PAGE_W / PAGE_H

        if img_aspect > page_aspect:
            draw_h = PAGE_H
            draw_w = draw_h * img_aspect
            x = (PAGE_W - draw_w) / 2
            y = 0
        else:
            draw_w = PAGE_W
            draw_h = draw_w / img_aspect
            x = 0
            y = (PAGE_H - draw_h) / 2

        c.drawImage(img_reader, x, y, draw_w, draw_h)
        stamp_watermark(c, PAGE_W, PAGE_H)

        label = "Cover" if fname == pages[0] else fname.replace(".png", "")
        print(f"  ✓  {label}  [watermarked]")
        c.showPage()

    # Copyright page (always last)
    draw_copyright_page(c, cfg, PAGE_W, PAGE_H)
    print(f"  ✓  Copyright page")
    c.showPage()
    c.save()

    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"\n✅  Saved : {output_path}")
    print(f"   Size  : {size_mb:.1f} MB  |  Pages: {len(pages) - missing + 1}")

    # Copy to Next.js public/books/
    if cfg.get("public_path"):
        dest = os.path.join(BASE_DIR, cfg["public_path"])
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(output_path, dest)
        print(f"   Copied → {dest}")

    if missing:
        print(f"\n⚠   {missing} page(s) were missing and skipped.")
        print(f"   Add the missing files to {book_dir} and re-run.")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        print("\nAvailable configs:")
        ebooks_dir = os.path.join(BASE_DIR, "ebooks")
        for f in sorted(os.listdir(ebooks_dir)):
            if f.endswith(".py") and not f.startswith("_"):
                print(f"  python build_ebook.py {f[:-3]}")
        sys.exit(0)

    build(sys.argv[1])
