"use client";

/**
 * /challenge/[code]
 *
 * Two views depending on who's looking:
 *  • Challenger  → sees a "Waiting for opponent" screen with a copyable link + polls for acceptance
 *  • Everyone else → sees the challenge card + "Accept" button
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Copy, Check, Swords, X, Clock } from "lucide-react";
import { loadSession } from "@/lib/authClient";
import type { Challenge } from "@/lib/challenges";

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeLeft(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "expired";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ── Challenger waiting view ───────────────────────────────────────────────────

function ChallengerView({
  challenge, challengeUrl,
}: { challenge: Challenge; challengeUrl: string }) {
  const router       = useRouter();
  const [copied, setCopied]     = useState(false);
  const [timeStr, setTimeStr]   = useState(timeLeft(challenge.expires_at));
  const [status, setStatus]     = useState(challenge.status);
  const pollRef                 = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown ticker
  useEffect(() => {
    const iv = setInterval(() => setTimeStr(timeLeft(challenge.expires_at)), 1000);
    return () => clearInterval(iv);
  }, [challenge.expires_at]);

  // Poll for acceptance
  useEffect(() => {
    if (status !== "pending") return;

    pollRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`/api/challenge/${challenge.code}`, { cache: "no-store" });
        const data = await res.json() as Challenge;
        setStatus(data.status);

        if (data.status === "accepted" && data.room_code && data.challenger_player_id) {
          clearInterval(pollRef.current!);
          router.push(
            `/matchmaking/play/${data.room_code}?playerId=${data.challenger_player_id}`
          );
        }
      } catch { /* transient */ }
    }, 2000);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [status, challenge.code, challenge.challenger_player_id, router]);

  const copy = async () => {
    await navigator.clipboard.writeText(challengeUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cancel = async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    await fetch(`/api/challenge/${challenge.code}`, { method: "DELETE" }).catch(() => {});
    router.push("/tournament");
  };

  if (status === "declined") {
    return (
      <CenteredCard>
        <div className="text-5xl">😔</div>
        <p className="text-white font-bold text-xl">Challenge declined</p>
        <p className="text-indigo-300 text-sm">Your friend passed this time.</p>
        <button
          onClick={() => router.push("/matchmaking")}
          className="mt-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
        >
          Try Quick Match Instead
        </button>
      </CenteredCard>
    );
  }

  if (status === "expired" || timeStr === "expired") {
    return (
      <CenteredCard>
        <div className="text-5xl">⌛</div>
        <p className="text-white font-bold text-xl">Challenge expired</p>
        <p className="text-indigo-300 text-sm">The 15-minute window has passed.</p>
        <button
          onClick={() => router.push("/tournament")}
          className="mt-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
        >
          Back to Lobby
        </button>
      </CenteredCard>
    );
  }

  return (
    <CenteredCard>
      {/* Animated ping */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-purple-700/40 flex items-center justify-center">
          <span className="text-4xl">{challenge.challenger_emoji}</span>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 animate-ping" />
      </div>

      <p className="text-amber-300 font-bold text-lg">Challenge sent!</p>
      <p className="text-indigo-300 text-sm text-center">
        Share this link with your friend — expires in{" "}
        <span className="text-white font-semibold">{timeStr}</span>
      </p>

      {/* Copyable link */}
      <div className="w-full bg-white/10 border border-white/20 rounded-xl p-3 flex items-center gap-2">
        <p className="flex-1 text-indigo-200 text-xs truncate">{challengeUrl}</p>
        <button
          onClick={copy}
          className="shrink-0 flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Share button (Web Share API if available) */}
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          onClick={() => navigator.share?.({ title: "Bible Bowl Challenge", url: challengeUrl }).catch(() => {})}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition"
        >
          📤 Share Link
        </button>
      )}

      {/* Waiting indicator */}
      <div className="flex items-center gap-2 text-indigo-400 text-sm">
        <Loader2 size={16} className="animate-spin" />
        Waiting for your friend to accept…
      </div>

      <div className="flex items-center gap-2 text-indigo-500 text-xs">
        <Clock size={12} />
        <span>Expires in {timeStr}</span>
      </div>

      <button
        onClick={cancel}
        className="flex items-center gap-1.5 text-indigo-400 hover:text-white text-xs transition mt-1"
      >
        <X size={13} />
        Cancel challenge
      </button>
    </CenteredCard>
  );
}

// ── Acceptance view ───────────────────────────────────────────────────────────

function AcceptView({ challenge }: { challenge: Challenge }) {
  const router    = useRouter();
  const session   = loadSession();
  const [loading,   setLoading]   = useState(false);
  const [errMsg,    setErrMsg]    = useState("");
  const [timeStr,   setTimeStr]   = useState(timeLeft(challenge.expires_at));

  useEffect(() => {
    const iv = setInterval(() => setTimeStr(timeLeft(challenge.expires_at)), 1000);
    return () => clearInterval(iv);
  }, [challenge.expires_at]);

  const expired = timeStr === "expired" || challenge.status !== "pending";

  const accept = async () => {
    if (!session) {
      // Save challenge code to localStorage so we can redirect back after login
      localStorage.setItem("pending_challenge", challenge.code);
      router.push("/tournament"); // trigger sign-in modal there
      return;
    }
    setLoading(true);
    setErrMsg("");
    try {
      const res = await fetch(`/api/challenge/${challenge.code}`, {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${session.access_token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to accept");
      router.push(`/matchmaking/play/${data.roomCode}?playerId=${data.playerId}`);
    } catch (e) {
      setLoading(false);
      setErrMsg(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  const decline = async () => {
    await fetch(`/api/challenge/${challenge.code}`, { method: "DELETE" }).catch(() => {});
    router.push("/tournament");
  };

  if (challenge.status === "accepted") {
    return (
      <CenteredCard>
        <div className="text-5xl">✅</div>
        <p className="text-white font-bold text-xl">Challenge already accepted</p>
        <p className="text-indigo-300 text-sm">This match is already underway.</p>
      </CenteredCard>
    );
  }

  if (challenge.status === "declined") {
    return (
      <CenteredCard>
        <div className="text-5xl">❌</div>
        <p className="text-white font-bold text-xl">Challenge declined</p>
      </CenteredCard>
    );
  }

  return (
    <CenteredCard>
      {/* Challenger profile */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-6xl">{challenge.challenger_emoji}</span>
        <p className="text-white font-bold text-xl">{challenge.challenger_name}</p>
        <p className="text-indigo-400 text-sm">ELO {challenge.challenger_elo}</p>
      </div>

      <div className="text-center">
        <p className="text-amber-300 font-bold text-lg flex items-center justify-center gap-2">
          <Swords size={20} />
          Challenges you to a Bible Bowl!
        </p>
        <p className="text-indigo-300 text-sm mt-1">5 questions · ELO rated · 1v1</p>
      </div>

      {errMsg && (
        <p className="text-red-400 text-sm text-center">{errMsg}</p>
      )}

      {expired ? (
        <>
          <p className="text-red-400 font-semibold">This challenge has expired</p>
          <button
            onClick={() => router.push("/tournament")}
            className="px-6 py-3 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded-xl"
          >
            Back to Lobby
          </button>
        </>
      ) : (
        <>
          <button
            onClick={accept}
            disabled={loading}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-black text-lg rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 size={20} className="animate-spin" /> Starting match…</>
              : "⚔️ Accept Challenge"}
          </button>

          {!session && (
            <p className="text-indigo-400 text-xs text-center">
              You'll be asked to sign in to accept
            </p>
          )}

          <button
            onClick={decline}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-white text-sm transition"
          >
            <X size={14} />
            Decline
          </button>

          <div className="flex items-center gap-1.5 text-indigo-500 text-xs">
            <Clock size={12} />
            Expires in {timeStr}
          </div>
        </>
      )}
    </CenteredCard>
  );
}

// ── Shared layout ─────────────────────────────────────────────────────────────

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 flex flex-col items-center gap-5">
        {children}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChallengePage() {
  const params    = useParams();
  const code      = (params?.code as string ?? "").toUpperCase();
  const session   = loadSession();
  const router    = useRouter();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);

  const challengeUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/challenge/${code}`
      : `https://scripturelives.com/challenge/${code}`;

  const fetchChallenge = useCallback(async () => {
    const res = await fetch(`/api/challenge/${code}`, { cache: "no-store" });
    if (!res.ok) { setNotFound(true); setLoading(false); return; }
    setChallenge(await res.json());
    setLoading(false);
  }, [code]);

  useEffect(() => { fetchChallenge(); }, [fetchChallenge]);

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
        <Loader2 size={40} className="text-amber-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !challenge) {
    return (
      <CenteredCard>
        <div className="text-5xl">🔍</div>
        <p className="text-white font-bold text-xl">Challenge not found</p>
        <p className="text-indigo-300 text-sm text-center">
          This link may have expired or already been used.
        </p>
        <button
          onClick={() => router.push("/tournament")}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
        >
          Go to Tournament Lobby
        </button>
      </CenteredCard>
    );
  }

  // Challenger sees the waiting view
  if (session?.id === challenge.challenger_id) {
    return <ChallengerView challenge={challenge} challengeUrl={challengeUrl} />;
  }

  // Everyone else sees the accept view
  return <AcceptView challenge={challenge} />;
}
