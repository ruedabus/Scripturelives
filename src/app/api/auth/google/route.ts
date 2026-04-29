/**
 * GET /api/auth/google
 * Server-side redirect to Supabase Google OAuth.
 * Using an API route guarantees env vars are available and avoids
 * any client-side NEXT_PUBLIC_ exposure issues.
 */

import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const redirectTo = "https://scripturelives.com/auth/callback";

  const oauthUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;

  return NextResponse.redirect(oauthUrl);
}
