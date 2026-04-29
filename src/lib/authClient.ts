/**
 * Supabase Auth — browser/client side only.
 * Uses the public anon key (safe to expose).
 *
 * Import this ONLY in "use client" components.
 */

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export type SessionUser = {
  id:           string;
  email:        string;
  access_token: string;
};

// ── Auth actions ──────────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string): Promise<{ user: SessionUser | null; error: string | null }> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method:  "POST",
    headers: { apikey: SUPABASE_ANON, "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { user: null, error: data.error_description ?? data.msg ?? "Sign in failed" };
  return {
    user: { id: data.user.id, email: data.user.email, access_token: data.access_token },
    error: null,
  };
}

export async function signUpWithEmail(email: string, password: string): Promise<{ user: SessionUser | null; error: string | null }> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method:  "POST",
    headers: { apikey: SUPABASE_ANON, "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || data.error) return { user: null, error: data.error_description ?? data.msg ?? data.error ?? "Sign up failed" };
  if (!data.access_token) return { user: null, error: "Check your email to confirm your account" };
  return {
    user: { id: data.user.id, email: data.user.email, access_token: data.access_token },
    error: null,
  };
}

export async function signOut(token: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method:  "POST",
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` },
  });
}

export async function getGoogleOAuthUrl(): Promise<string> {
  return `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(window.location.origin + "/auth/callback")}`;
}

// ── Session persistence (localStorage) ───────────────────────────────────────

const SESSION_KEY = "sb_session";

export function saveSession(user: SessionUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function loadSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch { return null; }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

// ── Auth context hook (use in components) ─────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [user,    setUser]    = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(loadSession());
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u, error } = await signInWithEmail(email, password);
    if (u) { saveSession(u); setUser(u); }
    return error;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const { user: u, error } = await signUpWithEmail(email, password);
    if (u) { saveSession(u); setUser(u); }
    return error;
  }, []);

  const logout = useCallback(async () => {
    if (user) await signOut(user.access_token);
    clearSession();
    setUser(null);
  }, [user]);

  return { user, loading, login, signup, logout };
}
