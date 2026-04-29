"use client";

/**
 * OAuth callback — Supabase redirects here after Google sign-in.
 * Extracts the access_token from the URL hash, saves to localStorage,
 * then redirects to profile setup (if new) or /tournament.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveSession } from "@/lib/authClient";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Signing you in…");

  useEffect(() => {
    const hash   = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const token  = params.get("access_token");
    const type   = params.get("type"); // "signup" on first login

    if (!token) {
      setStatus("Sign-in failed — no token received.");
      setTimeout(() => router.push("/tournament"), 2000);
      return;
    }

    // Fetch the user object from Supabase
    const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((user) => {
        if (!user?.id) throw new Error("No user returned");
        saveSession({ id: user.id, email: user.email, access_token: token });

        // New user → go to profile setup; returning user → tournament
        if (type === "signup") {
          router.push("/profile/setup");
        } else {
          router.push("/tournament");
        }
      })
      .catch(() => {
        setStatus("Something went wrong. Redirecting…");
        setTimeout(() => router.push("/tournament"), 2000);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center gap-4 text-white">
      <Loader2 size={36} className="animate-spin text-amber-400" />
      <p className="text-indigo-300">{status}</p>
    </div>
  );
}
