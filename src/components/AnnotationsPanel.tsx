"use client";

import { useState } from "react";
import { Trash2, Pencil, Highlighter, StickyNote, X, Check } from "lucide-react";
import { useAnnotations } from "./useAnnotations";
import { HIGHLIGHT_COLORS, highlightBg } from "./VerseAnnotationToolbar";
import type { HighlightColor } from "./useAnnotations";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

type Tab = "highlights" | "notes";

export default function AnnotationsPanel({
  onJumpTo,
}: {
  onJumpTo?: (reference: string) => void;
}) {
  const {
    allHighlights,
    allNotes,
    clearHighlight,
    setHighlight,
    deleteNote,
    saveNote,
  } = useAnnotations();

  const [tab, setTab]               = useState<Tab>("highlights");
  const [editingRef, setEditingRef] = useState<string | null>(null);
  const [editText, setEditText]     = useState("");

  function startEdit(reference: string, currentText: string) {
    setEditingRef(reference);
    setEditText(currentText);
  }

  function confirmEdit() {
    if (!editingRef) return;
    if (editText.trim()) {
      saveNote(editingRef, editText.trim());
    } else {
      deleteNote(editingRef);
    }
    setEditingRef(null);
  }

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="px-5 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Pencil size={15} style={{ color: GOLD }} />
          <h2 className="text-sm font-black text-white">My Annotations</h2>
        </div>
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Your personal highlights &amp; notes
        </p>

        {/* Tab switcher */}
        <div className="flex gap-1 mt-3">
          {([
            { id: "highlights" as Tab, icon: <Highlighter size={11} />, label: `Highlights (${allHighlights.length})` },
            { id: "notes"      as Tab, icon: <StickyNote  size={11} />, label: `Notes (${allNotes.length})` },
          ]).map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition"
              style={{
                background: tab === id ? GOLD : "rgba(255,255,255,0.07)",
                color:      tab === id ? NAVY : "rgba(255,255,255,0.55)",
              }}
            >
              {icon}{label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">

        {/* ── Highlights tab ── */}
        {tab === "highlights" && (
          <>
            {allHighlights.length === 0 ? (
              <EmptyState
                icon={<Highlighter size={28} style={{ color: GOLD, opacity: 0.5 }} />}
                title="No highlights yet"
                body="Hover over any verse in the Full Bible reader and click the ✏ icon to highlight it."
              />
            ) : (
              allHighlights.map(({ reference, color }) => (
                <div
                  key={reference}
                  className="rounded-xl p-3 flex items-center gap-3 group"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {/* Color swatch */}
                  <div
                    className="w-3 h-full min-h-[36px] rounded-full shrink-0"
                    style={{ background: highlightBg(color as HighlightColor) }}
                  />

                  {/* Reference + color pills */}
                  <div className="flex-1 min-w-0">
                    <button
                      className="text-xs font-black hover:underline text-left"
                      style={{ color: GOLD }}
                      onClick={() => onJumpTo?.(reference)}
                      title="Jump to verse"
                    >
                      {reference}
                    </button>
                    {/* Recolor pills */}
                    <div className="flex gap-1 mt-1.5">
                      {HIGHLIGHT_COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setHighlight(reference, c.id)}
                          className="w-4 h-4 rounded-full transition-transform hover:scale-110"
                          style={{
                            background: c.bg,
                            boxShadow: color === c.id ? `0 0 0 2px ${c.ring}` : "none",
                          }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => clearHighlight(reference)}
                    className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-lg hover:bg-white/10"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    title="Remove highlight"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {/* ── Notes tab ── */}
        {tab === "notes" && (
          <>
            {allNotes.length === 0 ? (
              <EmptyState
                icon={<StickyNote size={28} style={{ color: GOLD, opacity: 0.5 }} />}
                title="No notes yet"
                body="Hover over any verse in the Full Bible reader, click the ✏ icon, and tap 'Add a note'."
              />
            ) : (
              allNotes.map((note) => (
                <div
                  key={note.reference}
                  className="rounded-xl p-3 group"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {/* Reference */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <button
                      className="text-xs font-black hover:underline text-left"
                      style={{ color: GOLD }}
                      onClick={() => onJumpTo?.(note.reference)}
                      title="Jump to verse"
                    >
                      {note.reference}
                    </button>
                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => startEdit(note.reference, note.text)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                        title="Edit note"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => deleteNote(note.reference)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition"
                        style={{ color: "rgba(255,255,255,0.4)" }}
                        title="Delete note"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {editingRef === note.reference ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        autoFocus
                        className="w-full rounded-lg px-2 py-1.5 text-xs resize-none outline-none"
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setEditingRef(null);
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) confirmEdit();
                        }}
                      />
                      <div className="flex gap-2 mt-1.5 justify-end">
                        <button onClick={() => setEditingRef(null)} className="text-[11px] text-stone-400 hover:text-white px-2 py-1 rounded transition">Cancel</button>
                        <button onClick={confirmEdit} className="text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition" style={{ background: GOLD, color: NAVY }}>
                          <Check size={10} /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                        {note.text}
                      </p>
                      <p className="text-[10px] mt-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center text-center py-12 gap-3 px-4">
      {icon}
      <p className="text-sm font-black text-white">{title}</p>
      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{body}</p>
    </div>
  );
}
