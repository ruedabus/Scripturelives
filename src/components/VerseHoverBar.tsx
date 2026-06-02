"use client";

/**
 * VerseHoverBar
 * Desktop  → right-click opens a floating mini-bar above the verse
 * Mobile   → long-press (500ms) opens a fixed bottom sheet with large tap targets
 */

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Share2, Lightbulb, StickyNote, Highlighter, X, Check, GitBranch } from "lucide-react";
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
  onRelated:        () => void;
  onSetHighlight:   (c: HighlightColor) => void;
  onClearHighlight: () => void;
  onSaveNote:       (t: string) => void;
  onDeleteNote:     () => void;
  children:         React.ReactNode;
};

export default function VerseHoverBar({
  reference, text, verseNum,
  highlight, note,
  onShare, onInsight, onRelated,
  onSetHighlight, onClearHighlight,
  onSaveNote, onDeleteNote,
  children,
}: Props) {
  const [open,      setOpen]      = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);
  const [mode,      setMode]      = useState<"bar" | "colors" | "note">("bar");
  const [noteText,  setNoteText]  = useState(note?.text ?? "");
  const [mounted,   setMounted]   = useState(false); // for portal SSR safety

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rootRef     = useRef<HTMLSpanElement>(null);
  const lpTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired     = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  // Reset mode when bar closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setMode("bar"), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Focus textarea when note mode opens
  useEffect(() => {
    if (mode === "note") {
      setNoteText(note?.text ?? "");
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [mode, note]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onMouse(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        // For mobile sheet the click target won't be in rootRef, handled by backdrop
        if (!isMobile) setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown",   onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown",   onKey);
    };
  }, [open, isMobile]);

  function openDesktop(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsMobile(false);
    setOpen(true);
  }

  function saveNote() {
    if (noteText.trim()) onSaveNote(noteText.trim());
    else onDeleteNote();
    setMode("bar");
    setOpen(false);
  }

  // ── Mobile long-press ──────────────────────────────────────────────────────
  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse") return;
    lpFired.current = false;
    lpTimer.current = setTimeout(() => {
      lpFired.current = true;
      setIsMobile(true);
      setOpen(true);
    }, 500);
  }
  function onPointerUp(e: React.PointerEvent) {
    if (e.pointerType === "mouse") return;
    if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; }
    if (lpFired.current) { e.preventDefault(); lpFired.current = false; }
  }
  function onPointerCancel() {
    if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; }
    lpFired.current = false;
  }

  // ── Shared bar content (used by both desktop floating + mobile sheet) ──────
  function BarContent() {
    return (
      <>
        {mode === "bar" && (
          <div className={isMobile ? "flex flex-col w-full" : "flex items-center"}>
            {isMobile ? (
              /* Mobile: large stacked rows */
              <>
                <MobileRow icon={<Highlighter size={18} />} label={highlight ? "Change Highlight" : "Highlight"} active={!!highlight} activeColor="#fef08a" onClick={() => setMode("colors")} />
                <MobileRow icon={<Share2      size={18} />} label="Share Verse"   onClick={() => { onShare();   setOpen(false); }} />
                <MobileRow icon={<Lightbulb  size={18} />} label="Verse Insight" onClick={() => { onInsight(); setOpen(false); }} />
                <MobileRow icon={<GitBranch  size={18} />} label="Related Verses" onClick={() => { onRelated(); setOpen(false); }} />
                <MobileRow icon={<StickyNote size={18} />} label={note ? "Edit Note" : "Add Note"} active={!!note} activeColor="#d97706" onClick={() => setMode("note")} />
              </>
            ) : (
              /* Desktop: compact horizontal */
              <>
                <ActionBtn icon={<Highlighter size={12} />} label="Highlight" active={!!highlight} activeColor="#fef08a" onClick={() => setMode("colors")} />
                <ActionBtn icon={<Share2      size={12} />} label="Share"     onClick={() => { onShare();   setOpen(false); }} />
                <ActionBtn icon={<Lightbulb  size={12} />} label="Insight"   onClick={() => { onInsight(); setOpen(false); }} />
                <ActionBtn icon={<GitBranch  size={12} />} label="Related"   onClick={() => { onRelated(); setOpen(false); }} />
                <ActionBtn icon={<StickyNote size={12} />} label={note ? "Edit Note" : "Add Note"} active={!!note} activeColor="#d97706" onClick={() => setMode("note")} />
                <button onClick={() => setOpen(false)} className="px-2 py-1.5 text-stone-500 hover:text-white transition" title="Close">
                  <X size={11} />
                </button>
              </>
            )}
          </div>
        )}

        {mode === "colors" && (
          <div className={isMobile ? "px-4 py-2" : "flex items-center gap-1 px-2 py-1.5"}>
            {isMobile && (
              <p className="text-xs font-bold text-stone-400 mb-3 uppercase tracking-widest">Choose a highlight colour</p>
            )}
            <div className={isMobile ? "flex justify-around mb-4" : "flex items-center gap-1"}>
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.id}
                  title={c.label}
                  onClick={() => { onSetHighlight(c.id); setMode("bar"); setOpen(false); }}
                  className="rounded-full flex items-center justify-center active:scale-95 transition-transform"
                  style={{
                    width: isMobile ? 44 : 20,
                    height: isMobile ? 44 : 20,
                    background: c.bg,
                    boxShadow: highlight === c.id ? `0 0 0 3px ${c.ring}` : "none",
                  }}
                >
                  {highlight === c.id && <Check size={isMobile ? 16 : 9} style={{ color: c.ring }} strokeWidth={3} />}
                </button>
              ))}
              {highlight && (
                <button
                  title="Remove highlight"
                  onClick={() => { onClearHighlight(); setMode("bar"); setOpen(false); }}
                  className="rounded-full flex items-center justify-center transition hover:bg-white/20"
                  style={{
                    width: isMobile ? 44 : 20,
                    height: isMobile ? 44 : 20,
                    border: "2px dashed rgba(255,255,255,0.3)",
                  }}
                >
                  <X size={isMobile ? 16 : 9} className="text-stone-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setMode("bar")}
              className={isMobile
                ? "w-full py-3 rounded-xl text-sm font-semibold text-stone-400 border border-white/10"
                : "ml-1 text-stone-500 hover:text-white transition"
              }
            >
              {isMobile ? "Back" : <X size={11} />}
            </button>
          </div>
        )}

        {mode === "note" && (
          <div className={isMobile ? "px-4 py-2" : "flex items-center gap-1 px-2 py-1"}>
            <textarea
              ref={textareaRef}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write a note…"
              rows={isMobile ? 4 : 1}
              className="rounded-lg px-3 py-2 resize-none outline-none text-sm"
              style={{
                width: isMobile ? "100%" : 200,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                lineHeight: 1.5,
                marginBottom: isMobile ? 10 : 0,
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setMode("bar");
                if (e.key === "Enter" && !e.shiftKey && !isMobile) { e.preventDefault(); saveNote(); }
              }}
            />
            {isMobile ? (
              <div className="flex gap-2 mt-1">
                <button onClick={() => setMode("bar")} className="flex-1 py-3 rounded-xl text-sm font-semibold text-stone-400 border border-white/10">Cancel</button>
                <button onClick={saveNote} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: "#d97706", color: "white" }}>Save Note</button>
              </div>
            ) : (
              <>
                <button onClick={saveNote} className="px-2 py-1 rounded-lg text-[11px] font-bold transition" style={{ background: "#d97706", color: "white" }}>
                  <Check size={11} />
                </button>
                <button onClick={() => setMode("bar")} className="text-stone-500 hover:text-white transition">
                  <X size={11} />
                </button>
              </>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <span
      ref={rootRef}
      className="relative inline"
      onContextMenu={openDesktop}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {/* ── Desktop: floating bar above verse ── */}
      {!isMobile && (
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
            style={{ background: "#1c1917", border: "1px solid rgba(255,255,255,0.13)", fontSize: 11 }}
          >
            <span className="px-2.5 py-1.5 font-black text-[10px] border-r border-white/10 select-none" style={{ color: "#d97706" }}>
              {reference}
            </span>
            <BarContent />
          </span>
          <span className="block mx-3 w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid rgba(255,255,255,0.13)" }} />
        </span>
      )}

      {/* ── Mobile: fixed bottom sheet via portal ── */}
      {isMobile && mounted && open && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* Sheet */}
          <div
            className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-2xl shadow-2xl"
            style={{
              background: "#1c1917",
              border: "1px solid rgba(255,255,255,0.12)",
              paddingBottom: "env(safe-area-inset-bottom, 16px)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>
            {/* Reference + verse preview */}
            <div className="px-4 pt-1 pb-3 border-b border-white/10">
              <p className="text-sm font-black" style={{ color: "#d97706" }}>{reference}</p>
              <p className="text-xs text-stone-400 mt-0.5 line-clamp-2 italic">&ldquo;{text}&rdquo;</p>
            </div>
            {/* Actions */}
            <div className="px-2 py-2">
              <BarContent />
            </div>
          </div>
        </>,
        document.body
      )}

      {/* ── Verse number ── */}
      <sup
        className="mr-[2px] ml-[1px] text-[10px] font-bold not-italic select-none align-top leading-none transition-colors duration-150"
        style={{ color: open ? "#f59e0b" : "#d97706" }}
      >
        {verseNum}
      </sup>

      {/* Note dot */}
      {note && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full mr-0.5 relative top-[-3px]"
          style={{ background: "#d97706", opacity: 0.8 }}
          title="Has note"
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

// ── Desktop compact button ─────────────────────────────────────────────────────
function ActionBtn({ icon, label, onClick, active, activeColor }: {
  icon: React.ReactNode; label: string; onClick: () => void;
  active?: boolean; activeColor?: string;
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

// ── Mobile full-width row ──────────────────────────────────────────────────────
function MobileRow({ icon, label, onClick, active, activeColor }: {
  icon: React.ReactNode; label: string; onClick: () => void;
  active?: boolean; activeColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full px-4 py-4 text-left transition active:bg-white/10 border-b border-white/06"
      style={{ color: active && activeColor ? activeColor : "rgba(255,255,255,0.85)" }}
    >
      <span style={{ color: active && activeColor ? activeColor : "#d97706", opacity: 0.9 }}>{icon}</span>
      <span className="text-base font-semibold">{label}</span>
      {active && <span className="ml-auto w-2 h-2 rounded-full" style={{ background: activeColor ?? "#d97706" }} />}
    </button>
  );
}
