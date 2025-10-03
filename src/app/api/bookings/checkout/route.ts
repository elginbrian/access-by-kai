import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase";
import { evaluateFraud } from "@/lib/antiFraud/simpleRules";
import { midtransService } from "@/lib/midtrans";
import * as jadwalKursiSvc from "@/lib/mcp/services/jadwal_kursi";

const supabase = createClient();

async function verifyCaptcha(token?: string | null, remoteIp?: string | null): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) {
    console.warn("RECAPTCHA_SECRET not configured; rejecting captcha verification");
    return false;
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    if (remoteIp) params.append("remoteip", remoteIp);

    const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = await resp.json();
    if (!data || !data.success) return false;
    if (typeof data.score === "number") {
      return data.score >= 0.5;
    }
    return true;
  } catch (e) {
    console.warn("Error verifying captcha:", e);
    return false;
  }
}

const BookingPassengerSchema = z.object({
  name: z.string(),
  idNumber: z.string().optional(),
  idType: z.string().optional(),
  seat: z.string().optional(),
  seatType: z.string().optional(),
});

const BookingFoodSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  forPassenger: z.string(),
  image: z.string().optional(),
});

const CheckoutRequestSchema = z.object({
  bookingData: z.object({
    journey: z.object({
      jadwalId: z.number(),
      trainName: z.string(),
      trainCode: z.string(),
      departureTime: z.string(),
      departureStation: z.string(),
      departureDate: z.string(),
      arrivalTime: z.string(),
      arrivalStation: z.string(),
      arrivalDate: z.string(),
    }),
    booker: z.object({
      fullName: z.string(),
      email: z.string(),
      phone: z.string(),
    }),
    passengers: z.array(BookingPassengerSchema),
    foodOrders: z.array(BookingFoodSchema).optional(),
    pricing: z.object({
      trainTickets: z.number(),
      foodTotal: z.number(),
      serviceFee: z.number(),
      total: z.number(),
    }),
  }),
  userId: z.number().optional(),
  captchaToken: z.string().optional(),
  enabledPayments: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingData, userId, captchaToken, enabledPayments } = CheckoutRequestSchema.parse(body);

    if (!userId) {
      return NextResponse.json({ error: "User must be authenticated to create a booking" }, { status: 401 });
    }

    try {
      const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null;
      const fraudResult = await evaluateFraud({ supabase, userId, ip, passengerCount: (bookingData.passengers || []).length, totalAmount: bookingData.pricing.total });
      if (fraudResult.action === "block") {
        try {
          await (supabase as any).from("fraud_events").insert({ user_id: userId || null, ip: ip || null, reason: fraudResult.reason || "blocked_by_rule", score: fraudResult.score || 1, created_at: new Date().toISOString() });
        } catch (e) {}
        return NextResponse.json({ error: "Pemesanan diblokir karena aktivitas mencurigakan" }, { status: 403 });
      }
      if (fraudResult.action === "flag") {
        try {
          await (supabase as any).from("fraud_events").insert({ user_id: userId || null, ip: ip || null, reason: fraudResult.reason || "flagged_by_rule", score: fraudResult.score || 0.5, created_at: new Date().toISOString() });
        } catch (e) {}

        // Require captcha when flagged. If client did not provide a valid captcha, tell them to solve it.
        const captchaOk = await verifyCaptcha(captchaToken);
        if (!captchaOk) {
          return NextResponse.json({ error: "Captcha required", captchaRequired: true }, { status: 428 });
        }
      }
    } catch (e) {
      console.warn("Failed to run anti-fraud check", e);
    }

    const rawCode = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
    const kodePemesanan = rawCode.slice(0, 12);

    const pemesananInsert = {
      kode_pemesanan: kodePemesanan,
      user_id: userId || null,
      total_bayar: bookingData.pricing.total,
      biaya_admin: bookingData.pricing.serviceFee || 0,
      status_pemesanan: "MENUNGGU_PEMBAYARAN",
      waktu_pembuatan: new Date().toISOString(),
    } as any;

    const { data: pemesanan, error: pemesananError } = await supabase.from("pemesanan").insert(pemesananInsert).select().single();
    if (pemesananError || !pemesanan) {
      console.error("Failed to create pemesanan", pemesananError);
      return NextResponse.json({ error: "Gagal membuat pemesanan" }, { status: 500 });
    }

    const pemesananId = pemesanan.pemesanan_id;

    // Create pemesanan_segment(s) and penumpang + tiket
    const passengers = bookingData.passengers || [];

    let stasiunAsalId = 0;
    let stasiunTujuanId = 0;
    try {
      const { data: stops, error: stopsError } = await supabase.from("perhentian_jadwal").select("stasiun_id, urutan").eq("jadwal_id", bookingData.journey.jadwalId).order("urutan", { ascending: true });

      if (stopsError) {
        console.error("Failed to fetch perhentian_jadwal", stopsError);
      } else if (stops && Array.isArray(stops) && stops.length > 0) {
        stasiunAsalId = (stops[0] as any).stasiun_id;
        stasiunTujuanId = (stops[stops.length - 1] as any).stasiun_id;
      }
    } catch (e) {
      console.error("Error fetching perhentian_jadwal", e);
    }

    if (!stasiunAsalId || !stasiunTujuanId) {
      await supabase.from("pemesanan").delete().eq("pemesanan_id", pemesananId);
      console.error("No perhentian_jadwal found for jadwal id", bookingData.journey.jadwalId);
      return NextResponse.json({ error: "Gagal menentukan stasiun asal/tujuan untuk jadwal" }, { status: 500 });
    }

    const segmentInsert = {
      pemesanan_id: pemesananId,
      jadwal_id: bookingData.journey.jadwalId,
      stasiun_asal_id: stasiunAsalId,
      stasiun_tujuan_id: stasiunTujuanId,
      urutan_segment: 1,
      waktu_berangkat: bookingData.journey.departureTime,
      waktu_tiba: bookingData.journey.arrivalTime,
      harga_segment: bookingData.pricing.trainTickets,
    } as any;

    const { data: segment, error: segmentError } = await supabase.from("pemesanan_segment").insert(segmentInsert).select().single();
    if (segmentError || !segment) {
      console.error("Failed to create pemesanan_segment", segmentError);

      await supabase.from("pemesanan").delete().eq("pemesanan_id", pemesananId);
      return NextResponse.json({ error: "Gagal membuat pemesanan segment" }, { status: 500 });
    }

    const createdTickets: any[] = [];

    for (const p of passengers) {
      const penumpangPayload = {
        nama_lengkap: p.name,
        nomor_identitas: p.idNumber || "",
        user_id: userId || null,
        tipe_identitas: p.idType || "KTP",
      } as any;

      let penumpang: any = null;
      let penumpangCreated = false;

      try {
        const { data: penumpangRes, error: penumpangError } = await supabase.from("penumpang").insert(penumpangPayload).select().single();
        if (!penumpangError && penumpangRes) {
          penumpang = penumpangRes;
          penumpangCreated = true;
        } else if (penumpangError) {
          if ((penumpangError as any).code === "23505") {
            try {
              const { data: existing } = await supabase.from("penumpang").select().match({ tipe_identitas: penumpangPayload.tipe_identitas, nomor_identitas: penumpangPayload.nomor_identitas }).limit(1).maybeSingle();
              if (existing) {
                penumpang = existing;
                penumpangCreated = false;
              } else {
                console.error("Duplicate key but could not find existing penumpang", penumpangError);
                await supabase.from("pemesanan_segment").delete().eq("pemesanan_id", pemesananId);
                await supabase.from("pemesanan").delete().eq("pemesanan_id", pemesananId);
                return NextResponse.json({ error: "Gagal membuat data penumpang" }, { status: 500 });
              }
            } catch (fetchErr) {
              console.error("Error fetching existing penumpang after duplicate error", fetchErr);
              await supabase.from("pemesanan_segment").delete().eq("pemesanan_id", pemesananId);
              await supabase.from("pemesanan").delete().eq("pemesanan_id", pemesananId);
              return NextResponse.json({ error: "Gagal membuat data penumpang" }, { status: 500 });
            }
          } else {
            console.error("Failed to create penumpang", penumpangError);
            await supabase.from("pemesanan_segment").delete().eq("pemesanan_id", pemesananId);
            await supabase.from("pemesanan").delete().eq("pemesanan_id", pemesananId);
            return NextResponse.json({ error: "Gagal membuat data penumpang" }, { status: 500 });
          }
        }
      } catch (e) {
        console.error("Error inserting penumpang", e);
        await supabase.from("pemesanan_segment").delete().eq("pemesanan_id", pemesananId);
        await supabase.from("pemesanan").delete().eq("pemesanan_id", pemesananId);
        return NextResponse.json({ error: "Gagal membuat data penumpang" }, { status: 500 });
      }

      // Generate kode_tiket
      const kodeTiket = `TKT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      let jadwalKursiId: number | null = null;

      // First try: if passenger provided a seat code, prefer an existing jadwal_kursi
      if (p.seat) {
        const { data: kursiRes } = await supabase.from("jadwal_kursi").select("jadwal_kursi_id, jadwal_gerbong_id, template_kursi_id, status_inventaris, is_blocked").eq("kode_kursi", p.seat).limit(1).maybeSingle();

        if (kursiRes && (kursiRes as any).jadwal_kursi_id && (kursiRes as any).status_inventaris === "TERSEDIA" && !(kursiRes as any).is_blocked) {
          jadwalKursiId = (kursiRes as any).jadwal_kursi_id;
        }
      }

      // If still not found, we need to look for available seats by comparing template_kursi <> jadwal_kursi
      if (!jadwalKursiId) {
        try {
          // Get jadwal_gerbong rows for this jadwal so we can map master_gerbong -> jadwal_gerbong
          let { data: jadwalGerbongs } = await supabase.from("jadwal_gerbong").select("jadwal_gerbong_id, master_gerbong_id, nomor_gerbong_aktual").eq("jadwal_id", bookingData.journey.jadwalId);

          if (!jadwalGerbongs || (Array.isArray(jadwalGerbongs) && jadwalGerbongs.length === 0)) {
            try {
              const { data: jadwalRow } = await supabase.from("jadwal").select("master_kereta_id").eq("jadwal_id", bookingData.journey.jadwalId).single();
              if (jadwalRow && (jadwalRow as any).master_kereta_id) {
                const masterKeretaId = (jadwalRow as any).master_kereta_id;

                const { data: masterGerbongs } = await supabase.from("master_gerbong").select("master_gerbong_id, nomor_gerbong").eq("master_kereta_id", masterKeretaId).order("nomor_gerbong", { ascending: true });
                if (masterGerbongs && Array.isArray(masterGerbongs) && masterGerbongs.length > 0) {
                  // insert jadwal_gerbong rows for this jadwal; the DB trigger on jadwal_gerbong will create jadwal_kursi from template
                  const toInsert = masterGerbongs.map((mg: any) => ({ jadwal_id: bookingData.journey.jadwalId, master_gerbong_id: mg.master_gerbong_id, nomor_gerbong_aktual: mg.nomor_gerbong }));
                  const { data: created, error: createErr } = await supabase.from("jadwal_gerbong").insert(toInsert).select();
                  if (createErr) {
                    console.error("Failed to materialize jadwal_gerbong from master_gerbong", createErr);
                  } else {
                    jadwalGerbongs = created || [];
                  }
                }
              }
            } catch (e) {
              console.error("Error materializing jadwal_gerbong for jadwal", bookingData.journey.jadwalId, e);
            }
          }

          const jadwalGerbongIds = (jadwalGerbongs || []).map((g: any) => g.jadwal_gerbong_id).filter(Boolean);
          const masterGerbongIds = (jadwalGerbongs || []).map((g: any) => g.master_gerbong_id).filter(Boolean);

          if (masterGerbongIds.length === 0) {
            // no gerbong mapping, skip
          } else {
            // Align allocation with SeatSelection / AI: check each jadwal_gerbong for available jadwal_kursi first,
            // then fall back to template-based seats using the shared service helpers.
            for (const g of jadwalGerbongs || []) {
              try {
                // 1) Try actual jadwal_kursi available in this gerbong
                const existingList = await jadwalKursiSvc.listAvailableJadwalKursiByGerbong(g.jadwal_gerbong_id);
                if (existingList && existingList.length > 0) {
                  jadwalKursiId = (existingList[0] as any).jadwalKursiId || (existingList[0] as any).jadwalKursiId;
                  break;
                }

                // 2) Fallback: get template-based available seats for this jadwal/gerbong
                const tmplSeats = await jadwalKursiSvc.listAvailableTemplateKursiByGerbong(bookingData.journey.jadwalId, g.nomor_gerbong_aktual);
                if (tmplSeats && tmplSeats.length > 0) {
                  const chosen = tmplSeats[0] as any;
                  // create concrete jadwal_kursi for this template in this jadwal_gerbong
                  const toInsert: any = {
                    jadwal_gerbong_id: g.jadwal_gerbong_id,
                    template_kursi_id: chosen.templateKursiId || chosen.jadwalKursiId || null,
                    kode_kursi: chosen.kodeKursi || chosen.kode_kursi,
                    status_inventaris: "TERSEDIA",
                    harga_kursi: 0,
                    multiplier_kursi: chosen.multiplierKursi || 1.0,
                  };

                  try {
                    // Try an upsert-style insert: if another worker inserts the same (jadwal_gerbong_id, kode_kursi), do nothing
                    // then try to select the row — this reduces the race window compared to naive insert+requery.
                    try {
                      const { data: created, error: createErr } = await supabase.from("jadwal_kursi").insert(toInsert).select().single();
                      if (!createErr && created && (created as any).jadwal_kursi_id) {
                        jadwalKursiId = (created as any).jadwal_kursi_id;
                        break;
                      }
                    } catch (insertErr) {
                      // insert may fail due to unique constraint if another worker created it concurrently — we'll re-select below
                      console.error("jadwal_kursi insert attempt failed (possibly concurrent):", insertErr, "toInsert:", toInsert);
                    }

                    // Re-select the row that should exist now (either created by us or by a concurrent worker)
                    const { data: fetched, error: fetchErr } = await supabase
                      .from("jadwal_kursi")
                      .select("jadwal_kursi_id, status_inventaris, is_blocked")
                      .eq("jadwal_gerbong_id", toInsert.jadwal_gerbong_id)
                      .eq("kode_kursi", toInsert.kode_kursi)
                      .limit(1)
                      .maybeSingle();

                    if (fetchErr) {
                      console.error("Error fetching jadwal_kursi after upsert attempt", fetchErr, "toInsert:", toInsert);
                    } else if (fetched && (fetched as any).jadwal_kursi_id && (fetched as any).status_inventaris === "TERSEDIA" && !(fetched as any).is_blocked) {
                      jadwalKursiId = (fetched as any).jadwal_kursi_id;
                      break;
                    }
                  } catch (e) {
                    console.error("Error during upsert/select jadwal_kursi", e, toInsert);
                  }
                }
              } catch (e) {
                console.error("Error checking gerbong availability for jadwal_gerbong", g, e);
              }
            }

            if (!jadwalKursiId) {
              console.error("Seat allocation failed: counts => jadwalGerbongIds:", jadwalGerbongIds.length, "masterGerbongIds:", masterGerbongIds.length);
            }
          }
        } catch (e) {
          console.error("Error selecting available seat (template-aware)", e);
        }
      }

      const tiketInsert: any = {
        kode_tiket: kodeTiket,
        penumpang_id: penumpang.penumpang_id,
        segment_id: segment.segment_id,
        harga_tiket: Math.round(bookingData.pricing.trainTickets / Math.max(1, passengers.length)),
        status_tiket: "AKTIF",
      } as any;

      if (jadwalKursiId) {
        tiketInsert.jadwal_kursi_id = jadwalKursiId;
      } else {
        console.error("No available jadwal_kursi found for jadwal", bookingData.journey.jadwalId);

        // Build small diagnostics to return to client for easier triage.
        // Recompute the jadwal_gerbong & master lists so scope is local and reliable.
        const diagnostics: any = { jadwalId: bookingData.journey.jadwalId };
        try {
          const { data: jadwalGerbongs2 } = await supabase.from("jadwal_gerbong").select("jadwal_gerbong_id, master_gerbong_id").eq("jadwal_id", bookingData.journey.jadwalId);

          const jadwalGerbongIds2 = (jadwalGerbongs2 || []).map((g: any) => g.jadwal_gerbong_id).filter(Boolean);
          const masterGerbongIds2 = (jadwalGerbongs2 || []).map((g: any) => g.master_gerbong_id).filter(Boolean);

          diagnostics.jadwalGerbongsCount = (jadwalGerbongs2 || []).length;
          diagnostics.masterGerbongCount = masterGerbongIds2.length;

          try {
            const { data: tplRows } = await supabase
              .from("template_kursi")
              .select("template_kursi_id")
              .in("master_gerbong_id", masterGerbongIds2 || []);
            diagnostics.templateKursiFound = Array.isArray(tplRows) ? tplRows.length : 0;
          } catch (e) {
            diagnostics.templateKursiFound = "unknown";
          }

          try {
            const { data: jkRows } = await supabase
              .from("jadwal_kursi")
              .select("jadwal_kursi_id")
              .in("jadwal_gerbong_id", jadwalGerbongIds2 || []);
            diagnostics.jadwalKursiExisting = Array.isArray(jkRows) ? jkRows.length : 0;
          } catch (e) {
            diagnostics.jadwalKursiExisting = "unknown";
          }
        } catch (e) {
          diagnostics.error = "failed_to_collect_gerbong_info";
        }

        if (penumpangCreated) {
          await supabase.from("penumpang").delete().eq("penumpang_id", penumpang.penumpang_id);
        }
        await supabase.from("pemesanan_segment").delete().eq("pemesanan_id", pemesananId);
        await supabase.from("pemesanan").delete().eq("pemesanan_id", pemesananId);
        return NextResponse.json({ error: "Tidak ada kursi tersedia untuk jadwal ini", diagnostics }, { status: 500 });
      }

      const { data: tiket, error: tiketError } = await supabase
        .from("tiket")
        .insert(tiketInsert as any)
        .select()
        .single();
      if (tiketError || !tiket) {
        console.error("Failed to create tiket", tiketError);
        if (penumpangCreated) {
          await supabase.from("penumpang").delete().eq("penumpang_id", penumpang.penumpang_id);
        }
        await supabase.from("pemesanan_segment").delete().eq("pemesanan_id", pemesananId);
        await supabase.from("pemesanan").delete().eq("pemesanan_id", pemesananId);
        return NextResponse.json({ error: "Gagal membuat tiket" }, { status: 500 });
      }

      createdTickets.push(tiket);
    }

    // Insert pembayaran record
    const orderId = `ORDER-${pemesananId}-${Date.now()}`;

    const { data: payment, error: paymentError } = await supabase
      .from("pembayaran")
      .insert({
        pemesanan_id: pemesananId,
        jumlah: bookingData.pricing.total,
        metode_pembayaran: "MIDTRANS",
        status_pembayaran: "MENUNGGU",
        id_transaksi_eksternal: orderId,
      })
      .select()
      .single();

    if (paymentError || !payment) {
      console.error("Failed to create pembayaran", paymentError);

      await supabase
        .from("tiket")
        .delete()
        .in(
          "tiket_id",
          createdTickets.map((t) => t.tiket_id)
        );
      await supabase.from("pemesanan_segment").delete().eq("pemesanan_id", pemesananId);
      await supabase.from("pemesanan").delete().eq("pemesanan_id", pemesananId);
      return NextResponse.json({ error: "Gagal membuat pembayaran" }, { status: 500 });
    }

    try {
      const expireDate = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      await supabase.from("pemesanan").update({ batas_waktu_pembayaran: expireDate }).eq("pemesanan_id", pemesananId);
    } catch (e) {
      console.error("Failed to set batas_waktu_pembayaran", e);
    }
    try {
      const seatIds = createdTickets.map((t) => (t && (t as any).jadwal_kursi_id ? (t as any).jadwal_kursi_id : null)).filter(Boolean);
      if (seatIds.length > 0) {
        await supabase.from("jadwal_kursi").update({ status_inventaris: "DIKUNCI" }).in("jadwal_kursi_id", seatIds);
      }
    } catch (e) {
      console.error("Failed to lock seats", e);
    }

    // Fetch station rows for origin/destination so client can use authoritative data
    let stationAsal: any = null;
    let stationTujuan: any = null;
    try {
      const { data: stations, error: stationError } = await supabase.from("stasiun").select("stasiun_id, kode_stasiun, nama_stasiun, kota, provinsi").in("stasiun_id", [stasiunAsalId, stasiunTujuanId]);

      if (stationError) {
        console.error("Failed to fetch stasiun rows", stationError);
      } else if (stations && Array.isArray(stations)) {
        stationAsal = stations.find((s: any) => s.stasiun_id === stasiunAsalId) || null;
        stationTujuan = stations.find((s: any) => s.stasiun_id === stasiunTujuanId) || null;
      }
    } catch (e) {
      console.error("Error fetching stasiun data", e);
    }

    // Build midtrans transaction object
    const itemDetails: any[] = [
      {
        id: `train-${bookingData.journey.jadwalId}`,
        name: `${bookingData.journey.trainName} (${bookingData.journey.trainCode})`,
        price: bookingData.pricing.trainTickets,
        quantity: bookingData.passengers.length,
      },
    ];

    (bookingData.foodOrders || []).forEach((food) => {
      itemDetails.push({ id: `food-${food.id}`, name: food.name, price: food.price, quantity: food.quantity });
    });

    if (bookingData.pricing.serviceFee > 0) {
      itemDetails.push({ id: "service-fee", name: "Biaya Layanan", price: bookingData.pricing.serviceFee, quantity: 1 });
    }

    const customerDetails = {
      first_name: bookingData.booker.fullName.split(" ")[0] || "",
      last_name: bookingData.booker.fullName.split(" ").slice(1).join(" ") || "",
      email: bookingData.booker.email,
      phone: bookingData.booker.phone,
    };

    const transactionDetails: any = {
      transaction_details: { order_id: orderId, gross_amount: bookingData.pricing.total },
      item_details: itemDetails,
      customer_details: customerDetails,
      enabled_payments: enabledPayments || ["credit_card", "bca_va", "gopay", "qris"],
      callbacks: { finish: `${process.env.NEXT_PUBLIC_APP_URL}/trains/payment/success?order_id=${orderId}` },
      expiry: { unit: "hour", duration: 2 },
    };

    // Create snap token using midtransService
    const snapToken = await midtransService.createSnapToken(transactionDetails as any);

    // update pembayaran with partial info
    await supabase.from("pembayaran").update({ id_transaksi_eksternal: orderId }).eq("pembayaran_id", payment.pembayaran_id);

    return NextResponse.json({
      success: true,
      pemesananId,
      paymentId: payment.pembayaran_id,
      orderId,
      snapToken,
      clientConfig: midtransService.getClientConfig(),
      stations: { asal: stationAsal, tujuan: stationTujuan },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
