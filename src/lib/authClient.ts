/**
 * Supabase Auth — browser/client side only.
 * Uses the official Supabase JS SDK.
 * Import this ONLY in "use client" components.
 */

import { supabase } from "@/lib/supabaseClient";

export type SessionUser = {
  id:           string;
  email:        string;
  access_token: string;
};

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

// ── Auth hook ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

export function useAuth() {
  const [user,    setUser]    = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try localStorage first (fast)
    const saved = loadSession();
    if (saved) setUser(saved);

    // Then verify/refresh with Supabase SDK
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const u = { id: session.user.id, email: session.user.email!, access_token: session.access_token };
        saveSession(u);
        setUser(u);
      } else if (!saved) {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const u = { id: session.user.id, email: session.user.email!, access_token: session.access_token };
        saveSession(u);
        setUser(u);
      } else {
        clearSession();
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (data.session) {
      const u = { id: data.session.user.id, email: data.session.user.email!, access_token: data.session.access_token };
      saveSession(u);
      setUser(u);
    }
    return null;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return error.message;
    if (!data.session) return "Check your email to confirm your account";
    const u = { id: data.session.user.id, email: data.session.user.email!, access_token: data.session.access_token };
    saveSession(u);
    setUser(u);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    clearSession();
    setUser(null);
  }, []);

  return { user, loading, login, signup, logout };
}
