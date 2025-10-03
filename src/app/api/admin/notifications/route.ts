import { NextRequest, NextResponse } from "next/server";
import { createLegacyServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const supabase = createLegacyServerClient();

    // Extract auth token
    const cookieString = request.headers.get("cookie") || "";
    let authToken = null;

    const authCookieMatch = cookieString.match(/([^;\s]+)-auth-token=([^;]+)/);
    if (authCookieMatch) {
      const cookieValue = authCookieMatch[2];
      if (cookieValue.startsWith("base64-")) {
        try {
          const decodedData = atob(cookieValue.substring(7));
          const tokenData = JSON.parse(decodedData);
          authToken = tokenData.access_token;
        } catch (e) {
          console.warn("Failed to decode auth token:", e);
        }
      } else {
        authToken = cookieValue;
      }
    }

    if (!authToken) {
      authToken = request.cookies.get("sb-access-token")?.value || request.cookies.get("supabase-auth-token")?.value;
    }

    const { data, error } = await supabase.auth.getUser(authToken || undefined);
    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user profile and role
    const { data: currentUser, error: userError } = await supabase
      .from("pengguna")
      .select("user_id, role")
      .eq("email", data.user.email || "")
      .single();

    if (userError || !currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // if (currentUser.role !== "admin") {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query: any = (supabase as any).from("notifications").select("*").order("created_at", { ascending: false });

    // optional filters
    const isRead = searchParams.get("is_read") ?? searchParams.get("isRead");
    const type = searchParams.get("type");

    if (isRead !== null) query = query.eq("is_read", isRead === "true");
    if (type) query = query.eq("tipe_notifikasi", type);

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: notifications, error: notifError } = await query;
    if (notifError) {
      console.error("Error fetching admin notifications:", notifError);
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }

    const { count } = await (supabase as any).from("notifications").select("*", { count: "exact", head: true });

    return NextResponse.json({ success: true, data: notifications, pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) } });
  } catch (error) {
    console.error("Admin get notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
