"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Volume2, VolumeX, Loader2, BookOpen, ChevronDown } from "lucide-react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const VOICE_PREF_KEY = "scripture-lives-explain-voice";

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

  // Voice picker
  const [voices,       setVoices]       = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>(""); // voice.name
  const [showVoices,   setShowVoices]   = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices (they may arrive asynchronously)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const all = synth.getVoices();
      // Show only English voices, sorted alphabetically
      const en = all.filter((v) => v.lang.startsWith("en")).sort((a, b) => a.name.localeCompare(b.name));
      if (en.length === 0) return;
      setVoices(en);

      // Restore saved preference
      const saved = localStorage.getItem(VOICE_PREF_KEY);
      if (saved && en.find((v) => v.name === saved)) {
        setSelectedVoice(saved);
      } else {
        // Pick a nice default
        const preferred = en.find(
          (v) =>
            v.name.toLowerCase().includes("samantha") ||
            v.name.toLowerCase().includes("natural") ||
            v.name.toLowerCase().includes("neural") ||
            v.name.toLowerCase().includes("google") ||
            v.name.toLowerCase().includes("alex")
        );
        setSelectedVoice(preferred?.name ?? en[0]?.name ?? "");
      }
    };

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);
    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // Animate in/out
  useEffect(() => {
    setMounted(!!verse);
  }, [verse]);

  // Stop speech when drawer closes
  useEffect(() => {
    if (!verse && typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
      setPlaying(false);
    }
  }, [verse]);

  // Fetch explanation whenever a new verse opens
  useEffect(() => {
    if (!verse) return;
    setExplanation(null);
    setError("");
    setPlaying(false);
    setLoading(true);
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();

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

  const handleVoiceSelect = useCallback((name: string) => {
    setSelectedVoice(name);
    localStorage.setItem(VOICE_PREF_KEY, name);
    setShowVoices(false);
    // If currently playing, restart with new voice
    if (playing) {
      window.speechSynthesis?.cancel();
      setPlaying(false);
    }
  }, [playing]);

  const handlePlayPause = useCallback(() => {
    if (!explanation || typeof window === "undefined") return;
    const synth = window.speechSynthesis;

    if (playing) {
      synth.cancel();
      setPlaying(false);
      return;
    }

    const fullText = `${verse?.reference}. ${explanation}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate  = 0.92;
    utterance.pitch = 1.0;

    if (selectedVoice) {
      const voice = synth.getVoices().find((v) => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    utterance.onend   = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    utteranceRef.current = utterance;
    synth.speak(utterance);
    setPlaying(true);
  }, [explanation, playing, verse, selectedVoice]);

  // Close on Escape or backdrop click
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { setShowVoices(false); onClose(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!verse) return null;

  const currentVoiceLabel = voices.find((v) => v.name === selectedVoice)?.name ?? "Default voice";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: mounted ? 1 : 0 }}
        onClick={() => { setShowVoices(false); onClose(); }}
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

              {/* Play controls row */}
              <div className="mt-5 flex items-center gap-3 flex-wrap">

                {/* Play / Stop button */}
                <button
                  onClick={handlePlayPause}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-semibold transition active:scale-95 shrink-0"
                  style={{
                    background: playing ? "rgba(255,255,255,0.12)" : GOLD,
                    color: playing ? "white" : NAVY,
                  }}
                >
                  {playing ? (
                    <><VolumeX size={16} /> Stop Audio</>
                  ) : (
                    <><Volume2 size={16} /> Play Explanation</>
                  )}
                </button>

                {/* Voice picker */}
                {voices.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowVoices((s) => !s)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition hover:bg-white/10"
                      style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      <Volume2 size={12} />
                      <span className="max-w-[130px] truncate">{currentVoiceLabel}</span>
                      <ChevronDown size={11} />
                    </button>

                    {/* Voice dropdown */}
                    {showVoices && (
                      <div
                        className="absolute bottom-full mb-2 left-0 rounded-xl shadow-2xl overflow-hidden z-10"
                        style={{ background: "#0f1a2e", border: "1px solid rgba(255,255,255,0.12)", minWidth: 220, maxHeight: 260, overflowY: "auto" }}
                      >
                        <p className="px-3 pt-3 pb-1.5 text-[10px] font-black uppercase tracking-widest" style={{ color: GOLD }}>
                          Choose Voice
                        </p>
                        {voices.map((v) => (
                          <button
                            key={v.name}
                            onClick={() => handleVoiceSelect(v.name)}
                            className="w-full text-left px-3 py-2 text-xs transition hover:bg-white/10 flex items-center gap-2"
                            style={{ color: v.name === selectedVoice ? GOLD : "rgba(255,255,255,0.8)" }}
                          >
                            {v.name === selectedVoice && <span style={{ color: GOLD }}>✓</span>}
                            <span className={v.name === selectedVoice ? "font-bold" : ""}>
                              {v.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
