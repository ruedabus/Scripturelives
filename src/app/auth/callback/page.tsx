"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { saveSession } from "@/lib/authClient";

export default function AuthCallback() {
  const router  = useRouter();
  const [status, setStatus] = useState("Signing you in…");

  useEffect(() => {
    // onAuthStateChange fires as soon as the SDK finishes the PKCE code exchange
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          saveSession({
            id:           session.user.id,
            email:        session.user.email!,
            access_token: session.access_token,
          });

          // Check if they already have a profile
          const res = await fetch(`/api/profile?id=${session.user.id}`);
          if (res.ok) {
            router.push("/tournament");
          } else {
            router.push("/profile/setup");
          }
        }
      }
    );

    // Timeout fallback — if nothing happens in 8s, something went wrong
    const timeout = setTimeout(() => {
      setStatus("Something went wrong. Redirecting…");
      setTimeout(() => router.push("/tournament"), 2000);
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center gap-4 text-white">
      <Loader2 size={36} className="animate-spin text-amber-400" />
      <p className="text-indigo-300">{status}</p>
    </div>
  );
}
