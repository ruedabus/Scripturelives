"use client";

/**
 * RelatedVersesDrawer
 * Shows cross-reference verses for a given verse.
 * Data comes from /api/cross-refs (local TSK index, 29k+ entries).
 * Each result fetches its verse text from /api/bible.
 */

import { useEffect, useState } from "react";
import { X, BookOpen, Loader2, GitBranch, ArrowRight } from "lucide-react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export type RelatedVerse = {
  reference: string;
  text: string;
};

type XrefEntry = { book: string; chapter: number; verse: number };

type Props = {
  reference: string | null; // e.g. "John 3:16"
  sourceText: string;       // the verse being looked at
  onClose: () => void;
  onJumpTo?: (book: string, chapter: number) => void;
};

export default function RelatedVersesDrawer({ reference, sourceText, onClose, onJumpTo }: Props) {
  const [related,  setRelated]  = useState<RelatedVerse[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setMounted(!!reference); }, [reference]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Fetch cross-refs then resolve verse texts
  useEffect(() => {
    if (!reference) return;
    setRelated([]);
    setError("");
    setLoading(true);

    const controller = new AbortController();

    (async () => {
      try {
        // 1. Get cross-reference list from our local TSK index
        const xrefRes  = await fetch(`/api/cross-refs?ref=${encodeURIComponent(reference)}`, { signal: controller.signal });
        const xrefData = await xrefRes.json();
        const entries: XrefEntry[] = xrefData.refs ?? [];

        if (entries.length === 0) {
          setRelated([]);
          setLoading(false);
          return;
        }

        // 2. Take up to 8 cross-refs and fetch their verse text from KJV
        const top = entries.slice(0, 8);
        const results = await Promise.all(
          top.map(async (entry) => {
            const ref = `${entry.book} ${entry.chapter}:${entry.verse}`;
            try {
              const r = await fetch(
                `/api/bible?version=KJV&book=${encodeURIComponent(entry.book)}&chapter=${entry.chapter}`,
                { signal: controller.signal }
              );
              const d = await r.json();
              const v = (d.verses ?? []).find((v: { verse: number; text: string }) => v.verse === entry.verse);
              return { reference: ref, text: v?.text ?? "" };
            } catch {
              return { reference: ref, text: "" };
            }
          })
        );

        setRelated(results.filter((r) => r.text));
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError("Couldn't load related verses.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [reference]);

  if (!reference) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: mounted ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out"
        style={{
          background: NAVY,
          transform: mounted ? "translateY(0)" : "translateY(100%)",
          maxHeight: "75vh",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
        </div>

        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 px-5 pt-2 pb-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <GitBranch size={15} style={{ color: GOLD, flexShrink: 0 }} />
            <div className="min-w-0">
              <p className="text-sm font-black text-white">{reference}</p>
              <p className="text-[11px] leading-snug line-clamp-2 mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                &ldquo;{sourceText}&rdquo;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-1.5 transition hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.6)" }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: "calc(75vh - 110px)" }}>

          <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: GOLD }}>
            ✦ Related Verses
          </p>

          {loading && (
            <div className="flex items-center gap-3 py-6">
              <Loader2 size={18} className="animate-spin" style={{ color: GOLD }} />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Loading cross-references…</p>
            </div>
          )}

          {error && !loading && (
            <p className="text-sm py-4" style={{ color: "#fca5a5" }}>{error}</p>
          )}

          {!loading && !error && related.length === 0 && (
            <div className="py-8 text-center">
              <BookOpen size={28} className="mx-auto mb-3 opacity-30" style={{ color: GOLD }} />
              <p className="text-sm font-semibold text-white/60">No cross-references found for this verse.</p>
            </div>
          )}

          {!loading && related.length > 0 && (
            <div className="space-y-3">
              {related.map((r) => {
                // Parse "Book Chapter:Verse" to get book + chapter for navigation
                const match = r.reference.match(/^(.+)\s(\d+):(\d+)$/);
                const book    = match?.[1] ?? "";
                const chapter = parseInt(match?.[2] ?? "1");

                return (
                  <div
                    key={r.reference}
                    className="rounded-xl p-3.5 group"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs font-black"
                        style={{ color: GOLD }}
                      >
                        {r.reference}
                      </span>
                      {onJumpTo && book && (
                        <button
                          onClick={() => { onJumpTo(book, chapter); onClose(); }}
                          className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                          style={{
                            background: "rgba(201,149,42,0.15)",
                            color: GOLD,
                            border: "1px solid rgba(201,149,42,0.25)",
                          }}
                          title={`Go to ${r.reference}`}
                        >
                          Go <ArrowRight size={10} />
                        </button>
                      )}
                    </div>
                    <p
                      className="text-sm leading-relaxed font-serif"
                      style={{ color: "rgba(255,255,255,0.82)" }}
                    >
                      {r.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && related.length > 0 && (
            <p className="mt-5 text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              Cross-references from the Treasury of Scripture Knowledge · KJV
            </p>
          )}
        </div>
      </div>
    </>
  );
}
