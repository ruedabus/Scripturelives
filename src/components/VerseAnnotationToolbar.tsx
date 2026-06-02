"use client";

import { useEffect, useRef, useState } from "react";
import { X, Pencil, Trash2, Check } from "lucide-react";
import type { HighlightColor, VerseNote } from "./useAnnotations";

// ── Highlight colour palette ──────────────────────────────────────────────────

export const HIGHLIGHT_COLORS: { id: HighlightColor; bg: string; ring: string; label: string }[] = [
  { id: "yellow", bg: "#fef08a", ring: "#eab308", label: "Yellow"  },
  { id: "green",  bg: "#bbf7d0", ring: "#22c55e", label: "Green"   },
  { id: "pink",   bg: "#fbcfe8", ring: "#ec4899", label: "Pink"    },
  { id: "blue",   bg: "#bfdbfe", ring: "#3b82f6", label: "Blue"    },
  { id: "orange", bg: "#fed7aa", ring: "#f97316", label: "Orange"  },
  { id: "purple", bg: "#e9d5ff", ring: "#a855f7", label: "Purple"  },
];

export function highlightBg(color: HighlightColor): string {
  return HIGHLIGHT_COLORS.find((c) => c.id === color)?.bg ?? "transparent";
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  reference: string;
  currentHighlight: HighlightColor | null;
  currentNote: VerseNote | null;
  onSetHighlight: (color: HighlightColor) => void;
  onClearHighlight: () => void;
  onSaveNote: (text: string) => void;
  onDeleteNote: () => void;
  onClose: () => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function VerseAnnotationToolbar({
  reference,
  currentHighlight,
  currentNote,
  onSetHighlight,
  onClearHighlight,
  onSaveNote,
  onDeleteNote,
  onClose,
}: Props) {
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [noteText, setNoteText]             = useState(currentNote?.text ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rootRef     = useRef<HTMLDivElement>(null);

  // Open note editor pre-filled if a note exists
  useEffect(() => {
    if (showNoteEditor) {
      setNoteText(currentNote?.text ?? "");
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [showNoteEditor, currentNote]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  function handleSaveNote() {
    if (noteText.trim()) {
      onSaveNote(noteText.trim());
    } else {
      onDeleteNote();
    }
    setShowNoteEditor(false);
    onClose();
  }

  function handleDeleteNote() {
    onDeleteNote();
    setShowNoteEditor(false);
    onClose();
  }

  return (
    <div
      ref={rootRef}
      className="absolute z-40 left-0 mt-1 rounded-xl shadow-2xl overflow-hidden select-none"
      style={{
        background: "#1c1917",
        border: "1px solid rgba(255,255,255,0.12)",
        minWidth: 260,
        top: "100%",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
          {reference}
        </span>
        <button onClick={onClose} className="text-stone-400 hover:text-white transition p-0.5 rounded">
          <X size={13} />
        </button>
      </div>

      {!showNoteEditor ? (
        <>
          {/* Highlight colours */}
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-2">Highlight</p>
            <div className="flex items-center gap-1.5">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.id}
                  title={c.label}
                  onClick={() => { onSetHighlight(c.id); onClose(); }}
                  className="w-6 h-6 rounded-full transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
                  style={{
                    background: c.bg,
                    boxShadow: currentHighlight === c.id ? `0 0 0 2px ${c.ring}` : "none",
                  }}
                >
                  {currentHighlight === c.id && (
                    <Check size={11} style={{ color: c.ring }} strokeWidth={3} />
                  )}
                </button>
              ))}
              {/* Clear highlight */}
              {currentHighlight && (
                <button
                  title="Remove highlight"
                  onClick={() => { onClearHighlight(); onClose(); }}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition hover:bg-stone-700 ml-1"
                  style={{ border: "1px dashed rgba(255,255,255,0.2)" }}
                >
                  <X size={10} className="text-stone-400" />
                </button>
              )}
            </div>
          </div>

          {/* Note button */}
          <div className="px-3 pt-1.5 pb-2.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-2">Note</p>
            <button
              onClick={() => setShowNoteEditor(true)}
              className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs font-semibold transition"
              style={{
                background: currentNote ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.06)",
                color: currentNote ? "#fbbf24" : "rgba(255,255,255,0.7)",
                border: currentNote ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Pencil size={12} />
              {currentNote ? "Edit note" : "Add a note…"}
            </button>
            {currentNote && (
              <p className="mt-1.5 text-[10px] text-stone-400 italic line-clamp-2 px-1">
                {currentNote.text}
              </p>
            )}
          </div>
        </>
      ) : (
        /* Note editor */
        <div className="px-3 py-3">
          <textarea
            ref={textareaRef}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your note here…"
            rows={4}
            className="w-full rounded-lg px-3 py-2 text-sm resize-none outline-none"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "white",
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowNoteEditor(false);
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSaveNote();
            }}
          />
          <div className="flex items-center justify-between mt-2 gap-2">
            {currentNote && (
              <button
                onClick={handleDeleteNote}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition px-2 py-1 rounded"
              >
                <Trash2 size={11} /> Delete
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setShowNoteEditor(false)}
                className="text-xs text-stone-400 hover:text-white transition px-2 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                style={{ background: "#d97706", color: "white" }}
              >
                <Check size={11} /> Save
              </button>
            </div>
          </div>
          <p className="text-[9px] text-stone-600 mt-1 text-right">⌘↵ to save</p>
        </div>
      )}
    </div>
  );
}
