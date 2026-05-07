"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Swords, X, Globe, Zap } from "lucide-react";
import { loadSession } from "@/lib/authClient";
import Link from "next/link";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD = "#C9952A";
const NAVY = "#1a2640";

type MatchStatus = "idle" | "entering" | "waiting" | "matched" | "error";

export default function MatchmakingPage() {
  const router = useRouter();
  const [status,  setStatus]  = useState<MatchStatus>("idle");
  const [errMsg,  setErrMsg]  = useState("");
  const [waitSec, setWaitSec] = useState(0);
  const pollRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const session = loadSession();

  useEffect(() => {
    return () => {
      if (pollRef.current)  clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch("/api/matchmaking/status", {
          headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
          cache:   "no-store",
        });
        const data = await res.json();
        if (data.status === "matched" && data.roomCode && data.playerId) {
          clearInterval(pollRef.current!);
          clearInterval(timerRef.current!);
          setStatus("matched");
          setTimeout(() => {
            router.push(`/matchmaking/play/${data.roomCode}?playerId=${data.playerId}`);
          }, 1200);
        } else if (data.status === "expired" || data.status === "not_found") {
          clearInterval(pollRef.current!);
          clearInterval(timerRef.current!);
          setStatus("error");
          setErrMsg("Matchmaking timed out. Please try again.");
        }
      } catch { /* transient — keep polling */ }
    }, 2000);
  }, [session, router]);

  const enterQueue = async () => {
    if (!session) { router.push("/tournament"); return; }
    setStatus("entering"); setErrMsg("");
    try {
      const res  = await fetch("/api/matchmaking", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body:    JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to enter queue");
      if (data.status === "matched") {
        setStatus("matched");
        setTimeout(() => router.push(`/matchmaking/play/${data.roomCode}?playerId=${data.playerId}`), 1000);
        return;
      }
      setStatus("waiting"); setWaitSec(0);
      timerRef.current = setInterval(() => setWaitSec((s) => s + 1), 1000);
      startPolling();
    } catch (e) {
      setStatus("error");
      setErrMsg(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const cancel = async () => {
    if (pollRef.current)  clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("idle"); setWaitSec(0);
    if (session) {
      fetch("/api/matchmaking", {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).catch(() => {});
    }
  };

  // ── Not signed in ──────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#faf8f3" }}>
        {/* Nav */}
        <nav className="sticky top-0 z-20 bg-white px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #ede8de" }}>
          <Link href="/tournament" className="text-sm font-semibold transition hover:opacity-70" style={{ color: GOLD }}>← Back</Link>
          <span style={{ color: "#ddd6c8" }}>|</span>
          <span className="text-sm font-bold" style={{ color: NAVY }}>Quick Match</span>
        </nav>

        {/* Hero */}
        <div className="relative overflow-hidden" style={{ background: NAVY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bible-bowl.png" alt="" aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.15, objectPosition: "center 25%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,38,64,0.6) 0%, #faf8f3 100%)" }} />
          <div className="relative z-10 px-4 pt-16 pb-20 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Scripture Lives</span>
              <div className="h-px w-8" style={{ background: GOLD }} />
            </div>
            <Swords size={44} style={{ color: GOLD }} className="mx-auto mb-3" />
            <h1 className="text-4xl font-black text-white mb-2">Quick Match</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              1v1 head-to-head · ELO rated · Players worldwide
            </p>
          </div>
        </div>

        {/* Sign-in prompt card */}
        <div className="flex-1 flex items-start justify-center px-4 py-10">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center" style={{ border: "1px solid #ede8de", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
            <div className="text-5xl mb-4">⚔️</div>
            <h2 className="text-xl font-black mb-2" style={{ color: NAVY }}>Sign in to compete</h2>
            <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
              You need an account to challenge players worldwide and track your ELO rating.
            </p>
            <button
              onClick={() => router.push("/tournament")}
              className="w-full py-3.5 rounded-xl font-black text-sm text-white transition hover:brightness-110"
              style={{ background: GOLD }}
            >
              Sign In on Tournament Page
            </button>
            <Link href="/tournament" className="block mt-4 text-xs font-semibold transition hover:opacity-70" style={{ color: "#9ca3af" }}>
              ← Back to Tournament Lobby
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Signed in ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf8f3" }}>

      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-white px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #ede8de" }}>
        <Link href="/tournament" className="text-sm font-semibold transition hover:opacity-70" style={{ color: GOLD }}>← Back</Link>
        <span style={{ color: "#ddd6c8" }}>|</span>
        <span className="text-sm font-bold" style={{ color: NAVY }}>Quick Match</span>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: NAVY }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bible-bowl.png" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.15, objectPosition: "center 25%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,38,64,0.5) 0%, #faf8f3 100%)" }} />
        <div className="relative z-10 px-4 pt-12 pb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Scripture Lives</span>
            <div className="h-px w-8" style={{ background: GOLD }} />
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Globe size={28} style={{ color: GOLD }} />
            <h1 className="text-4xl font-black text-white">Quick Match</h1>
            <Globe size={28} style={{ color: GOLD }} />
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Challenge a player anywhere in the world
          </p>
        </div>
      </div>

      {/* State card */}
      <div className="flex-1 flex items-start justify-center px-4 py-10 -mt-6">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center flex flex-col items-center gap-6"
          style={{ border: "1px solid #ede8de", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

          {status === "idle" && (
            <>
              <div className="text-6xl">⚔️</div>
              <div>
                <p className="text-lg font-black mb-1" style={{ color: NAVY }}>5-question head-to-head</p>
                <p className="text-sm" style={{ color: "#6b7280" }}>Fastest and most correct answers win</p>
                <p className="text-sm" style={{ color: "#6b7280" }}>ELO rating updated after every match</p>
              </div>
              <button
                onClick={enterQueue}
                className="w-full py-4 rounded-xl font-black text-white text-base flex items-center justify-center gap-2 transition hover:brightness-110"
                style={{ background: GOLD, boxShadow: `0 4px 16px rgba(201,149,42,0.35)` }}
              >
                <Zap size={20} /> Find Random Opponent
              </button>

              <div className="w-full pt-4" style={{ borderTop: "1px solid #f0ece3" }}>
                <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>or challenge someone specific</p>
                <button
                  onClick={() => router.push("/challenge/new")}
                  className="w-full py-3 rounded-xl font-black text-sm transition hover:-translate-y-0.5"
                  style={{ background: "#faf8f3", border: `1px solid rgba(201,149,42,0.3)`, color: NAVY }}
                >
                  🎯 Challenge a Friend
                </button>
              </div>
            </>
          )}

          {status === "entering" && (
            <>
              <Loader2 size={48} className="animate-spin" style={{ color: GOLD }} />
              <p className="text-sm font-semibold" style={{ color: "#6b7280" }}>Searching for opponents…</p>
            </>
          )}

          {status === "waiting" && (
            <>
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ border: `4px solid rgba(201,149,42,0.25)` }}>
                  <Loader2 size={40} className="animate-spin" style={{ color: GOLD }} />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div>
                <p className="font-black text-base" style={{ color: NAVY }}>Searching…</p>
                <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
                  {waitSec < 60 ? `${waitSec}s` : `${Math.floor(waitSec / 60)}m ${waitSec % 60}s`}
                </p>
              </div>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                You&apos;ll be matched as soon as another player joins
              </p>
              <button
                onClick={cancel}
                className="flex items-center gap-2 text-sm font-semibold transition hover:opacity-70"
                style={{ color: "#9ca3af" }}
              >
                <X size={15} /> Cancel
              </button>
            </>
          )}

          {status === "matched" && (
            <>
              <div className="text-6xl animate-bounce">🏆</div>
              <p className="text-xl font-black" style={{ color: "#16a34a" }}>Opponent found!</p>
              <p className="text-sm" style={{ color: "#6b7280" }}>Loading your match…</p>
              <Loader2 size={24} className="animate-spin" style={{ color: GOLD }} />
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-4xl">😕</div>
              <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>{errMsg}</p>
              <button
                onClick={() => { setStatus("idle"); setErrMsg(""); }}
                className="px-6 py-3 rounded-xl font-black text-sm text-white transition hover:brightness-110"
                style={{ background: GOLD }}
              >
                Try Again
              </button>
            </>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs" style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}>
        Scripture Lives · Quick Match · ELO Ranked
      </footer>
    </div>
  );
}
