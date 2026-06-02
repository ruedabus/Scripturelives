"use client";

/**
 * VerseHoverBar
 * Right-click (desktop) or long-press (mobile) opens a floating action bar.
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
  children:         React.ReactNode;
};

export default function VerseHoverBar({
  reference, text, verseNum,
  highlight, note,
  onShare, onInsight,
  onSetHighlight, onClearHighlight,
  onSaveNote, onDeleteNote,
  children,
}: Props) {
  const [open,       setOpen]       = useState(false);
  const [mode,       setMode]       = useState<"bar" | "colors" | "note">("bar");
  const [noteText,   setNoteText]   = useState(note?.text ?? "");
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const rootRef      = useRef<HTMLSpanElement>(null);
  // Long-press timer for mobile
  const lpTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired      = useRef(false);

  // Reset mode when bar closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setMode("bar"), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Pre-fill note text when note editor opens
  useEffect(() => {
    if (mode === "note") {
      setNoteText(note?.text ?? "");
      setTimeout(() => textareaRef.current?.focus(), 60);
    }
  }, [mode, note]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onMouse(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown",   onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown",   onKey);
    };
  }, [open]);

  function openBar(e: React.MouseEvent | React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }

  function saveNote() {
    if (noteText.trim()) onSaveNote(noteText.trim());
    else onDeleteNote();
    setMode("bar");
    setOpen(false);
  }

  // ── Mobile long-press handlers ─────────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse") return; // desktop uses right-click only
    lpFired.current = false;
    lpTimer.current = setTimeout(() => {
      lpFired.current = true;
      setOpen(true);
    }, 500);
  }
  function onPointerUp(e: React.PointerEvent) {
    if (e.pointerType === "mouse") return;
    if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; }
    // If long-press fired, prevent the tap-click from also triggering insight
    if (lpFired.current) { e.preventDefault(); lpFired.current = false; }
  }
  function onPointerCancel() {
    if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; }
    lpFired.current = false;
  }

  return (
    <span
      ref={rootRef}
      className="relative inline"
      // Desktop: right-click opens bar
      onContextMenu={openBar}
      // Mobile: long-press opens bar
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {/* ── Floating action bar ── */}
      <span
        className="absolute left-0 bottom-full mb-1.5 z-50"
        style={{
          opacity:       open ? 1 : 0,
          transform:     open ? "translateY(0)" : "translateY(6px)",
          transition:    "opacity 0.15s ease, transform 0.15s ease",
          pointerEvents: open ? "auto" : "none",
          whiteSpace:    "nowrap",
        }}
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
              <ActionBtn icon={<Highlighter size={12} />} label="Highlight" active={!!highlight} activeColor="#fef08a" onClick={() => setMode("colors")} />
              <ActionBtn icon={<Share2      size={12} />} label="Share"     onClick={() => { onShare();   setOpen(false); }} />
              <ActionBtn icon={<Lightbulb  size={12} />} label="Insight"   onClick={() => { onInsight(); setOpen(false); }} />
              <ActionBtn icon={<StickyNote size={12} />} label={note ? "Edit Note" : "Add Note"} active={!!note} activeColor="#d97706" onClick={() => setMode("note")} />
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="px-2 py-1.5 text-stone-500 hover:text-white transition"
                title="Close"
              >
                <X size={11} />
              </button>
            </>
          )}

          {mode === "colors" && (
            <span className="flex items-center gap-1 px-2 py-1.5">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.id}
                  title={c.label}
                  onClick={() => { onSetHighlight(c.id); setMode("bar"); setOpen(false); }}
                  className="w-5 h-5 rounded-full transition-transform hover:scale-125 active:scale-95 flex items-center justify-center shrink-0"
                  style={{ background: c.bg, boxShadow: highlight === c.id ? `0 0 0 2px ${c.ring}` : "none" }}
                >
                  {highlight === c.id && <Check size={9} style={{ color: c.ring }} strokeWidth={3} />}
                </button>
              ))}
              {highlight && (
                <button
                  title="Remove highlight"
                  onClick={() => { onClearHighlight(); setMode("bar"); setOpen(false); }}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition hover:bg-white/20 ml-0.5"
                  style={{ border: "1px dashed rgba(255,255,255,0.25)" }}
                >
                  <X size={9} className="text-stone-400" />
                </button>
              )}
              <button onClick={() => setMode("bar")} className="ml-1 text-stone-500 hover:text-white transition">
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
                style={{ width: 200, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", lineHeight: 1.4 }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setMode("bar"); }
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveNote(); }
                }}
              />
              <button onClick={saveNote} className="px-2 py-1 rounded-lg text-[11px] font-bold transition" style={{ background: "#d97706", color: "white" }} title="Save (Enter)">
                <Check size={11} />
              </button>
              <button onClick={() => setMode("bar")} className="text-stone-500 hover:text-white transition">
                <X size={11} />
              </button>
            </span>
          )}
        </span>

        {/* Small arrow pointing down toward verse */}
        <span
          className="block mx-3 w-0 h-0"
          style={{
            borderLeft:  "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop:   "5px solid rgba(255,255,255,0.13)",
          }}
        />
      </span>

      {/* ── Verse number ── */}
      <sup
        className="mr-[2px] ml-[1px] text-[10px] font-bold not-italic select-none align-top leading-none transition-colors duration-150"
        style={{ color: open ? "#f59e0b" : "#d97706" }}
      >
        {verseNum}
      </sup>

      {/* Note dot indicator */}
      {note && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full mr-0.5 relative top-[-3px]"
          style={{ background: "#d97706", opacity: 0.8 }}
          title="Has note — right-click to edit"
        />
      )}

      {/* Verse text */}
      <span
        className="rounded-sm transition-colors duration-200"
        style={{
          background: highlight ? highlightBg(highlight) : "transparent",
          padding:    highlight ? "1px 2px" : undefined,
          cursor:     "context-menu",
        }}
      >
        {children}
      </span>
    </span>
  );
}

function ActionBtn({ icon, label, onClick, active, activeColor }: {
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
      className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold transition border-r border-white/10"
      style={{ color: active && activeColor ? activeColor : "rgba(255,255,255,0.75)", background: "transparent" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
