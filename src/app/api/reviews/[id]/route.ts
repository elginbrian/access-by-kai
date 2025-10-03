import { NextRequest, NextResponse } from "next/server";
import { createLegacyServerClient } from "@/lib/supabase";

export async function PUT(
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

    const reviewId = params.id;
    const body = await request.json();
    const { penilaian, komentar } = body;

    // Validate rating if provided
    if (penilaian && (penilaian < 1 || penilaian > 5)) {
      return NextResponse.json({ 
        error: "Penilaian must be between 1 and 5" 
      }, { status: 400 });
    }

    // Update review
    const { data: updatedReview, error: updateError } = await supabase
      .from("ulasan")
      .update({ 
        penilaian,
        komentar,
        diperbarui_pada: new Date().toISOString()
      })
      .eq("ulasan_id", reviewId)
      .eq("pengguna_id", currentUser.user_id) // Ensure user owns the review
      .select()
      .single();

    if (updateError) {
      console.error("Error updating review:", updateError);
      return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }

    if (!updatedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedReview
    });

  } catch (error) {
    console.error("Update review error:", error);
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

    const reviewId = params.id;

    // Delete review
    const { error: deleteError } = await supabase
      .from("ulasan")
      .delete()
      .eq("ulasan_id", reviewId)
      .eq("pengguna_id", currentUser.user_id); // Ensure user owns the review

    if (deleteError) {
      console.error("Error deleting review:", deleteError);
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}