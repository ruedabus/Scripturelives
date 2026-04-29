"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Church, Globe } from "lucide-react";
import { useAuth } from "@/lib/authClient";

const AVATAR_EMOJIS = ["✝️","📖","🙏","👑","⚡","🌟","🕊️","🔥","🛡️","⚔️","🌈","🎺","🏺","🌿","💎","🦁"];

export default function ProfileSetup() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [username,    setUsername]    = useState("");
  const [displayName, setDisplayName] = useState("");
  const [church,      setChurch]      = useState("");
  const [city,        setCity]        = useState("");
  const [country,     setCountry]     = useState("US");
  const [avatar,      setAvatar]      = useState("✝️");
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/tournament");
  }, [user, loading, router]);

  const save = async () => {
    if (!username.trim() || !displayName.trim()) {
      setError("Username and display name are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          Authorization:   `Bearer ${user!.access_token}`,
        },
        body: JSON.stringify({
          username:     username.trim().toLowerCase(),
          display_name: displayName.trim(),
          avatar_url:   avatar,
          church_name:  church.trim() || null,
          church_city:  city.trim()   || null,
          country:      country       || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to save profile"); setSaving(false); return; }
      router.push("/tournament");
    } catch (e) {
      setError(String(e));
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-amber-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✝️</div>
          <h1 className="text-3xl font-extrabold text-white">Set Up Your Profile</h1>
          <p className="text-indigo-300 text-sm mt-1">You&apos;ll represent yourself (and your church!) on the global leaderboard</p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 space-y-5">

          {/* Avatar picker */}
          <div>
            <label className="block text-xs font-bold text-indigo-300 mb-2">Choose Your Icon</label>
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setAvatar(e)}
                  className={`text-2xl rounded-xl p-2 transition ${avatar === e ? "bg-amber-500/40 ring-2 ring-amber-400" : "bg-white/10 hover:bg-white/20"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Display name */}
          <div>
            <label className="block text-xs font-bold text-indigo-300 mb-1">
              <User size={12} className="inline mr-1" />Display Name
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you appear in-game"
              maxLength={30}
              className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-indigo-300 mb-1">Username</label>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus-within:border-amber-400">
              <span className="text-white/30 text-sm mr-1">@</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="your_handle"
                maxLength={30}
                className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
              />
            </div>
            <p className="text-xs text-indigo-500 mt-1">Letters, numbers, underscores only</p>
          </div>

          {/* Church */}
          <div>
            <label className="block text-xs font-bold text-indigo-300 mb-1">
              <Church size={12} className="inline mr-1" />Church Name <span className="text-white/30 font-normal">(optional)</span>
            </label>
            <input
              value={church}
              onChange={(e) => setChurch(e.target.value)}
              placeholder="First Baptist, Hillsong, etc."
              maxLength={60}
              className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* City + Country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Dallas"
                maxLength={40}
                className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1">
                <Globe size={12} className="inline mr-1" />Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-400 bg-indigo-950"
              >
                {[
                  ["US","🇺🇸 United States"],["GB","🇬🇧 United Kingdom"],["CA","🇨🇦 Canada"],
                  ["AU","🇦🇺 Australia"],["NZ","🇳🇿 New Zealand"],["ZA","🇿🇦 South Africa"],
                  ["NG","🇳🇬 Nigeria"],["KE","🇰🇪 Kenya"],["GH","🇬🇭 Ghana"],
                  ["BR","🇧🇷 Brazil"],["MX","🇲🇽 Mexico"],["PH","🇵🇭 Philippines"],
                  ["IN","🇮🇳 India"],["KR","🇰🇷 South Korea"],["OTHER","🌍 Other"],
                ].map(([v, l]) => <option key={v} value={v} className="bg-indigo-950">{l}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-extrabold py-4 flex items-center justify-center gap-2 transition text-lg"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : "Enter the Arena 🏆"}
          </button>
        </div>
      </div>
    </div>
  );
}
