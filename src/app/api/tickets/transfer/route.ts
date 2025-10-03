import { NextRequest, NextResponse } from "next/server";
import { createLegacyServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = createLegacyServerClient();
    
    // Extract all cookies and find the Supabase auth token
    const cookieString = request.headers.get('cookie') || '';
    let authToken = null;
    
    // Look for any cookie ending with -auth-token
    const authCookieMatch = cookieString.match(/([^;\s]+)-auth-token=([^;]+)/);
    if (authCookieMatch) {
      const cookieValue = authCookieMatch[2];
      
      // If cookie value starts with 'base64-', decode it
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
    
    // Fallback to standard cookie names
    if (!authToken) {
      authToken = request.cookies.get("sb-access-token")?.value || 
                  request.cookies.get("supabase-auth-token")?.value;
    }

    const { data, error } = await supabase.auth.getUser(authToken || undefined);
    if (error || !data.user) {
      console.error('Auth error:', error?.message);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = data.user;

    const body = await request.json();
    const { ticketId, targetNik, targetNama } = body;

    if (!ticketId || !targetNik || !targetNama) {
      return NextResponse.json(
        { error: "Ticket ID, NIK, dan nama target harus diisi" },
        { status: 400 }
      );
    }

    // Debug: Cek current user profile
    const { data: currentUserFromDb, error: currentUserFromDbError } = await supabase
      .from("pengguna")
      .select("user_id, nama_lengkap, nik, email")
      .eq("email", currentUser.email || "")
      .single();
    
    console.log('Current user from DB:', { currentUserFromDb, currentUserFromDbError });

    console.log('Current user email:', currentUser.email);
    console.log('Request body:', { ticketId, targetNik, targetNama });

    // Debug: list beberapa pengguna yang ada
    const { data: allUsers, error: allUsersError } = await supabase
      .from("pengguna")
      .select("user_id, nama_lengkap, nik, nomor_identitas, email")
      .limit(10);
    
    console.log('Sample users in database:', { allUsers, allUsersError });

    // 1. Akses data pengguna untuk mendapatkan user_id target
    console.log('Searching for user with NIK:', targetNik, 'and nama:', targetNama);
    
    let targetUser = null;
    let userError = null;

    // Coba cari dengan nomor_identitas dan nama (field yang sebenarnya)
    const { data: userWithIdentitas, error: identitasSearchError } = await supabase
      .from("pengguna")
      .select("user_id, nama_lengkap, nik, nomor_identitas")
      .eq("nomor_identitas", targetNik)
      .eq("nama_lengkap", targetNama)
      .single();

    if (userWithIdentitas && !identitasSearchError) {
      targetUser = userWithIdentitas;
    } else {
      // Fallback: coba cari hanya dengan nama
      const { data: userWithName, error: nameSearchError } = await supabase
        .from("pengguna")
        .select("user_id, nama_lengkap, nik, nomor_identitas")
        .eq("nama_lengkap", targetNama)
        .single();

      if (userWithName && !nameSearchError) {
        targetUser = userWithName;
        console.log('Found user by name only, nomor_identitas:', userWithName.nomor_identitas);
      } else {
        userError = nameSearchError;
      }
    }

    console.log('User search result:', { targetUser, userError });

    if (!targetUser) {
      console.error("Target user lookup error:", userError);
      return NextResponse.json(
        { error: "Pengguna dengan NIK dan nama tersebut tidak ditemukan" },
        { status: 404 }
      );
    }

    // 2. Akses data tiket untuk mendapatkan penumpang_id
    const { data: ticketData, error: ticketError } = await supabase
      .from("tiket")
      .select("tiket_id, penumpang_id")
      .eq("tiket_id", ticketId)
      .single();

    if (ticketError || !ticketData) {
      console.error("Ticket lookup error:", ticketError);
      return NextResponse.json(
        { error: "Tiket tidak ditemukan" },
        { status: 404 }
      );
    }

    // 3. Akses data penumpang untuk mendapatkan info dan verifikasi ownership
    const { data: penumpangData, error: penumpangError } = await supabase
      .from("penumpang")
      .select("user_id, nama_lengkap, tipe_identitas, nomor_identitas, tanggal_lahir, jenis_kelamin, kewarganegaraan, is_difabel, kebutuhan_khusus")
      .eq("penumpang_id", ticketData.penumpang_id)
      .single();

    if (penumpangError || !penumpangData) {
      console.error("Penumpang lookup error:", penumpangError);
      return NextResponse.json(
        { error: "Data penumpang tidak ditemukan" },
        { status: 404 }
      );
    }

    const currentOwnerId = penumpangData.user_id;
    const penumpangId = ticketData.penumpang_id;

    // Verify current user is the owner  
    const { data: currentUserProfile, error: currentUserError } = await supabase
      .from("pengguna")
      .select("user_id")
      .eq("email", currentUser.email || "")
      .single();

    if (currentUserError || !currentUserProfile || currentUserProfile.user_id !== currentOwnerId) {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin untuk mentransfer tiket ini" },
        { status: 403 }
      );
    }

    // 4. Check if target user is different from current owner
    if (targetUser.user_id === currentOwnerId) {
      return NextResponse.json(
        { error: "Tidak dapat mentransfer tiket ke diri sendiri" },
        { status: 400 }
      );
    }

    // 4. Buat penumpang baru untuk user target (agar tidak mengubah tiket lain)
    const { data: newPenumpang, error: createPenumpangError } = await supabase
      .from("penumpang")
      .insert({
        user_id: targetUser.user_id,
        nama_lengkap: targetUser.nama_lengkap,
        tipe_identitas: penumpangData.tipe_identitas,
        nomor_identitas: targetUser.nomor_identitas || targetUser.nik || penumpangData.nomor_identitas,
        tanggal_lahir: penumpangData.tanggal_lahir,
        jenis_kelamin: penumpangData.jenis_kelamin,
        kewarganegaraan: penumpangData.kewarganegaraan,
        is_difabel: penumpangData.is_difabel,
        kebutuhan_khusus: penumpangData.kebutuhan_khusus,
      })
      .select("penumpang_id")
      .single();

    if (createPenumpangError || !newPenumpang) {
      console.error("Create penumpang error:", createPenumpangError);
      return NextResponse.json(
        { error: "Gagal membuat data penumpang baru" },
        { status: 500 }
      );
    }

    // 5. Update tiket untuk mengarah ke penumpang baru (hanya tiket yang ditransfer)
    const { error: transferError } = await supabase
      .from("tiket")
      .update({ penumpang_id: newPenumpang.penumpang_id })
      .eq("tiket_id", ticketId);

    if (transferError) {
      console.error("Transfer error:", transferError);
      return NextResponse.json(
        { error: "Gagal mentransfer tiket. Silakan coba lagi." },
        { status: 500 }
      );
    }

    // 6. Create notification for the ticket recipient
    try {
      await supabase
        .from("notifications")
        .insert({
          user_id: targetUser.user_id,
          tipe_notifikasi: "TICKET_TRANSFER",
          judul: "Tiket Diterima",
          pesan: `Anda telah menerima tiket dari ${currentUserFromDb?.nama_lengkap || 'pengguna lain'}. Silakan cek tiket Anda di halaman "Tiket Saya".`,
          priority_level: "NORMAL",
          reference_type: "TICKET",
          reference_id: ticketId,
          is_read: false,
          created_at: new Date().toISOString()
        });

      // Create notification for the sender
      await supabase
        .from("notifications")
        .insert({
          user_id: currentUserProfile.user_id,
          tipe_notifikasi: "TICKET_TRANSFER",
          judul: "Transfer Tiket Berhasil",
          pesan: `Tiket Anda telah berhasil ditransfer ke ${targetUser.nama_lengkap}.`,
          priority_level: "LOW",
          reference_type: "TICKET",
          reference_id: ticketId,
          is_read: false,
          created_at: new Date().toISOString()
        });

      // Create review request notification for the recipient after some time
      await supabase
        .from("notifications")
        .insert({
          user_id: targetUser.user_id,
          tipe_notifikasi: "REVIEW_REQUEST",
          judul: "Bagikan Pengalaman Anda",
          pesan: "Bagaimana pengalaman Anda dengan layanan transfer tiket kami? Berikan ulasan untuk membantu kami meningkatkan kualitas layanan.",
          priority_level: "LOW",
          reference_type: "REVIEW",
          action_url: "/reviews/create?service=BOOKING_TIKET",
          is_read: false,
          created_at: new Date().toISOString()
        });
    } catch (notificationError) {
      console.warn("Failed to create notifications:", notificationError);
      // Don't fail the transfer if notification creation fails
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: `Tiket berhasil ditransfer ke ${targetUser.nama_lengkap}`,
      targetUser: {
        nama: targetUser.nama_lengkap,
        nik: targetUser.nomor_identitas || targetUser.nik
      }
    });

  } catch (error) {
    console.error("Transfer ticket error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}