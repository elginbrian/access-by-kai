import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if user has any completed trips (status_tiket = 'COMPLETED')
    const { data: completedTripsCheck } = await supabase
      .from("pemesanan")
      .select(`
        pemesanan_id,
        pemesanan_segment (
          segment_id,
          tiket (
            tiket_id,
            status_tiket
          )
        )
      `)
      .eq("user_id", Number(userId))
      .eq("status_pemesanan", "TERKONFIRMASI");

    console.log("API Debug - Raw completed trips check:", completedTripsCheck);

    // Count completed trips
    let hasCompletedTrips = false;
    let completedCount = 0;

    if (completedTripsCheck) {
      completedTripsCheck.forEach(booking => {
        booking.pemesanan_segment?.forEach((segment: any) => {
          segment.tiket?.forEach((ticket: any) => {
            console.log("API Debug - Ticket status:", ticket.status_tiket);
            if (ticket.status_tiket === 'COMPLETED') {
              hasCompletedTrips = true;
              completedCount++;
            }
          });
        });
      });
    }

    console.log("API Debug - Has completed trips:", hasCompletedTrips, "Count:", completedCount);

    // If user has no completed trips, show empty state with explanation
    if (!hasCompletedTrips) {
      console.log("API Debug - No completed trips found for user:", userId);
      return NextResponse.json({ 
        recommendations: [],
        message: "Anda belum memiliki track record perjalanan. Lakukan perjalanan pertama Anda untuk mendapatkan rekomendasi personal!",
        isEmpty: true,
        isNewUser: true
      });
    }

    console.log("API Debug - User has completed trips, proceeding with recommendations");

    // Cek apakah user memiliki preferences yang sudah di-track
    const { data: userPreferences } = await supabase
      .from("user_booking_preferences")
      .select("*")
      .eq("user_id", Number(userId))
      .single();

    console.log("API Debug - User preferences:", userPreferences);

    // Jika user belum punya preferences meski sudah ada completed trips
    if (!userPreferences || userPreferences.total_bookings === 0) {
      return NextResponse.json({ 
        recommendations: [],
        message: "Sedang memproses data perjalanan Anda. Silakan coba lagi dalam beberapa saat.",
        isEmpty: true
      });
    }

    // Get route frequency specifically from completed trips only
    const { data: routeFrequency } = await supabase
      .from("pemesanan")
      .select(`
        pemesanan_segment (
          jadwal_id,
          jadwal (
            rute_id
          ),
          tiket (
            status_tiket
          )
        )
      `)
      .eq("user_id", Number(userId))
      .eq("status_pemesanan", "TERKONFIRMASI");

    console.log("API Debug - Route frequency data:", routeFrequency);

    // Calculate frequency only from completed trips
    const completedRouteFreq: { [key: number]: number } = {};
    
    if (routeFrequency) {
      routeFrequency.forEach(booking => {
        booking.pemesanan_segment?.forEach((segment: any) => {
          const hasCompletedTicket = segment.tiket?.some((ticket: any) => 
            ticket.status_tiket === 'COMPLETED'
          );
          
          if (hasCompletedTicket && segment.jadwal?.rute_id) {
            const ruteId = segment.jadwal.rute_id;
            completedRouteFreq[ruteId] = (completedRouteFreq[ruteId] || 0) + 1;
            console.log("API Debug - Found completed route:", ruteId, "New count:", completedRouteFreq[ruteId]);
          }
        });
      });
    }

    console.log("API Debug - Completed route frequencies:", completedRouteFreq);

    // Get top 3 most frequent routes from completed trips
    const topRoutes = Object.entries(completedRouteFreq)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([ruteId]) => Number(ruteId));

    console.log("API Debug - Top routes:", topRoutes);

    // Untuk setiap rute favorit berdasarkan completed trips, cari jadwal yang tersedia
    const recommendations = [];

    if (topRoutes.length > 0) {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      // Proses setiap rute dengan frequency tertinggi
      for (const ruteId of topRoutes) {
        const { data: availableSchedules } = await supabase
          .from("jadwal")
          .select(`
            jadwal_id,
            nomor_ka,
            tanggal_keberangkatan,
            waktu_berangkat_origin,
            waktu_tiba_destination,
            harga_base,
            status_jadwal,
            rute_id,
            master_kereta (
              nama_kereta,
              jenis_layanan
            ),
            perhentian_jadwal (
              stasiun_id,
              urutan,
              stasiun (
                stasiun_id,
                nama_stasiun,
                kode_stasiun
              )
            )
          `)
          .eq("rute_id", ruteId)
          .gte("tanggal_keberangkatan", today.toISOString().split('T')[0])
          .lte("tanggal_keberangkatan", nextWeek.toISOString().split('T')[0])
          .eq("status_jadwal", "SESUAI_JADWAL")
          .order("tanggal_keberangkatan", { ascending: true })
          .limit(1);

        if (availableSchedules && availableSchedules.length > 0) {
          const schedule = availableSchedules[0];
          
          // Cari stasiun asal dan tujuan yang paling cocok dengan preferensi user
          const stops = schedule.perhentian_jadwal || [];
          
          let originStop = null;
          let destinationStop = null;

          // Prioritaskan stasiun yang ada di frequent stations
          if (userPreferences.frequent_origin_station_ids) {
            originStop = stops.find((stop: any) => 
              userPreferences.frequent_origin_station_ids.includes(stop.stasiun_id)
            );
          }
          
          if (userPreferences.frequent_destination_station_ids) {
            destinationStop = stops.find((stop: any) => 
              userPreferences.frequent_destination_station_ids.includes(stop.stasiun_id) &&
              (!originStop || stop.urutan > originStop.urutan)
            );
          }

          // Fallback ke stasiun pertama dan terakhir jika tidak ada yang cocok
          if (!originStop && stops.length > 0) {
            originStop = stops[0];
          }
          if (!destinationStop && stops.length > 1) {
            destinationStop = stops[stops.length - 1];
          }

          if (originStop && destinationStop && originStop.urutan < destinationStop.urutan) {
            const routeFreq = completedRouteFreq[ruteId] || 0;
            
            const recommendation = {
              jadwalId: schedule.jadwal_id,
              trainName: schedule.master_kereta?.nama_kereta || "Unknown Train",
              trainCode: schedule.nomor_ka,
              trainClass: schedule.master_kereta?.jenis_layanan || "EKONOMI",
              fromCity: originStop.stasiun?.nama_stasiun || "Unknown",
              toCity: destinationStop.stasiun?.nama_stasiun || "Unknown",
              fromCityCode: originStop.stasiun?.kode_stasiun || "",
              toCityCode: destinationStop.stasiun?.kode_stasiun || "",
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
              frequency: routeFreq,
              badges: generateBadgesFromCompleted(schedule, routeFreq, userPreferences)
            };

            recommendations.push(recommendation);
          }
        }
      }
    }

    return NextResponse.json({ 
      recommendations: recommendations,
      message: recommendations.length > 0 
        ? `Berdasarkan ${completedCount} perjalanan selesai Anda` 
        : "Belum ada rekomendasi tersedia untuk rute favorit Anda",
      isEmpty: recommendations.length === 0
    });

  } catch (error) {
    console.error("Error in user-quick-booking API:", error);
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

function generateBadgesFromCompleted(schedule: any, frequency: number, userPreferences: any): Array<{text: string, variant: string}> {
  const badges = [];
  
  // Badge berdasarkan frekuensi completed trips
  if (frequency >= 5) {
    badges.push({ text: "Favorit Anda", variant: "premium" });
  } else if (frequency >= 3) {
    badges.push({ text: "Sering Dipilih", variant: "new-generation" });
  } else if (frequency >= 1) {
    badges.push({ text: "Pernah Selesai", variant: "promo" });
  }
  
  // Badge berdasarkan jenis layanan yang sesuai preferensi
  const serviceType = schedule.master_kereta?.jenis_layanan;
  if (userPreferences.preferred_service_types?.includes(serviceType)) {
    if (serviceType === "LUXURY") {
      badges.push({ text: "Luxury", variant: "premium" });
    } else if (serviceType === "EKSEKUTIF") {
      badges.push({ text: "Eksekutif", variant: "available" });
    } else {
      badges.push({ text: "Sesuai Preferensi", variant: "new-generation" });
    }
  }
  
  // Badge berdasarkan hari
  const departureDate = new Date(schedule.tanggal_keberangkatan);
  const today = new Date();
  const diffDays = Math.ceil((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 2) {
    badges.push({ text: "Segera", variant: "limited" });
  } else if (diffDays <= 7) {
    badges.push({ text: "Minggu Ini", variant: "holiday" });
  }
  
  return badges.slice(0, 3); // Maksimal 3 badges
}