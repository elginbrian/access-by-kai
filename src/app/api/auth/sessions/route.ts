import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createLegacyServerClient } from "@/lib/supabase";

async function getAuthTokenFromRequest(req: NextRequest) {
  const cookieToken = req.cookies.get("sb-access-token")?.value || req.cookies.get("supabase-auth-token")?.value;

  if (!cookieToken) {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/([^;\s]+)-auth-token=([^;]+)/);
    if (match) {
      try {
        const decoded = decodeURIComponent(match[2]);

        try {
          const parsed = JSON.parse(decoded);
          return parsed.access_token || decoded;
        } catch (e) {
          return decoded;
        }
      } catch (e) {
        return match[2];
      }
    }
  }

  return cookieToken || null;
}

export async function GET(req: NextRequest) {
  try {
    const token = await getAuthTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let supabaseForUser;
    try {
      supabaseForUser = createLegacyServerClient();
    } catch (e) {
      supabaseForUser = createLegacyServerClient();
    }

    const { data: userData, error: userErr } = await supabaseForUser.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userData.user.id;

    let supabaseAdmin;
    try {
      supabaseAdmin = createAdminClient();
    } catch (err) {
      console.error("SUPABASE_SERVICE_ROLE_KEY missing. Admin operations (auth.sessions) require service role key.", err);
      return NextResponse.json({ error: "Server not configured to manage sessions. Missing SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
    }

    const sessionsRes: any = await (supabaseAdmin as any).from("auth.sessions").select("id,user_id,ip,user_agent,created_at,expires_at,last_activity").eq("user_id", userId).order("created_at", { ascending: false });

    if (sessionsRes.error) {
      console.error("Error fetching sessions:", sessionsRes.error);
      return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }

    return NextResponse.json({ sessions: sessionsRes.data || [] });
  } catch (err) {
    console.error("/api/auth/sessions GET error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getAuthTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let supabaseForUser;
    try {
      supabaseForUser = createLegacyServerClient();
    } catch (e) {
      supabaseForUser = createLegacyServerClient();
    }

    const { data: userData, error: userErr } = await supabaseForUser.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = userData.user.id;

    // parse body to get session id to revoke
    const body = await req.json().catch(() => ({}));
    const sessionIdToRevoke = body?.sessionId;
    if (!sessionIdToRevoke) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

    let supabaseAdmin;
    try {
      supabaseAdmin = createAdminClient();
    } catch (err) {
      console.error("SUPABASE_SERVICE_ROLE_KEY missing. Admin operations (auth.sessions) require service role key.", err);
      return NextResponse.json({ error: "Server not configured to manage sessions. Missing SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
    }

    // Verify that the session belongs to the user
    const sessionCheck: any = await (supabaseAdmin as any).from("auth.sessions").select("id,user_id").eq("id", sessionIdToRevoke).maybeSingle();
    if (sessionCheck.error) {
      console.error("Error checking session:", sessionCheck.error);
      return NextResponse.json({ error: "Failed to check session" }, { status: 500 });
    }

    if (!sessionCheck.data || sessionCheck.data.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the session row (revokes session). This requires service role privileges.
    const deleteRes: any = await (supabaseAdmin as any).from("auth.sessions").delete().eq("id", sessionIdToRevoke);
    if (deleteRes.error) {
      console.error("Error deleting session:", deleteRes.error);
      return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("/api/auth/sessions DELETE error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
