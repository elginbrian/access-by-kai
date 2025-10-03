import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase";

const SeatChangeRequestSchema = z.object({
  ticketId: z.string(),
  newSeatId: z.string(),
  userId: z.number(),
});

const SeatChangePaymentSchema = z.object({
  changeRequestId: z.number(),
  paymentMethod: z.string().optional().default("MIDTRANS"),
});

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Seat change API is accessible",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== SEAT CHANGE API CALLED ===");

    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const { action } = body;

    if (!action) {
      console.log("Missing action in request body");
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    console.log("Processing action:", action);

    switch (action) {
      case "validate":
        return await handleValidateSeatChange(body);
      case "create_payment":
        return await handleCreatePayment(body);
      case "complete":
        return await handleCompleteSeatChange(body);
      case "cancel":
        return await handleCancelSeatChange(body);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("=== API ERROR ===");
    console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("Error object:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handler functions
async function handleValidateSeatChange(body: any) {
  try {
    console.log("=== VALIDATE SEAT CHANGE ===");
    const supabase = createClient() as any;
    const { ticketId, newSeatId, userId } = body;

    console.log("Input data:", { ticketId, newSeatId, userId });

    // Validate input
    if (!ticketId || !newSeatId || !userId) {
      console.error("Missing required fields:", { ticketId, newSeatId, userId });
      return NextResponse.json(
        {
          success: false,
          error: "Data tidak lengkap",
        },
        { status: 400 }
      );
    }

    // 1. Find the ticket by kode_tiket (ticket ID)
    const { data: ticket, error: ticketError } = await supabase
      .from("tiket")
      .select(
        `
        tiket_id,
        kode_tiket,
        harga_tiket,
        jadwal_kursi_id,
        jadwal_kursi!inner(
          jadwal_kursi_id,
          kode_kursi,
          harga_kursi,
          jadwal_gerbong_id
        )
      `
      )
      .eq("kode_tiket", ticketId)
      .single();

    if (ticketError) {
      console.error("Ticket fetch error:", ticketError);
      return NextResponse.json(
        {
          success: false,
          error: "Error saat mengambil data tiket",
          details: ticketError,
        },
        { status: 500 }
      );
    }

    if (!ticket) {
      console.error("Ticket not found for code:", ticketId);
      return NextResponse.json(
        {
          success: false,
          error: "Tiket tidak ditemukan",
        },
        { status: 404 }
      );
    }

    console.log("Found ticket:", ticket);

    // 2. Check if new seat is available
    const { data: newSeat, error: seatError } = await supabase.from("jadwal_kursi").select("*").eq("kode_kursi", newSeatId).eq("jadwal_gerbong_id", ticket.jadwal_kursi.jadwal_gerbong_id).eq("status_inventaris", "TERSEDIA").single();

    if (seatError) {
      console.error("Seat fetch error:", seatError);
      return NextResponse.json(
        {
          success: false,
          error: "Error saat mengecek ketersediaan kursi",
          details: seatError,
        },
        { status: 500 }
      );
    }

    if (!newSeat) {
      console.error("Seat not available - newSeatId:", newSeatId, "gerbong:", ticket.jadwal_kursi.jadwal_gerbong_id);
      return NextResponse.json(
        {
          success: false,
          error: "Kursi yang dipilih tidak tersedia",
        },
        { status: 400 }
      );
    }

    console.log("Found available seat:", newSeat);

    // 3. Calculate fees
    const originalPrice = Number(ticket.harga_tiket);
    const changeFee = Math.round(originalPrice * 0.15);
    const adminFee = 5000;
    const totalAmount = changeFee + adminFee;

    // 4. Create seat change request record
    const { data: changeRequest, error: changeError } = await supabase
      .from("permintaan_perpindahan_kursi")
      .insert({
        tiket_asal_id: ticket.tiket_id,
        jadwal_kursi_tujuan_id: newSeat.jadwal_kursi_id,
        pemohon_user_id: userId,
        tipe_perpindahan: "MOVE",
        alasan: "Perubahan kursi penumpang",
        biaya_perpindahan: changeFee,
        status_perpindahan: "MENUNGGU_PERSETUJUAN",
      })
      .select()
      .single();

    if (changeError || !changeRequest) {
      console.error("Failed to create change request:", changeError);
      return NextResponse.json(
        {
          success: false,
          error: "Gagal membuat permintaan perpindahan kursi",
        },
        { status: 500 }
      );
    }

    console.log("Created change request:", changeRequest);

    return NextResponse.json({
      success: true,
      changeRequestId: changeRequest.perpindahan_id,
      ticketId,
      currentSeat: ticket.jadwal_kursi.kode_kursi,
      newSeat: newSeat.kode_kursi,
      originalPrice,
      changeFee,
      adminFee,
      totalAmount,
    });
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat validasi",
      },
      { status: 500 }
    );
  }
}

async function handleCreatePayment(body: any) {
  try {
    console.log("=== CREATE PAYMENT ===");
    const supabase = createClient() as any;
    const { changeRequestId } = body;

    console.log("Input data:", { changeRequestId });

    // Validate input
    if (!changeRequestId) {
      console.error("Missing changeRequestId");
      return NextResponse.json(
        {
          success: false,
          error: "ID permintaan perpindahan tidak ditemukan",
        },
        { status: 400 }
      );
    }
    // Get change request details
    console.log("Fetching change request...");
    const { data: changeRequest, error: changeError } = await supabase.from("permintaan_perpindahan_kursi").select("*").eq("perpindahan_id", changeRequestId).single();

    if (changeError) {
      console.error("Change request fetch error:", changeError);
      return NextResponse.json(
        {
          success: false,
          error: "Error saat mengambil data permintaan perpindahan",
          details: changeError,
        },
        { status: 500 }
      );
    }

    if (!changeRequest) {
      console.error("Change request not found:", changeRequestId);
      return NextResponse.json(
        {
          success: false,
          error: "Permintaan perpindahan tidak ditemukan",
        },
        { status: 404 }
      );
    }

    console.log("Found change request:", changeRequest);

    // Calculate total amount
    const totalAmount = Number(changeRequest.biaya_perpindahan) + 5000;
    const orderId = `SEAT_CHANGE-${changeRequestId}-${Date.now()}`;

    console.log("Creating payment record...");
    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .insert({
        pemesanan_id: -changeRequestId,
        jumlah: totalAmount,
        metode_pembayaran: "DIRECT",
        status_pembayaran: "MENUNGGU",
        id_transaksi_eksternal: orderId,
        reference_number: `SEAT_CHANGE_${changeRequestId}`,
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Payment creation error:", paymentError);
      return NextResponse.json(
        {
          success: false,
          error: "Error saat membuat pembayaran",
          details: paymentError,
        },
        { status: 500 }
      );
    }

    if (!payment) {
      console.error("Payment creation failed - no data returned");
      return NextResponse.json(
        {
          success: false,
          error: "Gagal membuat pembayaran",
        },
        { status: 500 }
      );
    }

    console.log("Payment created successfully:", payment);

    return NextResponse.json({
      success: true,
      paymentId: payment.pembayaran_id,
      orderId,
      amount: totalAmount,
      changeRequestId,
    });
  } catch (error) {
    console.error("=== CREATE PAYMENT ERROR ===");
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during payment creation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function handleCompleteSeatChange(body: any) {
  try {
    console.log("=== COMPLETE SEAT CHANGE ===");
    const supabase = createClient() as any;
    const { changeRequestId } = body;

    console.log("Input data:", { changeRequestId });

    // Validate input
    if (!changeRequestId) {
      console.error("Missing changeRequestId");
      return NextResponse.json(
        {
          success: false,
          error: "ID permintaan perpindahan tidak ditemukan",
        },
        { status: 400 }
      );
    }

    console.log("Completing seat change for request ID:", changeRequestId);

    // Get change request details
    const { data: changeRequest, error: changeError } = await supabase
      .from("permintaan_perpindahan_kursi")
      .select(
        `
        *
      `
      )
      .eq("perpindahan_id", changeRequestId)
      .single();

    if (changeError || !changeRequest) {
      console.error("Change request not found:", changeError);
      return NextResponse.json(
        {
          success: false,
          error: "Permintaan perpindahan tidak ditemukan",
        },
        { status: 404 }
      );
    }

    console.log("Change request data:", changeRequest);

    // Get target seat info
    const { data: targetSeat, error: targetSeatError } = await supabase.from("jadwal_kursi").select("kode_kursi").eq("jadwal_kursi_id", changeRequest.jadwal_kursi_tujuan_id).single();

    // Get source ticket info
    const { data: sourceTicket, error: sourceTicketError } = await supabase.from("tiket").select("jadwal_kursi_id").eq("tiket_id", changeRequest.tiket_asal_id).single();

    if (sourceTicketError || !sourceTicket) {
      throw new Error("Source ticket not found");
    }

    if (targetSeatError || !targetSeat) {
      throw new Error("Target seat not found");
    }

    // Start transaction-like operations
    console.log("Step 1: Update payment status");
    const { error: paymentUpdateError } = await supabase
      .from("pembayaran")
      .update({
        status_pembayaran: "BERHASIL",
        tanggal_pembayaran: new Date().toISOString(),
      })
      .eq("pemesanan_id", -changeRequestId);

    if (paymentUpdateError) {
      console.error("Payment update error:", paymentUpdateError);
      throw new Error("Gagal mengupdate status pembayaran");
    }

    console.log("Step 2: Update ticket to new seat");
    const { error: ticketUpdateError } = await supabase.from("tiket").update({ jadwal_kursi_id: changeRequest.jadwal_kursi_tujuan_id }).eq("tiket_id", changeRequest.tiket_asal_id);

    if (ticketUpdateError) {
      console.error("Ticket update error:", ticketUpdateError);
      throw new Error("Gagal mengupdate tiket");
    }

    console.log("Step 3: Mark old seat as available");
    const { error: oldSeatError } = await supabase.from("jadwal_kursi").update({ status_inventaris: "TERSEDIA" }).eq("jadwal_kursi_id", sourceTicket.jadwal_kursi_id);

    if (oldSeatError) {
      console.error("Old seat update error:", oldSeatError);
      throw new Error("Gagal membebaskan kursi lama");
    }

    console.log("Step 4: Mark new seat as taken");
    const { error: newSeatError } = await supabase.from("jadwal_kursi").update({ status_inventaris: "TERISI" }).eq("jadwal_kursi_id", changeRequest.jadwal_kursi_tujuan_id);

    if (newSeatError) {
      console.error("New seat update error:", newSeatError);
      throw new Error("Gagal mengunci kursi baru");
    }

    console.log("Step 5: Update change request status");
    const { error: requestUpdateError } = await supabase
      .from("permintaan_perpindahan_kursi")
      .update({
        status_perpindahan: "DISETUJUI",
        tanggal_persetujuan: new Date().toISOString(),
      })
      .eq("perpindahan_id", changeRequestId);

    if (requestUpdateError) {
      console.error("Request update error:", requestUpdateError);
      throw new Error("Gagal mengupdate status permintaan");
    }

    console.log("Seat change completed successfully!");

    return NextResponse.json({
      success: true,
      message: "Perpindahan kursi berhasil",
      changeRequestId,
      newSeat: targetSeat.kode_kursi,
    });
  } catch (error) {
    console.error("=== COMPLETE SEAT CHANGE ERROR ===");
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during seat change completion",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function handleCancelSeatChange(body: any) {
  try {
    console.log("=== CANCEL SEAT CHANGE ===");
    const supabase = createClient() as any;
    const { changeRequestId } = body;

    console.log("Input data:", { changeRequestId });

    if (!changeRequestId) {
      console.error("Missing changeRequestId");
      return NextResponse.json(
        {
          success: false,
          error: "ID permintaan perpindahan tidak ditemukan",
        },
        { status: 400 }
      );
    }

    console.log("Cancelling seat change for request ID:", changeRequestId);

    console.log("Updating payment status to failed...");
    const { error: paymentError } = await supabase.from("pembayaran").update({ status_pembayaran: "GAGAL" }).eq("pemesanan_id", -changeRequestId);

    if (paymentError) {
      console.error("Payment update error:", paymentError);
      return NextResponse.json(
        {
          success: false,
          error: "Error saat membatalkan pembayaran",
          details: paymentError,
        },
        { status: 500 }
      );
    }

    console.log("Updating change request status to cancelled...");
    const { error: requestError } = await supabase
      .from("permintaan_perpindahan_kursi")
      .update({
        status_perpindahan: "DIBATALKAN",
        tanggal_pembatalan: new Date().toISOString(),
      })
      .eq("perpindahan_id", changeRequestId);

    if (requestError) {
      console.error("Request update error:", requestError);
      return NextResponse.json(
        {
          success: false,
          error: "Error saat membatalkan permintaan perpindahan",
          details: requestError,
        },
        { status: 500 }
      );
    }

    console.log("Seat change cancelled successfully!");

    return NextResponse.json({
      success: true,
      message: "Perpindahan kursi dibatalkan",
      changeRequestId,
    });
  } catch (error) {
    console.error("=== CANCEL SEAT CHANGE ERROR ===");
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error during seat change cancellation",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
