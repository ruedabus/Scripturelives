"use client";

/**
 * /challenge/new
 * Create a challenge link to send to a specific friend.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Swords } from "lucide-react";
import { loadSession } from "@/lib/authClient";
import { TOURNAMENT_CATEGORIES } from "@/lib/tournamentTypes";

const ALL_CAT_IDS = TOURNAMENT_CATEGORIES.map((c) => c.id);

export default function NewChallengePage() {
  const router  = useRouter();
  const session = loadSession();

  const [loading,      setLoading]      = useState(false);
  const [errMsg,       setErrMsg]       = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([...ALL_CAT_IDS]);

  const toggleCat = (id: string) =>
    setSelectedCats((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((c) => c !== id) : prev
        : [...prev, id]
    );

  if (!session) {
    return (
      <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center gap-6 text-white px-4">
        <Swords size={48} className="text-amber-400" />
        <h1 className="text-2xl font-bold text-amber-300">Challenge a Friend</h1>
        <p className="text-indigo-300 text-center">Sign in to send a challenge.</p>
        <button
          onClick={() => router.push("/tournament")}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl"
        >
          Sign In
        </button>
      </div>
    );
  }

  const sendChallenge = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await fetch("/api/challenge", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ categories: selectedCats }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create challenge");
      // Redirect to the challenge waiting page
      router.push(`/challenge/${data.code}`);
    } catch (e) {
      setLoading(false);
      setErrMsg(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center justify-center gap-8 text-white px-4 py-12">

      <div className="text-center">
        <div className="text-5xl mb-3">🎯</div>
        <h1 className="text-3xl font-bold text-amber-300">Challenge a Friend</h1>
        <p className="text-indigo-300 mt-1 text-sm">
          We'll generate a link — send it however you like
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5">

        {/* Category picker */}
        <div>
          <p className="text-indigo-300 text-xs font-semibold uppercase mb-2">
            Choose categories
          </p>
          <div className="flex flex-col gap-2">
            {TOURNAMENT_CATEGORIES.map((cat) => {
              const on = selectedCats.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCat(cat.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                    on
                      ? "bg-amber-500/20 border-amber-400/50 text-white"
                      : "bg-white/5 border-white/10 text-indigo-400"
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <div>
                    <p className={`text-sm font-semibold ${on ? "text-white" : "text-indigo-400"}`}>
                      {cat.label}
                    </p>
                    <p className="text-xs text-indigo-500">{cat.desc}</p>
                  </div>
                  <span className={`ml-auto text-xs font-bold ${on ? "text-amber-400" : "text-indigo-600"}`}>
                    {on ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {errMsg && <p className="text-red-400 text-sm text-center">{errMsg}</p>}

        <button
          onClick={sendChallenge}
          disabled={loading}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-lg rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading
            ? <><Loader2 size={20} className="animate-spin" /> Creating…</>
            : <><Swords size={20} /> Create Challenge Link</>}
        </button>

        <p className="text-indigo-500 text-xs text-center">
          Link expires in 15 minutes · ELO rated
        </p>
      </div>

      <button
        onClick={() => router.back()}
        className="text-indigo-400 hover:text-white text-sm transition"
      >
        ← Back
      </button>
    </div>
  );
}
