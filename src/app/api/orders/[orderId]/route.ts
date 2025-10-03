import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

interface RouteParams {
  params: {
    orderId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { orderId } = params;
    console.log("API: Received orderId:", orderId);

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log("API: Auth user:", user?.id, "Error:", authError?.message);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required", details: authError?.message },
        { status: 401 }
      );
    }

    // Extract order ID from various formats (ORDER-timestamp-random, etc.)
    const orderIdPattern = orderId.replace('ORDER-', '');
    
    console.log("API: Search patterns:", { orderId, orderIdPattern, userId: user.id });
    
    // Try alternative search without user restriction first
    console.log("API: Trying search without user restriction...");
    const { data: allOrders, error: allOrdersError } = await supabase
      .from('pemesanan')
      .select('pemesanan_id, kode_pemesanan, user_id')
      .or(`kode_pemesanan.eq.${orderId},kode_pemesanan.ilike.%${orderIdPattern}%`)
      .limit(5);
    
    console.log("API: All matching orders:", allOrders, allOrdersError);

    // Query pemesanan table for this order and get related tickets
    const { data: orderData, error: orderError } = await supabase
      .from('pemesanan')
      .select(`
        pemesanan_id,
        kode_pemesanan,
        user_id,
        status_pemesanan,
        total_bayar,
        waktu_pembuatan,
        pemesanan_segment (
          segment_id,
          jadwal_id,
          jadwal:jadwal_id (
            jadwal_id,
            waktu_berangkat,
            waktu_sampai,
            kelas_kereta,
            harga_tiket,
            rute:rute_id (
              rute_id,
              stasiun_asal:stasiun_asal_id (
                nama_stasiun,
                kode_stasiun,
                kota
              ),
              stasiun_tujuan:stasiun_tujuan_id (
                nama_stasiun,
                kode_stasiun,
                kota
              )
            )
          )
        )
      `)
      .or(`kode_pemesanan.eq.${orderId},kode_pemesanan.ilike.%${orderIdPattern}%`)
      .eq('user_id', parseInt(user.id))
      .single();

    console.log("API: Order query result:", { orderData, orderError });

    if (orderError) {
      console.error("Order query error:", orderError);
      return NextResponse.json(
        { error: "Order not found", details: orderError.message },
        { status: 404 }
      );
    }

    if (!orderData) {
      return NextResponse.json(
        { error: "Order not found or access denied" },
        { status: 404 }
      );
    }

    // Get tickets for this order through segments
    const segmentIds = orderData.pemesanan_segment?.map((seg: any) => seg.segment_id) || [];
    
    console.log("API: Segment IDs:", segmentIds);
    
    let tickets: any[] = [];
    if (segmentIds.length > 0) {
      const { data: ticketData, error: ticketError } = await supabase
        .from('tiket')
        .select(`
          tiket_id,
          kode_tiket,
          status_tiket,
          harga_tiket,
          segment_id,
          penumpang:penumpang_id (
            penumpang_id,
            nama_lengkap,
            nomor_identitas
          )
        `)
        .in('segment_id', segmentIds);

      console.log("API: Ticket query result:", { ticketData, ticketError });

      if (!ticketError && ticketData) {
        tickets = ticketData;
      }
    }

    const result = {
      pemesanan_id: orderData.pemesanan_id,
      kode_pemesanan: orderData.kode_pemesanan,
      user_id: orderData.user_id,
      status_pemesanan: orderData.status_pemesanan,
      total_bayar: orderData.total_bayar,
      waktu_pembuatan: orderData.waktu_pembuatan,
      segments: orderData.pemesanan_segment,
      tickets: tickets,
      // Return first ticket ID for navigation
      first_ticket_id: tickets.length > 0 ? tickets[0].tiket_id : null
    };

    console.log("API: Final result:", result);

    // Return order data with tickets
    return NextResponse.json(result);

  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}