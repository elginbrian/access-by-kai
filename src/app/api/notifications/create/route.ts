import { NextRequest, NextResponse } from "next/server";
import { createLegacyServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { user_id, judul, pesan, tipe_notifikasi, priority_level = "NORMAL", reference_type, reference_id, action_url } = body;

    // Validate required fields
    if (!user_id || !judul || !pesan || !tipe_notifikasi) {
      return NextResponse.json(
        {
          error: "Missing required fields: user_id, judul, pesan, tipe_notifikasi",
        },
        { status: 400 }
      );
    }

    // Create notification
    const { data: newNotification, error: insertError } = await (supabase as any)
      .from("notifications")
      .insert({
        user_id,
        judul,
        pesan,
        tipe_notifikasi,
        priority_level,
        reference_type,
        reference_id,
        action_url,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating notification:", insertError);
      return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        data: newNotification,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
