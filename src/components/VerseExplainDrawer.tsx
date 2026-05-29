"use client";

/**
 * VerseExplainDrawer
 * ------------------
 * Slide-up drawer that shows a short AI devotional explanation of a verse
 * and lets the user play it aloud using the browser's SpeechSynthesis API.
 *
 * Usage:
 *   <VerseExplainDrawer verse={activeVerse} onClose={() => setActiveVerse(null)} />
 *
 * where activeVerse = { reference: string; text: string } | null
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Volume2, VolumeX, Loader2, BookOpen } from "lucide-react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export type ExplainVerse = {
  reference: string;
  text: string;
};

type Props = {
  verse: ExplainVerse | null;
  onClose: () => void;
};

export default function VerseExplainDrawer({ verse, onClose }: Props) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [playing,     setPlaying]     = useState(false);
  const [mounted,     setMounted]     = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Animate in
  useEffect(() => {
    if (verse) {
      setMounted(true);
    } else {
      setMounted(false);
    }
  }, [verse]);

  // Stop speech when drawer closes
  useEffect(() => {
    if (!verse && typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
      setPlaying(false);
    }
  }, [verse]);

  // Fetch explanation whenever a new verse is set
  useEffect(() => {
    if (!verse) return;

    setExplanation(null);
    setError("");
    setPlaying(false);
    setLoading(true);

    // Stop any in-progress speech
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }

    const controller = new AbortController();

    fetch("/api/verse-explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: verse.reference, text: verse.text }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        setExplanation(data.explanation);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError("Couldn't load explanation. Please try again.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [verse]);

  const handlePlayPause = useCallback(() => {
    if (!explanation || typeof window === "undefined") return;

    const synth = window.speechSynthesis;

    if (playing) {
      synth.cancel();
      setPlaying(false);
      return;
    }

    // Build utterance: read reference first, then explanation
    const fullText = `${verse?.reference}. ${explanation}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate  = 0.92;
    utterance.pitch = 1.0;

    // Prefer a natural-sounding English voice if available
    const voices = synth.getVoices();
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("neural") ||
          v.name.toLowerCase().includes("google") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("alex"))
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    utteranceRef.current = utterance;
    synth.speak(utterance);
    setPlaying(true);
  }, [explanation, playing, verse]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!verse) return null;

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
          maxHeight: "70vh",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 pt-2 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen size={15} style={{ color: GOLD, flexShrink: 0 }} />
            <div className="min-w-0">
              <p className="text-sm font-black text-white truncate">{verse.reference}</p>
              <p className="text-[11px] leading-snug line-clamp-2 mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                &ldquo;{verse.text}&rdquo;
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
        <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: "calc(70vh - 110px)" }}>

          {loading && (
            <div className="flex items-center gap-3 py-6">
              <Loader2 size={18} className="animate-spin" style={{ color: GOLD }} />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Generating explanation…</p>
            </div>
          )}

          {error && !loading && (
            <p className="text-sm py-4" style={{ color: "#fca5a5" }}>{error}</p>
          )}

          {explanation && !loading && (
            <div>
              {/* Label */}
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                ✦ Verse Insight
              </p>

              {/* Explanation text */}
              <p className="text-[15px] leading-7 text-white/90">
                {explanation}
              </p>

              {/* Play / Pause button */}
              <button
                onClick={handlePlayPause}
                className="mt-5 flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold transition active:scale-95"
                style={{
                  background: playing ? "rgba(255,255,255,0.12)" : GOLD,
                  color: playing ? "white" : NAVY,
                }}
              >
                {playing ? (
                  <>
                    <VolumeX size={16} />
                    Stop Audio
                  </>
                ) : (
                  <>
                    <Volume2 size={16} />
                    Play Explanation
                  </>
                )}
              </button>

              <p className="mt-4 text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Powered by Scripture Lives AI · For personal devotional use
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
