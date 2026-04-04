type ExportPlace = {
  name: string;
  place: {
    era?: string;
    description?: string;
    biblicalSignificance?: string;
  };
  sourceReference: string;
  note: string;
};

type StudySession = {
  id: string;
  name: string;
  createdAt: string;
  bookmarks: string[];
  notes: Record<string, string>;
};

export function exportStudyPdf(
  places: ExportPlace[],
  sessions: StudySession[]
) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── Bookmarked places HTML ───────────────────────────────────
  const placesHtml =
    places.length === 0
      ? `<p class="empty">No bookmarked places saved.</p>`
      : places
          .map(
            (item, i) => `
    <div class="card">
      <h3>${i + 1}. ${esc(item.name)}</h3>
      ${item.place.era ? `<div class="meta"><span class="label">Era:</span> ${esc(item.place.era)}</div>` : ""}
      ${item.sourceReference ? `<div class="meta"><span class="label">Source Verse:</span> ${esc(item.sourceReference)}</div>` : ""}
      ${item.place.description ? `<div class="meta"><span class="label">Summary:</span> ${esc(item.place.description)}</div>` : ""}
      ${item.place.biblicalSignificance ? `<div class="meta"><span class="label">Biblical Significance:</span> ${esc(item.place.biblicalSignificance)}</div>` : ""}
      <div class="note-box">
        <span class="note-label">My Note:</span>
        ${item.note?.trim() ? esc(item.note) : '<em class="empty-note">No note saved.</em>'}
      </div>
    </div>`
          )
          .join("");

  // ── Sessions HTML ────────────────────────────────────────────
  const sessionsHtml =
    sessions.length === 0
      ? ""
      : `
  <div class="section-header">
    <h2>Study Sessions</h2>
    <hr class="divider" />
  </div>
  ${sessions
    .map((s, j) => {
      const created = new Date(s.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const sessionNotes = Object.entries(s.notes ?? {}).filter(
        ([, v]) => v && v.trim()
      );
      return `
    <div class="card">
      <h3>${j + 1}. ${esc(s.name)}</h3>
      <div class="meta"><span class="label">Saved on:</span> ${esc(created)}</div>
      ${
        s.bookmarks && s.bookmarks.length > 0
          ? `<div class="meta"><span class="label">Bookmarks:</span> ${s.bookmarks.map(esc).join(", ")}</div>`
          : `<div class="meta empty">No places bookmarked in this session.</div>`
      }
      ${
        sessionNotes.length > 0
          ? `<div class="meta session-notes-header"><span class="label">Session Notes:</span></div>
             <ul class="session-notes">${sessionNotes
               .map(([place, note]) => `<li><strong>${esc(place)}:</strong> ${esc(note)}</li>`)
               .join("")}</ul>`
          : ""
      }
    </div>`;
    })
    .join("")}`;

  // ── Full HTML document ───────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Scripture Lives — Study Summary</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 11pt;
      color: #1c1710;
      background: #fff;
      padding: 0.5in;
      max-width: 8.5in;
      margin: 0 auto;
    }

    /* ── Title ── */
    .title-block {
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #d4a853;
    }
    .title-block h1 {
      font-size: 26pt;
      color: #d4a853;
      letter-spacing: 0.03em;
    }
    .title-block .subtitle {
      font-size: 13pt;
      color: #78716c;
      margin-top: 0.25rem;
    }
    .title-block .dateline {
      font-size: 9pt;
      color: #a8a29e;
      margin-top: 0.5rem;
    }

    /* ── Section headings ── */
    .section-header { margin: 1.5rem 0 0.75rem; }
    .section-header h2 {
      font-size: 16pt;
      color: #d4a853;
      margin-bottom: 0.25rem;
    }
    .divider {
      border: none;
      border-top: 1px solid #d4a853;
      margin: 0;
    }

    /* ── Cards ── */
    .card {
      margin: 0.75rem 0;
      padding: 0.75rem 1rem;
      border: 1px solid #e7e5e4;
      border-radius: 6px;
      page-break-inside: avoid;
    }
    .card h3 {
      font-size: 12pt;
      color: #1c1710;
      margin-bottom: 0.4rem;
    }
    .meta {
      font-size: 10pt;
      color: #57534e;
      margin-top: 0.25rem;
      line-height: 1.5;
    }
    .label {
      font-weight: bold;
      color: #78716c;
    }

    /* ── Note box ── */
    .note-box {
      margin-top: 0.6rem;
      padding: 0.5rem 0.75rem;
      background: #fef9ee;
      border-left: 3px solid #d4a853;
      font-size: 10pt;
      line-height: 1.6;
    }
    .note-label {
      font-weight: bold;
      color: #d4a853;
      display: block;
      margin-bottom: 0.2rem;
    }
    .empty-note { color: #a8a29e; font-style: italic; }

    /* ── Session notes ── */
    .session-notes {
      margin: 0.4rem 0 0 1.2rem;
      font-size: 10pt;
      line-height: 1.6;
      color: #57534e;
    }
    .session-notes li { margin-bottom: 0.2rem; }

    .empty { color: #a8a29e; font-style: italic; font-size: 10pt; margin-top: 0.5rem; }

    /* ── Footer ── */
    .footer {
      margin-top: 2rem;
      padding-top: 0.75rem;
      border-top: 1px solid #d4a853;
      text-align: center;
      font-size: 8pt;
      color: #a8a29e;
      font-style: italic;
    }

    /* ── Print styles ── */
    @media print {
      body { padding: 0; }
      .card { border-color: #d1cdc9; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>

  <div class="no-print" style="
    background:#1c1710;color:#d4a853;padding:0.5rem 1rem;
    margin-bottom:1rem;border-radius:6px;font-family:sans-serif;
    font-size:11pt;display:flex;align-items:center;gap:1rem;
  ">
    <strong>Ready to save as PDF:</strong>
    Press <kbd style="background:#333;color:#fff;padding:2px 6px;border-radius:3px;">Ctrl+P</kbd>
    (or <kbd style="background:#333;color:#fff;padding:2px 6px;border-radius:3px;">⌘P</kbd> on Mac)
    and choose <em>Save as PDF</em>.
    <button onclick="window.print()" style="
      margin-left:auto;background:#d4a853;color:#1c1710;
      border:none;padding:6px 14px;border-radius:5px;
      font-weight:bold;cursor:pointer;font-size:11pt;
    ">Print / Save PDF</button>
  </div>

  <div class="title-block">
    <h1>Scripture Lives</h1>
    <div class="subtitle">Study Summary</div>
    <div class="dateline">Exported: ${esc(date)}</div>
  </div>

  <div class="section-header">
    <h2>Bookmarked Places</h2>
    <hr class="divider" />
  </div>

  ${placesHtml}

  ${sessionsHtml}

  <div class="footer">
    Generated by Scripture Lives &nbsp;·&nbsp; Study deeper. Explore further.
  </div>

</body>
</html>`;

  // Open print window
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) {
    alert(
      "Pop-up blocked! Please allow pop-ups for this site, then try again."
    );
    return;
  }
  win.document.write(html);
  win.document.close();
  // Let resources render before triggering print
  win.onload = () => win.focus();
}

// HTML-escape helper
function esc(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}
