import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log("Debug API - Checking user:", userId);

    // 1. Check all bookings for this user
    const { data: allBookings, error: bookingError } = await supabase
      .from("pemesanan")
      .select(`
        pemesanan_id,
        status_pemesanan,
        user_id,
        pemesanan_segment (
          segment_id,
          tiket (
            tiket_id,
            status_tiket
          )
        )
      `)
      .eq("user_id", userId);

    console.log("Debug API - All bookings:", allBookings);
    console.log("Debug API - Booking error:", bookingError);

    // 2. Check user preferences table
    const { data: preferences, error: prefError } = await supabase
      .from("user_booking_preferences")
      .select("*")
      .eq("user_id", userId);

    console.log("Debug API - Preferences:", preferences);
    console.log("Debug API - Preferences error:", prefError);

    // 3. Manual check for completed tickets
    let completedTickets = [];
    if (allBookings) {
      allBookings.forEach(booking => {
        booking.pemesanan_segment?.forEach((segment: any) => {
          segment.tiket?.forEach((ticket: any) => {
            if (ticket.status_tiket === 'COMPLETED') {
              completedTickets.push({
                booking_id: booking.pemesanan_id,
                segment_id: segment.segment_id,
                ticket_id: ticket.tiket_id,
                status: ticket.status_tiket
              });
            }
          });
        });
      });
    }

    console.log("Debug API - Completed tickets:", completedTickets);

    return NextResponse.json({
      userId: userId,
      allBookings,
      preferences,
      completedTickets,
      hasCompletedTickets: completedTickets.length > 0,
      completedCount: completedTickets.length,
      errors: {
        bookingError,
        prefError
      }
    });

  } catch (error) {
    console.error("Debug API Error:", error);
    return NextResponse.json(
      { error: "Debug API error", details: error },
      { status: 500 }
    );
  }
}