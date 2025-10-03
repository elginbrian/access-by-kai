import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase";
import type { StationFacility, FacilityUnit, FacilityWithUnits, FacilityBooking, BookingFormData } from "@/types/facilities";

const supabase = createClient();

export function useStationFacilities(stationId?: number) {
  return useQuery<FacilityWithUnits[], Error>({
    queryKey: ["stationFacilities", stationId],
    queryFn: async (): Promise<FacilityWithUnits[]> => {
      if (!stationId) throw new Error("Station ID is required");

      // Query facilities with their units
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from("station_facilities")
        .select(`
          *,
          facility_units(*)
        `)
        .eq("stasiun_id", stationId)
        .eq("is_tersedia", true)
        .order("nama_fasilitas");

      if (facilitiesError) throw facilitiesError;

      // Transform the data to match our types
      const facilities: FacilityWithUnits[] = (facilitiesData || []).map((facility: any) => ({
        ...facility,
        units: facility.facility_units || [],
      }));

      return facilities;
    },
    enabled: !!stationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFacilityDetail(facilityId?: number) {
  return useQuery<FacilityWithUnits | null, Error>({
    queryKey: ["facilityDetail", facilityId],
    queryFn: async (): Promise<FacilityWithUnits | null> => {
      if (!facilityId) return null;

      const { data: facilityData, error } = await supabase
        .from("station_facilities")
        .select(`
          *,
          facility_units(*),
          stasiun!inner(
            stasiun_id,
            kode_stasiun,
            nama_stasiun,
            kota,
            provinsi
          )
        `)
        .eq("facility_id", facilityId)
        .single();

      if (error) throw error;
      if (!facilityData) return null;

      return {
        ...facilityData,
        units: facilityData.facility_units || [],
        station: facilityData.stasiun,
      };
    },
    enabled: !!facilityId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAvailableUnits(facilityId?: number, startTime?: string, endTime?: string) {
  return useQuery<FacilityUnit[], Error>({
    queryKey: ["availableUnits", facilityId, startTime, endTime],
    queryFn: async (): Promise<FacilityUnit[]> => {
      if (!facilityId || !startTime || !endTime) throw new Error("Missing required parameters");

      // Get all units for the facility
      const { data: unitsData, error: unitsError } = await supabase
        .from("facility_units")
        .select("*")
        .eq("facility_id", facilityId)
        .eq("status_unit", "TERSEDIA");

      if (unitsError) throw unitsError;

      // Check for booking conflicts
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("facility_bookings")
        .select("unit_id")
        .eq("facility_id", facilityId)
        .in("status_booking", ["DIBAYAR", "SEDANG_DIGUNAKAN"])
        .or(`and(waktu_mulai_booking.lte.${endTime},waktu_selesai_booking.gte.${startTime})`);

      if (bookingsError) throw bookingsError;

      // Filter out booked units
      const bookedUnitIds = new Set((bookingsData || []).map((b: any) => b.unit_id));
      const availableUnits = (unitsData || []).filter((unit: any) => !bookedUnitIds.has(unit.unit_id));

      return availableUnits;
    },
    enabled: !!facilityId && !!startTime && !!endTime,
    staleTime: 1 * 60 * 1000, // 1 minute for availability data
  });
}

export function useUserBookings(userId?: number) {
  return useQuery<FacilityBooking[], Error>({
    queryKey: ["userFacilityBookings", userId],
    queryFn: async (): Promise<FacilityBooking[]> => {
      if (!userId) throw new Error("User ID is required");

      const { data, error } = await supabase
        .from("facility_bookings")
        .select(`
          *,
          station_facilities!inner(
            nama_fasilitas,
            stasiun!inner(
              nama_stasiun,
              kota
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFacilityBooking() {
  const queryClient = useQueryClient();

  return useMutation<FacilityBooking, Error, BookingFormData & { userId: number }>({
    mutationFn: async (bookingData): Promise<FacilityBooking> => {
      // Generate booking code
      const bookingCode = `SL${Date.now().toString().slice(-8)}`;
      
      // Calculate pricing
      const { data: facilityData } = await supabase
        .from("station_facilities")
        .select("*")
        .eq("facility_id", bookingData.facilityId)
        .single();

      if (!facilityData) throw new Error("Facility not found");

      let unitPrice = 0;
      if (bookingData.unitId) {
        const { data: unitData } = await supabase
          .from("facility_units")
          .select("harga_per_jam")
          .eq("unit_id", bookingData.unitId)
          .single();
        
        unitPrice = unitData?.harga_per_jam || 0;
      }

      const hourlyRate = unitPrice;
      const hours = Math.ceil(bookingData.duration / 60);
      
      let showerPrice = 0;
      let lockerPrice = 0;
      
      if (bookingData.serviceType === "SHOWER_ONLY" || bookingData.serviceType === "SHOWER_AND_LOCKER") {
        showerPrice = hourlyRate * hours;
      }
      if (bookingData.serviceType === "LOCKER_ONLY" || bookingData.serviceType === "SHOWER_AND_LOCKER") {
        lockerPrice = hourlyRate * hours * (bookingData.serviceType === "SHOWER_AND_LOCKER" ? 0.5 : 1);
      }

      const adminFee = 5000; // Fixed admin fee
      const total = showerPrice + lockerPrice + adminFee;

      const endTime = new Date(new Date(bookingData.startTime).getTime() + bookingData.duration * 60000).toISOString();

      const bookingPayload = {
        kode_booking: bookingCode,
        user_id: bookingData.userId,
        facility_id: bookingData.facilityId,
        unit_id: bookingData.unitId,
        tipe_layanan: bookingData.serviceType,
        durasi_penggunaan_menit: bookingData.duration,
        waktu_mulai_booking: bookingData.startTime,
        waktu_selesai_booking: endTime,
        jumlah_barang: bookingData.itemCount || 0,
        deskripsi_barang: bookingData.itemDescription,
        estimasi_berat_kg: bookingData.estimatedWeight,
        harga_shower: showerPrice,
        harga_locker: lockerPrice,
        biaya_admin: adminFee,
        total_bayar: total,
        status_booking: "MENUNGGU_PEMBAYARAN" as const,
        catatan_khusus: bookingData.specialNotes,
      };

      const { data, error } = await supabase
        .from("facility_bookings")
        .insert(bookingPayload)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userFacilityBookings"] });
      queryClient.invalidateQueries({ queryKey: ["availableUnits"] });
    },
  });
}

export function useBookingActions() {
  const queryClient = useQueryClient();

  const cancelBooking = useMutation<void, Error, number>({
    mutationFn: async (bookingId: number): Promise<void> => {
      const { error } = await supabase
        .from("facility_bookings")
        .update({ status_booking: "DIBATALKAN" })
        .eq("booking_id", bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userFacilityBookings"] });
      queryClient.invalidateQueries({ queryKey: ["availableUnits"] });
    },
  });

  return {
    cancelBooking,
  };
}