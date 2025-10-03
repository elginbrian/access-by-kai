import { NextRequest, NextResponse } from "next/server";
import { createLegacyServerClient } from "@/lib/supabase";
import type { Notification, NotificationFilters } from "@/types/notification";

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

    // Get current user profile
    const { data: currentUser, error: userError } = await supabase
      .from("pengguna")
      .select("user_id")
      .eq("email", data.user.email || "")
      .single();

    if (userError || !currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const isRead = searchParams.get("isRead");
    const priority = searchParams.get("priority");
    const type = searchParams.get("type");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    // Build query
    let query = (supabase as any).from("notifications").select("*").eq("user_id", currentUser.user_id).order("created_at", { ascending: false });

    // Apply filters
    if (isRead !== null) {
      query = query.eq("is_read", isRead === "true");
    }
    if (priority) {
      query = query.eq("priority_level", priority);
    }
    if (type) {
      query = query.eq("tipe_notifikasi", type);
    }
    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }
    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: notifications, error: notifError } = await query;

    if (notifError) {
      console.error("Error fetching notifications:", notifError);
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = (supabase as any).from("notifications").select("*", { count: "exact", head: true }).eq("user_id", currentUser.user_id);

    // Apply same filters for count
    if (isRead !== null) {
      countQuery = countQuery.eq("is_read", isRead === "true");
    }
    if (priority) {
      countQuery = countQuery.eq("priority_level", priority);
    }
    if (type) {
      countQuery = countQuery.eq("tipe_notifikasi", type);
    }
    if (dateFrom) {
      countQuery = countQuery.gte("created_at", dateFrom);
    }
    if (dateTo) {
      countQuery = countQuery.lte("created_at", dateTo);
    }

    const { count } = await countQuery;

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
