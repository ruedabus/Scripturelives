"use client";

/**
 * /profile/me — resolves the logged-in user's profile and redirects
 * to their /profile/[username] page. If not signed in, sends to /profile/setup.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authClient";

export default function MeRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/profile/setup"); return; }

    // Fetch own profile to get username
    fetch(`/api/profile?id=${encodeURIComponent(user.id)}`, {
      headers: { Authorization: `Bearer ${user.access_token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.username) {
          router.replace(`/profile/${data.username}`);
        } else {
          // Profile not set up yet
          router.replace("/profile/setup");
        }
      })
      .catch(() => router.replace("/profile/setup"));
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0e17" }}>
      <p className="text-indigo-400 animate-pulse">Loading your profile…</p>
    </div>
  );
}
