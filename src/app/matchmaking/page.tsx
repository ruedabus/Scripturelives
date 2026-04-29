"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Swords, X, Globe, Zap } from "lucide-react";
import { loadSession } from "@/lib/authClient";

type MatchStatus = "idle" | "entering" | "waiting" | "matched" | "error";

export default function MatchmakingPage() {
  const router   = useRouter();
  const [status, setStatus]   = useState<MatchStatus>("idle");
  const [errMsg, setErrMsg]   = useState("");
  const [waitSec, setWaitSec] = useState(0);
  const pollRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const session = loadSession();

  // Clear intervals on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current)  clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Poll for match ─────────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/matchmaking/status", {
          headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
          cache:   "no-store",
        });
        const data = await res.json();

        if (data.status === "matched" && data.roomCode && data.playerId) {
          clearInterval(pollRef.current!);
          clearInterval(timerRef.current!);
          setStatus("matched");
          // Short delay so user sees the "matched!" animation
          setTimeout(() => {
            router.push(`/matchmaking/play/${data.roomCode}?playerId=${data.playerId}`);
          }, 1200);
        } else if (data.status === "expired" || data.status === "not_found") {
          // Queue entry disappeared — something went wrong
          clearInterval(pollRef.current!);
          clearInterval(timerRef.current!);
          setStatus("error");
          setErrMsg("Matchmaking timed out. Please try again.");
        }
      } catch {
        // transient error — keep polling
      }
    }, 2000);
  }, [session, router]);

  // ── Enter queue ────────────────────────────────────────────────────────────
  const enterQueue = async () => {
    if (!session) {
      router.push("/tournament");
      return;
    }
    setStatus("entering");
    setErrMsg("");
    try {
      const res = await fetch("/api/matchmaking", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to enter queue");

      if (data.status === "matched") {
        // Instant match!
        setStatus("matched");
        setTimeout(() => {
          router.push(`/matchmaking/play/${data.roomCode}?playerId=${data.playerId}`);
        }, 1000);
        return;
      }

      // Waiting — start polling + elapsed timer
      setStatus("waiting");
      setWaitSec(0);
      timerRef.current = setInterval(() => setWaitSec((s) => s + 1), 1000);
      startPolling();
    } catch (e) {
      setStatus("error");
      setErrMsg(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  // ── Cancel ─────────────────────────────────────────────────────────────────
  const cancel = async () => {
    if (pollRef.current)  clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("idle");
    setWaitSec(0);
    if (session) {
      fetch("/api/matchmaking", {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).catch(() => {});
    }
  };

  // ── Redirect if not signed in ──────────────────────────────────────────────
  if (!session) {
    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center gap-6 text-white px-4">
        <Swords size={48} className="text-amber-400" />
        <h1 className="text-2xl font-bold text-amber-300">Quick Match</h1>
        <p className="text-indigo-300 text-center">You need to sign in to challenge players worldwide.</p>
        <button
          onClick={() => router.push("/tournament")}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
        >
          Sign In on Tournament Page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center justify-center gap-8 text-white px-4">

      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Globe size={32} className="text-amber-400" />
          <h1 className="text-3xl font-bold text-amber-300">Quick Match</h1>
          <Globe size={32} className="text-amber-400" />
        </div>
        <p className="text-indigo-300">Challenge a player anywhere in the world</p>
      </div>

      {/* State card */}
      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 w-full max-w-sm text-center flex flex-col items-center gap-6">

        {status === "idle" && (
          <>
            <div className="text-6xl">⚔️</div>
            <div>
              <p className="text-white font-semibold text-lg">5-question head-to-head</p>
              <p className="text-indigo-300 text-sm mt-1">Fastest and most correct answers win</p>
              <p className="text-indigo-300 text-sm">ELO rating updated after every match</p>
            </div>
            <button
              onClick={enterQueue}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-bold text-lg rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Zap size={22} />
              Find Random Opponent
            </button>

            <div className="w-full border-t border-white/10 pt-4">
              <p className="text-indigo-400 text-xs text-center mb-3">or challenge someone specific</p>
              <button
                onClick={() => router.push("/challenge/new")}
                className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                🎯 Challenge a Friend
              </button>
            </div>
          </>
        )}

        {status === "entering" && (
          <>
            <Loader2 size={48} className="text-amber-400 animate-spin" />
            <p className="text-indigo-200">Searching for opponents…</p>
          </>
        )}

        {status === "waiting" && (
          <>
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-amber-400/30 flex items-center justify-center">
                <Loader2 size={40} className="text-amber-400 animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-white font-semibold">Searching…</p>
              <p className="text-indigo-400 text-sm mt-1">
                {waitSec < 60
                  ? `${waitSec}s`
                  : `${Math.floor(waitSec / 60)}m ${waitSec % 60}s`}
              </p>
            </div>
            <p className="text-indigo-300 text-sm">
              You'll be matched as soon as another player joins
            </p>
            <button
              onClick={cancel}
              className="flex items-center gap-2 text-indigo-400 hover:text-white text-sm transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </>
        )}

        {status === "matched" && (
          <>
            <div className="text-6xl animate-bounce">🏆</div>
            <p className="text-green-400 font-bold text-xl">Opponent found!</p>
            <p className="text-indigo-300">Loading your match…</p>
            <Loader2 size={24} className="text-amber-400 animate-spin" />
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-4xl">😕</div>
            <p className="text-red-400 font-semibold">{errMsg}</p>
            <button
              onClick={() => { setStatus("idle"); setErrMsg(""); }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
            >
              Try Again
            </button>
          </>
        )}

      </div>

      {/* Back link */}
      {(status === "idle" || status === "error") && (
        <button
          onClick={() => router.push("/tournament")}
          className="text-indigo-400 hover:text-white text-sm transition-colors"
        >
          ← Back to Tournament Lobby
        </button>
      )}
    </div>
  );
}
