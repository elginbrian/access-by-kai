import { NextRequest, NextResponse } from "next/server";
import { createLegacyServerClient } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createLegacyServerClient();
    
    // Extract auth token
    const cookieString = request.headers.get('cookie') || '';
    let authToken = null;
    
    const authCookieMatch = cookieString.match(/([^;\s]+)-auth-token=([^;]+)/);
    if (authCookieMatch) {
      const cookieValue = authCookieMatch[2];
      if (cookieValue.startsWith('base64-')) {
        try {
          const decodedData = atob(cookieValue.substring(7));
          const tokenData = JSON.parse(decodedData);
          authToken = tokenData.access_token;
        } catch (e) {
          console.warn('Failed to decode auth token:', e);
        }
      } else {
        authToken = cookieValue;
      }
    }

    if (!authToken) {
      authToken = request.cookies.get("sb-access-token")?.value || 
                  request.cookies.get("supabase-auth-token")?.value;
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

    const notificationId = params.id;
    const body = await request.json();
    const { is_read } = body;

    // Update notification
    const { data: updatedNotification, error: updateError } = await supabase
      .from("notifications")
      .update({ 
        is_read,
        read_at: is_read ? new Date().toISOString() : null
      })
      .eq("notification_id", notificationId)
      .eq("user_id", currentUser.user_id) // Ensure user owns the notification
      .select()
      .single();

    if (updateError) {
      console.error("Error updating notification:", updateError);
      return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
    }

    if (!updatedNotification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedNotification
    });

  } catch (error) {
    console.error("Update notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createLegacyServerClient();
    
    // Extract auth token (same logic as above)
    const cookieString = request.headers.get('cookie') || '';
    let authToken = null;
    
    const authCookieMatch = cookieString.match(/([^;\s]+)-auth-token=([^;]+)/);
    if (authCookieMatch) {
      const cookieValue = authCookieMatch[2];
      if (cookieValue.startsWith('base64-')) {
        try {
          const decodedData = atob(cookieValue.substring(7));
          const tokenData = JSON.parse(decodedData);
          authToken = tokenData.access_token;
        } catch (e) {
          console.warn('Failed to decode auth token:', e);
        }
      } else {
        authToken = cookieValue;
      }
    }

    if (!authToken) {
      authToken = request.cookies.get("sb-access-token")?.value || 
                  request.cookies.get("supabase-auth-token")?.value;
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

    const notificationId = params.id;

    // Delete notification
    const { error: deleteError } = await supabase
      .from("notifications")
      .delete()
      .eq("notification_id", notificationId)
      .eq("user_id", currentUser.user_id); // Ensure user owns the notification

    if (deleteError) {
      console.error("Error deleting notification:", deleteError);
      return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully"
    });

  } catch (error) {
    console.error("Delete notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}