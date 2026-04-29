"use client";

import { useState } from "react";
import { Loader2, X, Mail } from "lucide-react";
import { useAuth } from "@/lib/authClient";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  onClose:   () => void;
  onSuccess: () => void;
};

export default function AuthModal({ onClose, onSuccess }: Props) {
  const { login, signup } = useAuth();
  const [mode,     setMode]     = useState<"signin" | "signup">("signin");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [info,     setInfo]     = useState("");

  const submit = async () => {
    if (!email || !password) { setError("Email and password required"); return; }
    setLoading(true); setError(""); setInfo("");
    const err = mode === "signin"
      ? await login(email, password)
      : await signup(email, password);
    setLoading(false);
    if (err) {
      if (err.includes("Check your email")) { setInfo(err); return; }
      setError(err);
    } else {
      onSuccess();
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-indigo-950 border border-white/20 rounded-2xl p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-white">
            {mode === "signin" ? "Sign In to Bible Bowl" : "Create Account"}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-white text-gray-800 font-bold py-3 mb-4 hover:bg-gray-100 transition"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.4-4h.3z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.6 35.5 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.6-2.6 4.8-5 6.3l6.2 5.2C40.3 36 43.7 30.5 43.7 24c0-1.3-.1-2.7-.4-4h.3z"/>
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/30">or email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email form */}
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Password"
            className="w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
          />

          {error && <p className="text-red-400 text-xs">{error}</p>}
          {info  && <p className="text-amber-300 text-xs">{info}</p>}

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-3 flex items-center justify-center gap-2 transition"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Mail size={16}/>{mode === "signin" ? "Sign In" : "Create Account"}</>}
          </button>
        </div>

        <p className="text-center text-xs text-indigo-400 mt-4">
          {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
          <button
            className="text-amber-400 hover:text-amber-300 font-semibold transition"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setInfo(""); }}
          >
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </p>

        <p className="text-center text-xs text-indigo-600 mt-2">
          Free forever · No spam
        </p>
      </div>
    </div>
  );
}
