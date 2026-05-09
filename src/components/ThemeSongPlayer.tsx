"use client";

import { useEffect, useRef, useState } from "react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export default function ThemeSongPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent]   = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime   = () => {
      setCurrent(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onLoaded = () => setDuration(audio.duration);
    const onEnded  = () => { setPlaying(false); setProgress(0); setCurrent(0); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else         { audio.play();  setPlaying(true);  }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <section className="max-w-2xl mx-auto w-full px-4 py-6">

      {/* Section label */}
      <p className="text-center text-xs font-bold uppercase tracking-widest mb-4"
         style={{ color: "rgba(201,149,42,0.8)" }}>
        🎵 Official Theme Song
      </p>

      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0d1f3c 0%, #112244 60%, #1a3060 100%)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.35)",
          border: "1px solid rgba(201,149,42,0.2)",
        }}
      >
        {/* ── Large thumbnail ── */}
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <img
            src="/FT-theme-thumbnail.png"
            alt="Faith Tails Theme Song"
            className="w-full h-full"
            style={{ objectFit: "cover", objectPosition: "center", display: "block" }}
          />

          {/* Gradient overlay at bottom so controls blend in */}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "55%",
              background: "linear-gradient(to top, rgba(13,31,60,0.98) 0%, transparent 100%)",
            }}
          />

          {/* Big centred play button over the image */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label={playing ? "Pause" : "Play"}
          >
            <div
              className="flex items-center justify-center rounded-full transition-transform group-hover:scale-110 active:scale-95"
              style={{
                width: 72,
                height: 72,
                background: playing
                  ? "rgba(201,149,42,0.85)"
                  : `linear-gradient(135deg, ${GOLD}, #e6a830)`,
                boxShadow: "0 6px 28px rgba(201,149,42,0.55)",
                backdropFilter: "blur(4px)",
              }}
            >
              {playing ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <rect x="5" y="4" width="4" height="16" rx="1.5" />
                  <rect x="15" y="4" width="4" height="16" rx="1.5" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <polygon points="7,3 21,12 7,21" />
                </svg>
              )}
            </div>
          </button>

          {/* Equalizer bars overlay — bottom-left when playing */}
          {playing && (
            <div className="absolute bottom-3 left-4 flex items-end gap-0.5" style={{ height: 20 }}>
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: 3,
                    background: GOLD,
                    opacity: 0.75,
                    height: `${10 + Math.sin(i * 1.1) * 8}px`,
                    animation: `eq-bounce ${0.5 + (i % 4) * 0.12}s ease-in-out infinite alternate`,
                    animationDelay: `${(i * 0.06) % 0.4}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Controls strip ── */}
        <div className="px-5 pb-5 pt-3 flex flex-col gap-3">

          {/* Title row */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-white font-black text-base leading-tight">
                Faith Tails Theme Song
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                Mav &amp; Moony
              </p>
            </div>
            <span className="text-xs tabular-nums shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>
              {fmt(current)} / {fmt(duration)}
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="relative h-2.5 rounded-full cursor-pointer"
            style={{ background: "rgba(255,255,255,0.12)" }}
            onClick={seek}
          >
            <div
              className="absolute left-0 top-0 h-2.5 rounded-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${GOLD}, #e6a830)`,
                transition: "width 0.1s linear",
              }}
            />
            {/* Scrubber handle */}
            {progress > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white"
                style={{
                  left: `calc(${progress}% - 7px)`,
                  background: GOLD,
                  boxShadow: "0 0 6px rgba(201,149,42,0.6)",
                }}
              />
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes eq-bounce {
          from { transform: scaleY(0.25); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      <audio ref={audioRef} src="/Faith%20Tails%20Theme%20Song.mp3" preload="metadata" />
    </section>
  );
}
