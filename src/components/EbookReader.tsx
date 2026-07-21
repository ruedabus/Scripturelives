"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { EBOOK_NARRATION, getPageImageUrl } from "@/lib/ebookNarration";

// ── Design tokens ──────────────────────────────────────────────
const NAVY  = "#1a2640";
const GOLD  = "#C9952A";

// ── Types ──────────────────────────────────────────────────────
interface EbookReaderProps {
  bookSlug: string;
  onClose:  () => void;
}

// ── Component ──────────────────────────────────────────────────
export default function EbookReader({ bookSlug, onClose }: EbookReaderProps) {
  const book = EBOOK_NARRATION[bookSlug];

  const [page,        setPage]        = useState(1);          // 1-based
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);      // fetching audio
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [audioError,  setAudioError]  = useState(false);
  const [imgLoaded,   setImgLoaded]   = useState(false);

  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const cacheRef  = useRef<Record<string, string>>({});        // page → blob URL
  const abortRef  = useRef<AbortController | null>(null);

  const totalPages = book?.pages.length ?? 0;

  // ── Cleanup on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      // Revoke any blob URLs we created
      Object.values(cacheRef.current).forEach(URL.revokeObjectURL);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // ── Keyboard navigation ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")  goPrev();
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // ── Reset image load state when page changes ───────────────────
  useEffect(() => {
    setImgLoaded(false);
    setAudioError(false);
  }, [page]);

  // ── Fetch + play audio for current page ───────────────────────
  const playPage = useCallback(async (pageNum: number) => {
    if (!book) return;

    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    abortRef.current?.abort();

    const cacheKey = `${bookSlug}-${pageNum}`;

    // Check cache first
    if (cacheRef.current[cacheKey]) {
      const audio = new Audio(cacheRef.current[cacheKey]);
      audioRef.current = audio;
      setIsPlaying(true);
      setIsLoading(false);
      audio.play().catch(() => { setIsPlaying(false); setAudioError(true); });
      audio.onended = () => {
        if (autoAdvance && pageNum < totalPages) {
          setPage(pageNum + 1);
          // keep isPlaying=true so the page-change effect auto-plays the next page
        } else {
          setIsPlaying(false);
        }
      };
      return;
    }

    setIsLoading(true);
    setAudioError(false);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`/api/narrate?book=${bookSlug}&page=${pageNum}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob    = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      cacheRef.current[cacheKey] = blobUrl;

      const audio   = new Audio(blobUrl);
      audioRef.current = audio;
      setIsLoading(false);
      setIsPlaying(true);

      audio.play().catch(() => {
        setIsPlaying(false);
        setAudioError(true);
      });
      audio.onended = () => {
        if (autoAdvance && pageNum < totalPages) {
          setPage((p) => p + 1);
          // keep isPlaying=true so the page-change effect auto-plays the next page
        } else {
          setIsPlaying(false);
        }
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setIsLoading(false);
      setIsPlaying(false);
      setAudioError(true);
    }
  }, [book, bookSlug, autoAdvance, totalPages]);

  // ── Auto-play when page number changes while "playing" ─────────
  useEffect(() => {
    if (isPlaying && !isLoading) {
      playPage(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ── Prefetch next page audio silently ─────────────────────────
  useEffect(() => {
    const next = page + 1;
    if (next > totalPages) return;
    const cacheKey = `${bookSlug}-${next}`;
    if (cacheRef.current[cacheKey]) return;

    // Fire and forget — low priority
    const prefetch = async () => {
      try {
        const res  = await fetch(`/api/narrate?book=${bookSlug}&page=${next}`);
        if (!res.ok) return;
        const blob = await res.blob();
        cacheRef.current[cacheKey] = URL.createObjectURL(blob);
      } catch { /* silent */ }
    };
    // Delay prefetch so current page loads first
    const t = setTimeout(prefetch, 3000);
    return () => clearTimeout(t);
  }, [page, bookSlug, totalPages]);

  // ── Controls ───────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    if (isLoading) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // If audio exists and is paused, resume it
      if (audioRef.current && audioRef.current.src && !audioRef.current.ended) {
        audioRef.current.play().catch(() => setAudioError(true));
        setIsPlaying(true);
      } else {
        playPage(page);
      }
    }
  }, [isPlaying, isLoading, page, playPage]);

  const goPrev = useCallback(() => {
    if (page <= 1) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    setIsPlaying(false);
    setPage((p) => p - 1);
  }, [page]);

  const goNext = useCallback(() => {
    if (page >= totalPages) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    setIsPlaying(false);
    setPage((p) => p + 1);
  }, [page, totalPages]);

  if (!book) return null;

  const currentPage   = book.pages[page - 1];
  const pageImageSrc  = getPageImageUrl(book, page);

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(10,15,28,0.97)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >

      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.2)` }}
      >
        {/* Title */}
        <div className="flex items-center gap-2 min-w-0">
          <span style={{ fontSize: 18 }}>📖</span>
          <span
            className="text-sm font-bold truncate"
            style={{ color: GOLD }}
          >
            {book.title}
          </span>
        </div>

        {/* Auto-advance toggle */}
        <button
          onClick={() => setAutoAdvance((a) => !a)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition"
          style={{
            background: autoAdvance ? "rgba(201,149,42,0.18)" : "rgba(255,255,255,0.07)",
            color:      autoAdvance ? GOLD : "rgba(255,255,255,0.4)",
            border:     `1px solid ${autoAdvance ? "rgba(201,149,42,0.4)" : "rgba(255,255,255,0.1)"}`,
          }}
          title="Auto-advance to next page when narration ends"
        >
          {autoAdvance ? "⏭ Auto-advance on" : "⏭ Auto-advance off"}
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-full transition hover:opacity-70 ml-3 shrink-0"
          style={{ width: 32, height: 32, background: "rgba(255,255,255,0.08)", color: "white" }}
          aria-label="Close reader"
        >
          ✕
        </button>
      </div>

      {/* ── Page image ── */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: `${GOLD} transparent transparent transparent` }}
            />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={pageImageSrc}
          src={pageImageSrc}
          alt={`Page ${page}: ${currentPage.title}`}
          className="max-w-full max-h-full object-contain"
          style={{
            opacity:    imgLoaded ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
          onLoad={() => setImgLoaded(true)}
        />
      </div>

      {/* ── Controls bar ── */}
      <div
        className="shrink-0 flex flex-col items-center gap-2 px-4 pt-3 pb-4"
        style={{ background: NAVY, borderTop: `1px solid rgba(201,149,42,0.2)` }}
      >
        {/* Page title */}
        <p className="text-xs font-bold uppercase tracking-widest truncate max-w-full"
           style={{ color: "rgba(255,255,255,0.5)" }}>
          Page {page} of {totalPages} — {currentPage.title}
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-sm h-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-1 rounded-full transition-all duration-300"
            style={{ background: GOLD, width: `${(page / totalPages) * 100}%` }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-1">
          {/* Prev */}
          <button
            onClick={goPrev}
            disabled={page <= 1}
            className="flex items-center justify-center rounded-full transition hover:opacity-80 disabled:opacity-20"
            style={{ width: 44, height: 44, background: "rgba(255,255,255,0.08)", color: "white", fontSize: 18 }}
            aria-label="Previous page"
          >
            ◀
          </button>

          {/* Play / Pause / Loading */}
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="flex items-center justify-center rounded-full font-black transition hover:opacity-90 active:scale-95"
            style={{
              width:      64,
              height:     64,
              background: `linear-gradient(135deg, ${GOLD}, #e6a830)`,
              color:      NAVY,
              fontSize:   isLoading ? 14 : 24,
              boxShadow:  `0 4px 20px rgba(201,149,42,0.4)`,
            }}
            aria-label={isLoading ? "Loading…" : isPlaying ? "Pause" : "Play narration"}
          >
            {isLoading ? (
              <span
                className="block w-5 h-5 rounded-full border-2 animate-spin"
                style={{ borderColor: `${NAVY} transparent transparent transparent` }}
              />
            ) : isPlaying ? "⏸" : "▶"}
          </button>

          {/* Next */}
          <button
            onClick={goNext}
            disabled={page >= totalPages}
            className="flex items-center justify-center rounded-full transition hover:opacity-80 disabled:opacity-20"
            style={{ width: 44, height: 44, background: "rgba(255,255,255,0.08)", color: "white", fontSize: 18 }}
            aria-label="Next page"
          >
            ▶
          </button>
        </div>

        {/* Hint / Error state */}
        {audioError ? (
          <p className="text-xs mt-1" style={{ color: "#f87171" }}>
            ⚠️ Couldn't load audio — try again.
          </p>
        ) : !isPlaying && !isLoading && (
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            Press ▶ to read the whole book aloud
          </p>
        )}
      </div>

    </div>
  );
}
