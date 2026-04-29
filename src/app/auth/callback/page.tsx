"use client";

/**
 * OAuth callback — Supabase redirects here after Google sign-in.
 * The Supabase JS SDK automatically exchanges the PKCE code for a session.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { saveSession } from "@/lib/authClient";

export default function AuthCallback() {
  const router  = useRouter();
  const [status, setStatus] = useState("Signing you in…");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error || !session) {
        // Give it one more second for PKCE exchange to complete
        setTimeout(async () => {
          const { data: { session: s2 } } = await supabase.auth.getSession();
          if (s2) {
            saveSession({ id: s2.user.id, email: s2.user.email!, access_token: s2.access_token });
            router.push("/profile/setup");
          } else {
            setStatus("Something went wrong. Redirecting…");
            setTimeout(() => router.push("/tournament"), 2000);
          }
        }, 1000);
        return;
      }

      saveSession({ id: session.user.id, email: session.user.email!, access_token: session.access_token });

      // Check if they already have a profile
      const res = await fetch(`/api/profile?id=${session.user.id}`);
      if (res.ok) {
        router.push("/tournament");
      } else {
        router.push("/profile/setup");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center gap-4 text-white">
      <Loader2 size={36} className="animate-spin text-amber-400" />
      <p className="text-indigo-300">{status}</p>
    </div>
  );
}
