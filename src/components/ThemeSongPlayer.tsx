"use client";

import { useEffect, useRef, useState } from "react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export default function ThemeSongPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]     = useState(false);
  const [progress, setProgress]   = useState(0);   // 0–100
  const [duration, setDuration]   = useState(0);
  const [current, setCurrent]     = useState(0);

  /* ── Sync progress ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      setCurrent(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoaded = () => setDuration(audio.duration);
    const onEnded  = () => { setPlaying(false); setProgress(0); setCurrent(0); };

    audio.addEventListener("timeupdate",  onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended",       onEnded);
    return () => {
      audio.removeEventListener("timeupdate",  onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended",       onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else         { audio.play(); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <section className="max-w-2xl mx-auto w-full px-4 py-2 pb-4">
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #0f3460 100%)`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          border: "1px solid rgba(201,149,42,0.25)",
        }}
      >
        {/* Thumbnail + player row */}
        <div className="flex items-stretch">

          {/* Album art */}
          <div className="shrink-0 w-28 sm:w-36">
            <img
              src="/FT-theme-thumbnail.png"
              alt="Faith Tails Theme Song"
              className="w-full h-full"
              style={{ objectFit: "cover", display: "block" }}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-center gap-3 px-5 py-4 flex-1 min-w-0">

            {/* Title */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                🎵 Official Theme Song
              </p>
              <p className="text-white font-black text-base sm:text-lg leading-tight mt-0.5">
                Faith Tails Theme Song
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                Mav &amp; Moony
              </p>
            </div>

            {/* Progress bar */}
            <div
              className="relative h-2 rounded-full cursor-pointer"
              style={{ background: "rgba(255,255,255,0.15)" }}
              onClick={seek}
            >
              <div
                className="absolute left-0 top-0 h-2 rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${GOLD}, #e6a830)`,
                }}
              />
            </div>

            {/* Time + play button row */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs tabular-nums" style={{ color: "rgba(255,255,255,0.5)" }}>
                {fmt(current)} / {fmt(duration)}
              </span>

              {/* Play / Pause button */}
              <button
                onClick={togglePlay}
                className="flex items-center justify-center rounded-full transition active:scale-95 hover:opacity-90"
                style={{
                  width: 44,
                  height: 44,
                  background: `linear-gradient(135deg, ${GOLD}, #e6a830)`,
                  boxShadow: "0 4px 16px rgba(201,149,42,0.45)",
                  flexShrink: 0,
                }}
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  /* Pause icon */
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  /* Play icon */
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Animated equalizer bar — shows when playing */}
        {playing && (
          <div
            className="flex items-end justify-center gap-0.5 px-4 pb-3 pt-1"
            style={{ height: 24 }}
          >
            {[...Array(28)].map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 3,
                  background: GOLD,
                  opacity: 0.6 + (i % 3) * 0.13,
                  height: `${20 + Math.sin(i * 1.3) * 14}px`,
                  animation: `eq-bounce ${0.6 + (i % 5) * 0.15}s ease-in-out infinite alternate`,
                  animationDelay: `${(i * 0.07) % 0.5}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Keyframe animation injected inline */}
      <style>{`
        @keyframes eq-bounce {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      <audio ref={audioRef} src="/Faith%20Tails%20Theme%20Song.mp3" preload="metadata" />
    </section>
  );
}
