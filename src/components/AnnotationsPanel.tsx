"use client";

import { useState } from "react";
import { Trash2, Pencil, Highlighter, StickyNote, X, Check, BookOpen } from "lucide-react";
import { useAnnotations } from "./useAnnotations";
import { HIGHLIGHT_COLORS } from "./VerseAnnotationToolbar";
import type { HighlightColor } from "./useAnnotations";

const GOLD        = "#C9952A";
const GOLD_LIGHT  = "rgba(201,149,42,0.12)";
const GOLD_BORDER = "rgba(201,149,42,0.25)";

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
    if (editText.trim()) saveNote(editingRef, editText.trim());
    else deleteNote(editingRef);
    setEditingRef(null);
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#13111a" }}>

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: GOLD_LIGHT, border: `1px solid ${GOLD_BORDER}` }}
          >
            <Pencil size={14} style={{ color: GOLD }} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wide">My Annotations</h2>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Personal highlights &amp; notes
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2.5 mt-3 mb-4">
          <StatChip icon={<Highlighter size={10} />} label={`${allHighlights.length} highlight${allHighlights.length !== 1 ? "s" : ""}`} />
          <StatChip icon={<StickyNote  size={10} />} label={`${allNotes.length} note${allNotes.length !== 1 ? "s" : ""}`} />
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5">
          <TabBtn active={tab === "highlights"} onClick={() => setTab("highlights")}>
            <Highlighter size={11} /> Highlights
          </TabBtn>
          <TabBtn active={tab === "notes"} onClick={() => setTab("notes")}>
            <StickyNote size={11} /> Notes
          </TabBtn>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">

        {/* ── Highlights tab ── */}
        {tab === "highlights" && (
          allHighlights.length === 0
            ? <EmptyState icon={<Highlighter size={26} />} title="No highlights yet" body="Hover any verse and tap Highlight to add colour." />
            : allHighlights.map(({ reference, color }) => {
                const colorDef = HIGHLIGHT_COLORS.find((c) => c.id === color);
                return (
                  <div key={reference} className="group rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* Colour accent strip */}
                    <div className="h-1 w-full" style={{ background: colorDef?.bg ?? "#fef08a" }} />
                    <div className="px-3.5 py-3 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div className="flex-1 min-w-0">
                        {/* Reference */}
                        <button
                          className="flex items-center gap-1.5 text-xs font-black hover:underline text-left mb-2.5"
                          style={{ color: GOLD }}
                          onClick={() => onJumpTo?.(reference)}
                          title="Jump to verse"
                        >
                          <BookOpen size={11} /> {reference}
                        </button>
                        {/* Recolor row */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-widest mr-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>Colour</span>
                          {HIGHLIGHT_COLORS.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setHighlight(reference, c.id as HighlightColor)}
                              className="w-4 h-4 rounded-full transition-transform hover:scale-125 flex items-center justify-center"
                              style={{ background: c.bg, boxShadow: color === c.id ? `0 0 0 2px ${c.ring}` : "none" }}
                              title={c.label}
                            >
                              {color === c.id && <Check size={7} style={{ color: c.ring }} strokeWidth={3} />}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Delete */}
                      <button
                        onClick={() => clearHighlight(reference)}
                        className="opacity-0 group-hover:opacity-100 transition p-2 rounded-lg hover:bg-white/10 shrink-0"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                        title="Remove highlight"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
        )}

        {/* ── Notes tab ── */}
        {tab === "notes" && (
          allNotes.length === 0
            ? <EmptyState icon={<StickyNote size={26} />} title="No notes yet" body="Hover any verse and tap Add Note to write a thought." />
            : allNotes.map((note) => (
                <div key={note.reference} className="group rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  {/* Gold gradient strip */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
                  <div className="px-3.5 py-3" style={{ background: "rgba(255,255,255,0.03)" }}>

                    {/* Reference + action buttons */}
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <button
                        className="flex items-center gap-1.5 text-xs font-black hover:underline text-left"
                        style={{ color: GOLD }}
                        onClick={() => onJumpTo?.(note.reference)}
                        title="Jump to verse"
                      >
                        <BookOpen size={11} /> {note.reference}
                      </button>
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => startEdit(note.reference, note.text)} className="p-1.5 rounded-lg hover:bg-white/10 transition" style={{ color: "rgba(255,255,255,0.45)" }} title="Edit"><Pencil size={11} /></button>
                        <button onClick={() => deleteNote(note.reference)} className="p-1.5 rounded-lg hover:bg-white/10 transition" style={{ color: "rgba(255,255,255,0.35)" }} title="Delete"><Trash2 size={11} /></button>
                      </div>
                    </div>

                    {editingRef === note.reference ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                          autoFocus
                          className="w-full rounded-lg px-2.5 py-2 text-xs resize-none outline-none"
                          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "white", lineHeight: 1.5 }}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setEditingRef(null);
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) confirmEdit();
                          }}
                        />
                        <div className="flex gap-2 mt-2 justify-end">
                          <button onClick={() => setEditingRef(null)} className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg transition" style={{ color: "rgba(255,255,255,0.4)" }}>
                            <X size={10} /> Cancel
                          </button>
                          <button onClick={confirmEdit} className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg transition" style={{ background: GOLD, color: "#13111a" }}>
                            <Check size={10} /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="rounded-lg px-3 py-2.5 text-xs leading-relaxed italic"
                          style={{ background: GOLD_LIGHT, border: `1px solid ${GOLD_BORDER}`, color: "rgba(255,255,255,0.8)" }}
                        >
                          &ldquo;{note.text}&rdquo;
                        </div>
                        <p className="text-[10px] mt-2 text-right" style={{ color: "rgba(255,255,255,0.22)" }}>
                          {new Date(note.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))
        )}
      </div>
    </div>
  );
}

/* ── Helpers ── */

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition"
      style={{
        background: active ? GOLD : "rgba(255,255,255,0.06)",
        color:      active ? "#13111a" : "rgba(255,255,255,0.5)",
        border:     active ? "none" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </button>
  );
}

function StatChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
      {icon} {label}
    </span>
  );
}

function EmptyState({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center text-center py-14 gap-3 px-6">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-1" style={{ background: GOLD_LIGHT, border: `1px solid ${GOLD_BORDER}`, color: GOLD }}>
        {icon}
      </div>
      <p className="text-sm font-black text-white">{title}</p>
      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{body}</p>
    </div>
  );
}
