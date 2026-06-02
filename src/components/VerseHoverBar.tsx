"use client";

/**
 * VerseHoverBar
 * A smooth unified action bar that floats above a verse on hover.
 * Shows: Highlight · Share · Insight · Note
 */

import { useState, useRef, useEffect } from "react";
import { Share2, Lightbulb, StickyNote, Highlighter, X, Check } from "lucide-react";
import { HIGHLIGHT_COLORS, highlightBg } from "./VerseAnnotationToolbar";
import type { HighlightColor, VerseNote } from "./useAnnotations";

type Props = {
  reference:        string;
  text:             string;
  verseNum:         number;
  highlight:        HighlightColor | null;
  note:             VerseNote | null;
  onShare:          () => void;
  onInsight:        () => void;
  onSetHighlight:   (c: HighlightColor) => void;
  onClearHighlight: () => void;
  onSaveNote:       (t: string) => void;
  onDeleteNote:     () => void;
  children:         React.ReactNode; // rendered verse text
};

export default function VerseHoverBar({
  reference, text, verseNum,
  highlight, note,
  onShare, onInsight,
  onSetHighlight, onClearHighlight,
  onSaveNote, onDeleteNote,
  children,
}: Props) {
  const [hovered,     setHovered]     = useState(false);
  const [mode,        setMode]        = useState<"bar" | "colors" | "note">("bar");
  const [noteText,    setNoteText]    = useState(note?.text ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rootRef     = useRef<HTMLSpanElement>(null);

  // Long-press timer for mobile
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset mode when hovering away
  useEffect(() => {
    if (!hovered) {
      const t = setTimeout(() => setMode("bar"), 200);
      return () => clearTimeout(t);
    }
  }, [hovered]);

  // Pre-fill note text when opening note editor
  useEffect(() => {
    if (mode === "note") {
      setNoteText(note?.text ?? "");
      setTimeout(() => textareaRef.current?.focus(), 60);
    }
  }, [mode, note]);

  // Close on outside click
  useEffect(() => {
    if (!hovered) return;
    function handler(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setHovered(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [hovered]);

  function saveNote() {
    if (noteText.trim()) onSaveNote(noteText.trim());
    else onDeleteNote();
    setMode("bar");
    setHovered(false);
  }

  const barVisible = hovered;

  return (
    <span
      ref={rootRef}
      className="relative inline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (mode === "bar") setHovered(false); }}
      // Long press for mobile
      onPointerDown={() => { lpTimer.current = setTimeout(() => setHovered(true), 450); }}
      onPointerUp={() => { if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; } }}
      onPointerCancel={() => { if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; } }}
    >
      {/* ── Floating action bar ── */}
      <span
        className="absolute left-0 bottom-full mb-1 z-50 pointer-events-none"
        style={{
          opacity:    barVisible ? 1 : 0,
          transform:  barVisible ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.15s ease, transform 0.15s ease",
          pointerEvents: barVisible ? "auto" : "none",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { if (mode === "bar") setHovered(false); }}
      >
        <span
          className="inline-flex items-center rounded-xl shadow-2xl overflow-hidden"
          style={{
            background: "#1c1917",
            border: "1px solid rgba(255,255,255,0.13)",
            fontSize: 11,
          }}
        >
          {/* Reference label */}
          <span
            className="px-2.5 py-1.5 font-black text-[10px] border-r border-white/10 select-none"
            style={{ color: "#d97706" }}
          >
            {reference}
          </span>

          {mode === "bar" && (
            <>
              {/* Highlight */}
              <ActionBtn
                icon={<Highlighter size={12} />}
                label="Highlight"
                active={!!highlight}
                activeColor="#fef08a"
                onClick={() => setMode("colors")}
              />
              {/* Share */}
              <ActionBtn
                icon={<Share2 size={12} />}
                label="Share"
                onClick={() => { onShare(); setHovered(false); }}
              />
              {/* Insight */}
              <ActionBtn
                icon={<Lightbulb size={12} />}
                label="Insight"
                onClick={() => { onInsight(); setHovered(false); }}
              />
              {/* Note */}
              <ActionBtn
                icon={<StickyNote size={12} />}
                label={note ? "Edit Note" : "Add Note"}
                active={!!note}
                activeColor="#d97706"
                onClick={() => setMode("note")}
              />
            </>
          )}

          {mode === "colors" && (
            <span className="flex items-center gap-1 px-2 py-1.5">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.id}
                  title={c.label}
                  onClick={() => { onSetHighlight(c.id); setMode("bar"); setHovered(false); }}
                  className="w-5 h-5 rounded-full transition-transform hover:scale-125 active:scale-95 flex items-center justify-center shrink-0"
                  style={{
                    background: c.bg,
                    boxShadow: highlight === c.id ? `0 0 0 2px ${c.ring}` : "none",
                  }}
                >
                  {highlight === c.id && <Check size={9} style={{ color: c.ring }} strokeWidth={3} />}
                </button>
              ))}
              {highlight && (
                <button
                  title="Remove"
                  onClick={() => { onClearHighlight(); setMode("bar"); setHovered(false); }}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition hover:bg-white/20 ml-0.5"
                  style={{ border: "1px dashed rgba(255,255,255,0.25)" }}
                >
                  <X size={9} className="text-stone-400" />
                </button>
              )}
              <button
                onClick={() => setMode("bar")}
                className="ml-1 text-stone-500 hover:text-white transition"
              >
                <X size={11} />
              </button>
            </span>
          )}

          {mode === "note" && (
            <span className="flex items-center gap-1 px-2 py-1">
              <textarea
                ref={textareaRef}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write a note…"
                rows={1}
                className="rounded px-2 py-1 text-[11px] resize-none outline-none"
                style={{
                  width: 200,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  lineHeight: 1.4,
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setMode("bar"); }
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveNote(); }
                }}
              />
              <button
                onClick={saveNote}
                className="px-2 py-1 rounded-lg text-[11px] font-bold transition"
                style={{ background: "#d97706", color: "white" }}
                title="Save (Enter)"
              >
                <Check size={11} />
              </button>
              <button
                onClick={() => setMode("bar")}
                className="text-stone-500 hover:text-white transition"
              >
                <X size={11} />
              </button>
            </span>
          )}
        </span>
      </span>

      {/* ── Verse content ── */}
      {/* Verse number */}
      <sup
        className="mr-[2px] ml-[1px] text-[10px] font-bold not-italic select-none align-top leading-none transition-colors duration-150"
        style={{ color: hovered ? "#f59e0b" : "#d97706" }}
      >
        {verseNum}
      </sup>

      {/* Note dot indicator */}
      {note && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full mr-0.5 relative top-[-3px]"
          style={{ background: "#d97706", opacity: 0.8 }}
        />
      )}

      {/* Verse text with optional highlight */}
      <span
        className="rounded-sm transition-colors duration-200 cursor-pointer"
        style={{
          background: highlight ? highlightBg(highlight) : hovered ? "rgba(251,191,36,0.08)" : "transparent",
          padding: highlight ? "1px 2px" : undefined,
        }}
        onClick={() => { onInsight(); }}
      >
        {children}
      </span>
    </span>
  );
}

function ActionBtn({
  icon, label, onClick, active, activeColor,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold transition border-r border-white/10 last:border-r-0"
      style={{
        color: active && activeColor ? activeColor : "rgba(255,255,255,0.75)",
        background: "transparent",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
