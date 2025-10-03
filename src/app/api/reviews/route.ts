import { NextRequest, NextResponse } from "next/server";
import { createLegacyServerClient } from "@/lib/supabase";
import type { Review, ReviewFilters, PaginatedReviews } from "@/types/notification";

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const jenis_layanan = searchParams.get('jenis_layanan');
    const penilaian = searchParams.get('penilaian');
    const platform = searchParams.get('platform');
    const pengguna_id = searchParams.get('pengguna_id'); // For user's own reviews

    // Build query
    let query = supabase
      .from("ulasan")
      .select(`
        ulasan_id,
        pengguna_id,
        jenis_layanan,
        penilaian,
        komentar,
        platform,
        dibuat_pada,
        diperbarui_pada,
        pengguna:pengguna_id(nama_lengkap, foto_profil_url)
      `, { count: 'exact' })
      .order("dibuat_pada", { ascending: false });

    // Apply filters
    if (jenis_layanan) {
      query = query.eq("jenis_layanan", jenis_layanan);
    }
    if (penilaian) {
      query = query.eq("penilaian", parseInt(penilaian));
    }
    if (platform) {
      query = query.eq("platform", platform);
    }
    if (pengguna_id) {
      query = query.eq("pengguna_id", parseInt(pengguna_id));
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: reviews, error: reviewError, count } = await query;

    if (reviewError) {
      console.error("Error fetching reviews:", reviewError);
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }

    // Calculate average rating
    const { data: avgData } = await supabase
      .from("ulasan")
      .select("penilaian")
      .eq("jenis_layanan", jenis_layanan || "")
      .is("jenis_layanan", jenis_layanan ? null : "not.null");

    const averageRating = avgData && avgData.length > 0 
      ? avgData.reduce((sum, review) => sum + review.penilaian, 0) / avgData.length 
      : 0;

    const totalPages = Math.ceil((count || 0) / limit);

    const response: PaginatedReviews = {
      data: reviews || [],
      total: count || 0,
      page,
      limit,
      totalPages,
      averageRating: Math.round(averageRating * 10) / 10
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Review fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { 
      jenis_layanan, 
      penilaian, 
      komentar, 
      platform = 'UMUM'
    } = body;

    // Validate required fields
    if (!jenis_layanan || !penilaian || !komentar) {
      return NextResponse.json({ 
        error: "Missing required fields: jenis_layanan, penilaian, komentar" 
      }, { status: 400 });
    }

    // Validate rating range
    if (penilaian < 1 || penilaian > 5) {
      return NextResponse.json({ 
        error: "Penilaian must be between 1 and 5" 
      }, { status: 400 });
    }

    // Create review
    const { data: newReview, error: insertError } = await supabase
      .from("ulasan")
      .insert({
        pengguna_id: currentUser.user_id,
        jenis_layanan,
        penilaian,
        komentar,
        platform,
        dibuat_pada: new Date().toISOString(),
        diperbarui_pada: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating review:", insertError);
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }

    // Create notification for successful review submission
    try {
      await supabase
        .from("notifications")
        .insert({
          user_id: currentUser.user_id,
          tipe_notifikasi: 'SYSTEM_UPDATE',
          judul: 'Ulasan Berhasil Dikirim',
          pesan: `Terima kasih! Ulasan Anda untuk layanan ${jenis_layanan} telah berhasil dikirim dan akan membantu kami meningkatkan kualitas layanan.`,
          priority_level: 'LOW',
          reference_type: 'REVIEW',
          reference_id: newReview.ulasan_id,
          is_read: false,
          created_at: new Date().toISOString()
        });
    } catch (notificationError) {
      console.warn("Failed to create review notification:", notificationError);
    }

    return NextResponse.json({
      success: true,
      data: newReview
    }, { status: 201 });

  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}