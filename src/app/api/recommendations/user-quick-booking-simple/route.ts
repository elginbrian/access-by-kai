import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userProfileId = searchParams.get("userId"); // This is the numeric user_id from profile

    if (!userProfileId) {
      return NextResponse.json({ error: "User profile ID is required" }, { status: 400 });
    }

    const numericUserId = Number(userProfileId);
    if (isNaN(numericUserId)) {
      return NextResponse.json({ error: "Invalid user profile ID" }, { status: 400 });
    }

    console.log("Simple API - Checking user profile ID:", numericUserId);

    // Get completed tickets using simplified query
    const { data: completedTickets, error: ticketError } = await supabase
      .from("tiket")
      .select(`
        tiket_id,
        status_tiket,
        pemesanan_segment!inner(
          jadwal_id,
          jadwal!inner(
            rute_id,
            master_kereta(nama_kereta, jenis_layanan)
          )
        ),
        penumpang!inner(user_id)
      `)
      .eq("penumpang.user_id", numericUserId)
      .eq("status_tiket", "COMPLETED")
      .limit(50);

    if (ticketError) {
      console.error("Simple API - Ticket error:", ticketError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    console.log("Simple API - Found completed tickets:", completedTickets?.length || 0);

    if (!completedTickets || completedTickets.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: "Anda belum memiliki track record perjalanan. Lakukan perjalanan pertama Anda untuk mendapatkan rekomendasi personal!",
        isEmpty: true,
        isNewUser: true
      });
    }

    // Count route frequency from completed tickets
    const routeFreq: { [key: number]: { count: number } } = {};
    
    completedTickets.forEach(ticket => {
      const ruteId = ticket.pemesanan_segment?.jadwal?.rute_id;
      if (ruteId) {
        if (!routeFreq[ruteId]) {
          routeFreq[ruteId] = { count: 0 };
        }
        routeFreq[ruteId].count++;
      }
    });

    console.log("Simple API - Route frequencies:", Object.keys(routeFreq).map(id => ({ id, count: routeFreq[Number(id)].count })));

    // Get top 3 routes
    const topRoutes = Object.entries(routeFreq)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 3);

    console.log("Simple API - Top routes:", topRoutes.map(([id, data]) => ({ id, count: data.count })));

    // Find available schedules for top routes (next 7 days) - simplified query
    const recommendations = [];
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    for (const [ruteId, routeData] of topRoutes) {
      const { data: availableSchedules } = await supabase
        .from("jadwal")
        .select(`
          jadwal_id,
          nomor_ka,
          tanggal_keberangkatan,
          waktu_berangkat_origin,
          waktu_tiba_destination,
          harga_base,
          master_kereta (nama_kereta, jenis_layanan)
        `)
        .eq("rute_id", Number(ruteId))
        .gte("tanggal_keberangkatan", today.toISOString().split('T')[0])
        .lte("tanggal_keberangkatan", nextWeek.toISOString().split('T')[0])
        .eq("status_jadwal", "SESUAI_JADWAL")
        .order("tanggal_keberangkatan", { ascending: true })
        .limit(1);

      if (availableSchedules && availableSchedules.length > 0) {
        const schedule = availableSchedules[0];
        
        const recommendation = {
          jadwalId: schedule.jadwal_id,
          trainName: schedule.master_kereta?.nama_kereta || "Unknown Train",
          trainCode: schedule.nomor_ka,
          trainClass: schedule.master_kereta?.jenis_layanan || "EKONOMI",
          fromCity: "Jakarta", // Simplified - use default cities
          toCity: "Surabaya",
          fromCityCode: "GMR",
          toCityCode: "SBY", 
          departureTime: new Date(schedule.waktu_berangkat_origin).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
          }),
          arrivalTime: new Date(schedule.waktu_tiba_destination).toLocaleTimeString("id-ID", {
            hour: "2-digit", 
            minute: "2-digit"
          }),
          duration: calculateDuration(schedule.waktu_berangkat_origin, schedule.waktu_tiba_destination),
          date: new Date(schedule.tanggal_keberangkatan).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short"
          }),
          price: schedule.harga_base,
          frequency: routeData.count,
          badges: generateSimpleBadges(routeData.count, schedule.master_kereta?.jenis_layanan)
        };

        recommendations.push(recommendation);
      }
    }

    console.log("Simple API - Final recommendations:", recommendations.length);

    return NextResponse.json({
      recommendations: recommendations,
      message: recommendations.length > 0 
        ? `Berdasarkan ${completedTickets.length} perjalanan selesai Anda` 
        : "Belum ada jadwal tersedia untuk rute favorit Anda",
      isEmpty: recommendations.length === 0
    });

  } catch (error) {
    console.error("Simple API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function calculateDuration(start: string, end: string): string {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const diffMs = endTime.getTime() - startTime.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${diffHours}h ${diffMinutes}m`;
}

function generateSimpleBadges(frequency: number, serviceType: string): Array<{text: string, variant: 'holiday' | 'new-generation' | 'promo' | 'premium' | 'discount' | 'available' | 'limited'}> {
  const badges = [];
  
  if (frequency >= 3) {
    badges.push({ text: "Favorit Anda", variant: "premium" as const });
  } else if (frequency >= 2) {
    badges.push({ text: "Sering Dipilih", variant: "new-generation" as const });
  } else {
    badges.push({ text: "Pernah Selesai", variant: "promo" as const });
  }
  
  if (serviceType === "LUXURY") {
    badges.push({ text: "Luxury", variant: "premium" as const });
  } else if (serviceType === "EKSEKUTIF") {
    badges.push({ text: "Eksekutif", variant: "available" as const });
  }
  
  return badges;
}