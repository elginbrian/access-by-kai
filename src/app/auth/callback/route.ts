import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.redirect(`${origin}/auth/login?error=oauth_callback_error`);
      }

      return NextResponse.redirect(`${origin}/auth/oauth-success`);
    } catch (error) {
      console.error("Unexpected OAuth error:", error);
      return NextResponse.redirect(`${origin}/auth/login?error=oauth_unexpected_error`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=oauth_no_code`);
}
