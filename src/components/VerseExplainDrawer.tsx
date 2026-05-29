"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Volume2, VolumeX, Loader2, BookOpen } from "lucide-react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const VOICE_PREF_KEY = "scripture-lives-explain-voice";

// OpenAI TTS voices with friendly descriptions
const TTS_VOICES = [
  { id: "nova",    label: "Nova",    desc: "Warm · Female" },
  { id: "shimmer", label: "Shimmer", desc: "Soft · Female" },
  { id: "alloy",   label: "Alloy",   desc: "Neutral · Balanced" },
  { id: "echo",    label: "Echo",    desc: "Clear · Male" },
  { id: "fable",   label: "Fable",   desc: "British · Male" },
  { id: "onyx",    label: "Onyx",    desc: "Deep · Male" },
] as const;

type TTSVoiceId = typeof TTS_VOICES[number]["id"];

export type ExplainVerse = {
  reference: string;
  text: string;
};

type Props = {
  verse: ExplainVerse | null;
  onClose: () => void;
};

export default function VerseExplainDrawer({ verse, onClose }: Props) {
  const [explanation,   setExplanation]   = useState<string | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [playing,       setPlaying]       = useState(false);
  const [audioLoading,  setAudioLoading]  = useState(false);
  const [mounted,       setMounted]       = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<TTSVoiceId>("nova");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobRef = useRef<string | null>(null); // object URL cache per session

  // Restore saved voice preference
  useEffect(() => {
    const saved = localStorage.getItem(VOICE_PREF_KEY) as TTSVoiceId | null;
    if (saved && TTS_VOICES.find((v) => v.id === saved)) setSelectedVoice(saved);
  }, []);

  // Animate in/out
  useEffect(() => { setMounted(!!verse); }, [verse]);

  // Stop audio + clean up when drawer closes
  useEffect(() => {
    if (!verse) {
      audioRef.current?.pause();
      setPlaying(false);
      setAudioLoading(false);
    }
  }, [verse]);

  // Revoke stale blob URL when verse changes
  useEffect(() => {
    return () => {
      if (audioBlobRef.current) {
        URL.revokeObjectURL(audioBlobRef.current);
        audioBlobRef.current = null;
      }
    };
  }, [verse]);

  // Fetch AI explanation whenever a new verse is tapped
  useEffect(() => {
    if (!verse) return;
    setExplanation(null);
    setError("");
    setPlaying(false);
    setLoading(true);
    audioRef.current?.pause();
    if (audioBlobRef.current) { URL.revokeObjectURL(audioBlobRef.current); audioBlobRef.current = null; }

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

  const handleVoiceSelect = useCallback((id: TTSVoiceId) => {
    setSelectedVoice(id);
    localStorage.setItem(VOICE_PREF_KEY, id);
    // Clear cached audio so next play uses the new voice
    audioRef.current?.pause();
    setPlaying(false);
    if (audioBlobRef.current) { URL.revokeObjectURL(audioBlobRef.current); audioBlobRef.current = null; }
  }, []);

  const handlePlayPause = useCallback(async () => {
    if (!explanation) return;

    // If already playing, pause
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    // If we have a cached blob, just play it
    if (audioBlobRef.current && audioRef.current) {
      audioRef.current.src = audioBlobRef.current;
      audioRef.current.play().catch(() => setPlaying(false));
      setPlaying(true);
      return;
    }

    // Fetch fresh TTS audio from OpenAI
    setAudioLoading(true);
    try {
      const fullText = `${verse?.reference}. ${explanation}`;
      const res = await fetch("/api/verse-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText, voice: selectedVoice }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      audioBlobRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended  = () => setPlaying(false);
      audio.onerror  = () => { setPlaying(false); setError("Audio playback failed."); };
      audio.play().catch(() => setPlaying(false));
      setPlaying(true);
    } catch {
      setError("Couldn't generate audio. Please try again.");
    } finally {
      setAudioLoading(false);
    }
  }, [explanation, playing, verse, selectedVoice]);

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
          maxHeight: "75vh",
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
        <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: "calc(75vh - 110px)" }}>

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

              {/* Voice picker */}
              <div className="mt-5">
                <p className="text-[10px] font-semibold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  VOICE — powered by OpenAI
                </p>
                <div className="flex flex-wrap gap-2">
                  {TTS_VOICES.map((v) => {
                    const isSelected = v.id === selectedVoice;
                    return (
                      <button
                        key={v.id}
                        onClick={() => handleVoiceSelect(v.id)}
                        title={v.desc}
                        className="flex flex-col items-start px-3 py-2 rounded-xl text-xs font-semibold transition active:scale-95"
                        style={{
                          background: isSelected ? GOLD : "rgba(255,255,255,0.07)",
                          color: isSelected ? NAVY : "rgba(255,255,255,0.75)",
                          border: isSelected ? "none" : "1px solid rgba(255,255,255,0.12)",
                          minWidth: 68,
                        }}
                      >
                        <span className="font-black">{v.label}</span>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? "opacity-70" : "opacity-50"}`}>{v.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Play / Pause button */}
              <div className="mt-4">
                <button
                  onClick={handlePlayPause}
                  disabled={audioLoading}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold transition active:scale-95 disabled:opacity-60"
                  style={{
                    background: playing ? "rgba(255,255,255,0.12)" : GOLD,
                    color: playing ? "white" : NAVY,
                  }}
                >
                  {audioLoading ? (
                    <><Loader2 size={16} className="animate-spin" /> Generating audio…</>
                  ) : playing ? (
                    <><VolumeX size={16} /> Stop Audio</>
                  ) : (
                    <><Volume2 size={16} /> Play Explanation</>
                  )}
                </button>
              </div>

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
